import type {
  StorageAdapter,
  StoredProject,
  StoredReport,
  StoredFinding,
  StoredRepairPrompt,
  VerificationAttempt,
  VerificationStatus,
  StoredGrowthPlan,
  StoredGrowthRecommendation,
  LaunchCalendarItem,
  ProfessionalisationProgress,
  GithubMigrationGuide,
} from './types'

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

  // ── Project Answers ────────────────────────────────────────────

  async saveProjectAnswers(projectId: string, _userId: string, answers: Record<string, unknown>): Promise<void> {
    const key = `reticle_answers_${projectId}`
    localStorage.setItem(key, JSON.stringify(answers))
  },

  async getProjectAnswers(projectId: string): Promise<Record<string, unknown>> {
    const key = `reticle_answers_${projectId}`
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
    } catch {
      return {}
    }
  },

  // ── Findings & Verification (Phase 5) ─────────────────────────

  async saveFindings(findings: StoredFinding[]): Promise<void> {
    if (findings.length === 0) return
    const key = `reticle_findings_${findings[0].projectId}`
    const existing = load<StoredFinding>(key)
    const ids = new Set(findings.map((f) => f.id))
    const merged = [...existing.filter((f) => !ids.has(f.id)), ...findings]
    save(key, merged)
  },

  async getFindings(projectId: string): Promise<StoredFinding[]> {
    return load<StoredFinding>(`reticle_findings_${projectId}`)
  },

  async updateFindingStatus(findingId: string, status: VerificationStatus): Promise<void> {
    // Find which project key contains this finding
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('reticle_findings_')) {
        const findings = load<StoredFinding>(key)
        const idx = findings.findIndex((f) => f.id === findingId)
        if (idx >= 0) {
          findings[idx] = { ...findings[idx], verificationStatus: status, updatedAt: new Date().toISOString() }
          save(key, findings)
          return
        }
      }
    }
  },

  async saveRepairPrompt(prompt: StoredRepairPrompt): Promise<void> {
    const key = `reticle_prompts_${prompt.findingId}`
    const prompts = load<StoredRepairPrompt>(key)
    prompts.push(prompt)
    save(key, prompts)
  },

  async getRepairPrompts(findingId: string): Promise<StoredRepairPrompt[]> {
    return load<StoredRepairPrompt>(`reticle_prompts_${findingId}`)
  },

  async logVerificationAttempt(attempt: Omit<VerificationAttempt, 'id' | 'createdAt'>): Promise<VerificationAttempt> {
    const key = `reticle_verifications_${attempt.findingId}`
    const attempts = load<VerificationAttempt>(key)
    const record: VerificationAttempt = {
      id: crypto.randomUUID(),
      ...attempt,
      createdAt: new Date().toISOString(),
    }
    attempts.push(record)
    save(key, attempts)
    return record
  },

  async getVerificationHistory(findingId: string): Promise<VerificationAttempt[]> {
    return load<VerificationAttempt>(`reticle_verifications_${findingId}`)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  // ── Growth Plans (Phase 6) ────────────────────────────────────

  async saveGrowthPlan(plan: StoredGrowthPlan): Promise<void> {
    const key = `reticle_growth_plan_${plan.projectId}`
    localStorage.setItem(key, JSON.stringify(plan))
  },

  async getGrowthPlan(projectId: string): Promise<StoredGrowthPlan | null> {
    const key = `reticle_growth_plan_${projectId}`
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as StoredGrowthPlan) : null
    } catch {
      return null
    }
  },

  async saveRecommendations(recs: StoredGrowthRecommendation[]): Promise<void> {
    if (recs.length === 0) return
    const key = `reticle_growth_recs_${recs[0].planId}`
    localStorage.setItem(key, JSON.stringify(recs))
  },

  async getRecommendations(planId: string): Promise<StoredGrowthRecommendation[]> {
    const key = `reticle_growth_recs_${planId}`
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as StoredGrowthRecommendation[]) : []
    } catch {
      return []
    }
  },

  async updateRecommendation(id: string, completed: boolean): Promise<void> {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('reticle_growth_recs_')) {
        const recs = load<StoredGrowthRecommendation>(key)
        const idx = recs.findIndex((r) => r.id === id)
        if (idx >= 0) {
          recs[idx] = { ...recs[idx], completed, completedAt: completed ? new Date().toISOString() : null }
          save(key, recs)
          return
        }
      }
    }
  },

  async saveCalendarItems(items: LaunchCalendarItem[]): Promise<void> {
    if (items.length === 0) return
    const key = `reticle_calendar_${items[0].planId}`
    localStorage.setItem(key, JSON.stringify(items))
  },

  async getCalendarItems(planId: string): Promise<LaunchCalendarItem[]> {
    const key = `reticle_calendar_${planId}`
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as LaunchCalendarItem[]) : []
    } catch {
      return []
    }
  },

  async updateCalendarItem(id: string, completed: boolean): Promise<void> {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('reticle_calendar_')) {
        const items = load<LaunchCalendarItem>(key)
        const idx = items.findIndex((item) => item.id === id)
        if (idx >= 0) {
          items[idx] = { ...items[idx], completed, completedAt: completed ? new Date().toISOString() : null }
          save(key, items)
          return
        }
      }
    }
  },

  // ── Professionalisation (Phase 8) ──────────────────────────────

  async getProgress(projectId: string): Promise<ProfessionalisationProgress | null> {
    const key = `reticle_progress_${projectId}`
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as ProfessionalisationProgress) : null
    } catch {
      return null
    }
  },

  async saveProgress(progress: ProfessionalisationProgress): Promise<void> {
    const key = `reticle_progress_${progress.projectId}`
    localStorage.setItem(key, JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }))
  },

  async updateProgressLevel(projectId: string, level: number): Promise<void> {
    const key = `reticle_progress_${projectId}`
    const raw = localStorage.getItem(key)
    if (raw) {
      const p: ProfessionalisationProgress = JSON.parse(raw)
      p.currentLevel = level
      p.updatedAt = new Date().toISOString()
      localStorage.setItem(key, JSON.stringify(p))
    }
  },

  async getMigrationGuide(builder: string): Promise<GithubMigrationGuide | null> {
    // Guides are seeded in Supabase — localStorage falls back to embedded guides
    return null // The hook will use embedded fallback guides
  },

  // ── File uploads ──────────────────────────────────────────────

  async uploadFile(_path: string, _file: File): Promise<string> {
    throw new Error('File uploads not supported with localStorage adapter. Use Supabase adapter.')
  },

  async getFileUrl(_path: string): Promise<string> {
    throw new Error('File retrieval not supported with localStorage adapter. Use Supabase adapter.')
  },
}
