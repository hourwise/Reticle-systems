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

// ─── Verification types (Phase 5) ────────────────────────────────

export type VerificationStatus =
  | 'not_started'
  | 'user_claimed_fixed'
  | 'verified'
  | 'still_failing'
  | 'not_applicable'

export interface StoredFinding {
  id: string
  auditJobId: string
  projectId: string
  userId: string
  category: string
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
  title: string
  explanation: string | null
  filePath: string | null
  lineNumber: number | null
  redactedSnippet: string | null
  fixSummary: string | null
  sourceTool: string
  verificationStatus: VerificationStatus
  createdAt: string
  updatedAt: string
}

export interface StoredRepairPrompt {
  id: string
  findingId: string
  projectId: string
  userId: string
  builder: string
  promptTitle: string
  promptBody: string
  constraints: string[]
  verificationSteps: string[]
  createdAt: string
}

export interface VerificationAttempt {
  id: string
  findingId: string
  projectId: string
  userId: string
  previousStatus: string
  newStatus: 'verified' | 'still_failing' | 'manual_review_needed'
  scoreBefore: Record<string, number>
  scoreAfter: Record<string, number>
  note: string | null
  createdAt: string
}

export interface ScoreSummary {
  securityScore: number
  launchScore: number
  seoScore: number
  growthScore: number
  totalFindings: number
  criticalCount: number
  highCount: number
  verifiedCount: number
  stillFailingCount: number
}

// ─── Growth Plan types (Phase 6) ─────────────────────────────────

export type GrowthCategory = 'seo' | 'conversion' | 'social' | 'positioning' | 'email' | 'launch' | 'content' | 'analytics'

export interface StoredGrowthPlan {
  id: string
  projectId: string
  userId: string
  seoScore: number
  conversionScore: number
  positioningScore: number
  summary: string | null
  status: 'draft' | 'active' | 'archived'
  generatedAt: string
  createdAt: string
}

export interface StoredGrowthRecommendation {
  id: string
  planId: string
  projectId: string
  userId: string
  category: GrowthCategory
  priority: number
  title: string
  description: string
  actionItems: string[]
  estimatedImpact: 'low' | 'medium' | 'high'
  completed: boolean
  completedAt: string | null
  createdAt: string
}

export interface LaunchCalendarItem {
  id: string
  planId: string
  projectId: string
  userId: string
  weekNumber: number
  taskTitle: string
  taskDescription: string
  category: 'social' | 'content' | 'outreach' | 'technical' | 'review' | 'launch'
  completed: boolean
  completedAt: string | null
  dueDate: string | null
  createdAt: string
}

// ─── Professionalisation types (Phase 8) ─────────────────────────

export interface ProfessionalisationProgress {
  id: string
  projectId: string
  userId: string
  currentLevel: number
  level1Exported: boolean
  level2GithubStored: boolean
  level3EnvExampleCreated: boolean
  level4BuildWorks: boolean
  level5SecurityFixed: boolean
  level6RulesVerified: boolean
  level7WebhooksVerified: boolean
  level8CiAdded: boolean
  level9MonitoringEnabled: boolean
  level10ChecklistDone: boolean
  level11LaunchPackDone: boolean
  level12ProductionReady: boolean
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface GithubMigrationGuide {
  id: string
  builder: string
  title: string
  description: string
  steps: MigrationStep[]
  gitignoreRules: string[]
  envExampleVars: string[]
}

export interface MigrationStep {
  order: number
  title: string
  detail: string
  tip: string
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

  // ── Project Answers ──
  saveProjectAnswers: (projectId: string, userId: string, answers: Record<string, unknown>) => Promise<void>
  getProjectAnswers: (projectId: string) => Promise<Record<string, unknown>>

  // ── Reports ──
  saveReport: (report: StoredReport) => Promise<void>
  getReport: (reportId: string) => Promise<StoredReport | null>
  listReports: (projectId: string) => Promise<StoredReport[]>

  // ── File uploads (for ZIP scans later) ──
  uploadFile: (path: string, file: File) => Promise<string>
  getFileUrl: (path: string) => Promise<string>

  // ── Findings & Verification (Phase 5) ──
  saveFindings: (findings: StoredFinding[]) => Promise<void>
  getFindings: (projectId: string) => Promise<StoredFinding[]>
  updateFindingStatus: (findingId: string, status: VerificationStatus) => Promise<void>
  saveRepairPrompt: (prompt: StoredRepairPrompt) => Promise<void>
  getRepairPrompts: (findingId: string) => Promise<StoredRepairPrompt[]>
  logVerificationAttempt: (attempt: Omit<VerificationAttempt, 'id' | 'createdAt'>) => Promise<VerificationAttempt>
  getVerificationHistory: (findingId: string) => Promise<VerificationAttempt[]>

  // ── Growth Plans (Phase 6) ──
  saveGrowthPlan: (plan: StoredGrowthPlan) => Promise<void>
  getGrowthPlan: (projectId: string) => Promise<StoredGrowthPlan | null>
  saveRecommendations: (recs: StoredGrowthRecommendation[]) => Promise<void>
  getRecommendations: (planId: string) => Promise<StoredGrowthRecommendation[]>
  updateRecommendation: (id: string, completed: boolean) => Promise<void>
  saveCalendarItems: (items: LaunchCalendarItem[]) => Promise<void>
  getCalendarItems: (planId: string) => Promise<LaunchCalendarItem[]>
  updateCalendarItem: (id: string, completed: boolean) => Promise<void>

  // ── Professionalisation (Phase 8) ──
  getProgress: (projectId: string) => Promise<ProfessionalisationProgress | null>
  saveProgress: (progress: ProfessionalisationProgress) => Promise<void>
  updateProgressLevel: (projectId: string, level: number) => Promise<void>
  getMigrationGuide: (builder: string) => Promise<GithubMigrationGuide | null>
}
