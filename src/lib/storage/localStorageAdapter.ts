import type { StorageAdapter, StoredProject, StoredReport } from './types'

const PROJECTS_KEY = 'reticle_projects'
const REPORTS_KEY = 'reticle_reports'

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export const localStorageAdapter: StorageAdapter = {
  provider: 'localStorage',

  isReady: () => true,

  // ── Projects ──────────────────────────────────────────────────

  async saveProject(project: StoredProject): Promise<void> {
    const projects = load<StoredProject>(PROJECTS_KEY)
    const idx = projects.findIndex((p) => p.id === project.id)
    const now = new Date().toISOString()

    if (idx >= 0) {
      projects[idx] = { ...project, updatedAt: now }
    } else {
      projects.push({
        ...project,
        createdAt: project.createdAt || now,
        updatedAt: now,
      })
    }

    save(PROJECTS_KEY, projects)
  },

  async getProject(projectId: string): Promise<StoredProject | null> {
    const projects = load<StoredProject>(PROJECTS_KEY)
    return projects.find((p) => p.id === projectId) ?? null
  },

  async listProjects(userId: string): Promise<StoredProject[]> {
    const projects = load<StoredProject>(PROJECTS_KEY)
    return projects
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  async deleteProject(projectId: string): Promise<void> {
    const projects = load<StoredProject>(PROJECTS_KEY).filter((p) => p.id !== projectId)
    save(PROJECTS_KEY, projects)

    // Cascade delete reports
    const reports = load<StoredReport>(REPORTS_KEY).filter((r) => r.projectId !== projectId)
    save(REPORTS_KEY, reports)
  },

  // ── Reports ───────────────────────────────────────────────────

  async saveReport(report: StoredReport): Promise<void> {
    const reports = load<StoredReport>(REPORTS_KEY)
    const idx = reports.findIndex((r) => r.id === report.id)

    if (idx >= 0) {
      reports[idx] = report
    } else {
      reports.push(report)
    }

    save(REPORTS_KEY, reports)
  },

  async getReport(reportId: string): Promise<StoredReport | null> {
    const reports = load<StoredReport>(REPORTS_KEY)
    return reports.find((r) => r.id === reportId) ?? null
  },

  async listReports(projectId: string): Promise<StoredReport[]> {
    const reports = load<StoredReport>(REPORTS_KEY)
    return reports
      .filter((r) => r.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  // ── File uploads ──────────────────────────────────────────────

  async uploadFile(_path: string, _file: File): Promise<string> {
    throw new Error('File uploads not supported with localStorage adapter. Use B2 adapter.')
  },

  async getFileUrl(_path: string): Promise<string> {
    throw new Error('File retrieval not supported with localStorage adapter. Use B2 adapter.')
  },
}
