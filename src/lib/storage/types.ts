import type { IntakeAnswers } from '@/stores/intakeStore'

// ─── Core data types ─────────────────────────────────────────────

export interface StoredProject {
  id: string
  userId: string
  name: string
  websiteUrl: string
  builderUsed: string | null
  backendUsed: string | null
  status: string | null
  auditType: string | null
  hasAuth: string | null
  storesUserData: string | null
  acceptsPayments: string | null
  targetAudience: string
  createdAt: string
  updatedAt: string
}

export interface StoredReport {
  id: string
  projectId: string
  userId: string
  scores: {
    security: number
    launchReadiness: number
    seo: number
    growth: number
  }
  summary: string | null
  createdAt: string
}

// ─── Adapter interface ───────────────────────────────────────────

export interface StorageAdapter {
  /** Provider name for logging */
  readonly provider: string

  // ── Auth (only relevant for cloud adapters) ──
  /** Whether the adapter requires explicit initialization */
  isReady: () => boolean

  // ── Projects ──
  saveProject: (project: StoredProject) => Promise<void>
  getProject: (projectId: string) => Promise<StoredProject | null>
  listProjects: (userId: string) => Promise<StoredProject[]>
  deleteProject: (projectId: string) => Promise<void>

  // ── Reports ──
  saveReport: (report: StoredReport) => Promise<void>
  getReport: (reportId: string) => Promise<StoredReport | null>
  listReports: (projectId: string) => Promise<StoredReport[]>

  // ── File uploads (for ZIP scans later) ──
  uploadFile: (path: string, file: File) => Promise<string>
  getFileUrl: (path: string) => Promise<string>
}
