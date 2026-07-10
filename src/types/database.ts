// User and auth types
export interface User {
  id: string
  email: string
  fullName?: string
  createdAt: string
  updatedAt: string
}

// Project types
export type ProjectStatus = 'idea' | 'pre_launch' | 'launched' | 'unknown'
export type AuditType = 'url_scan' | 'repo_scan' | 'zip_upload'

export interface Project {
  id: string
  userId: string
  name: string
  websiteUrl?: string
  repoUrl?: string
  builderUsed?: string
  status: ProjectStatus
  targetAudience?: string
  createdAt: string
  updatedAt: string
}

// Audit types
export type AuditStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
export type FindingSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical'

export interface AuditJob {
  id: string
  projectId: string
  userId: string
  auditType: AuditType
  status: AuditStatus
  startedAt?: string
  completedAt?: string
  errorMessage?: string
  createdAt: string
}

export interface AuditFinding {
  id: string
  auditJobId: string
  projectId: string
  category: string
  severity: FindingSeverity
  title: string
  explanation?: string
  filePath?: string
  lineNumber?: number
  redactedSnippet?: string
  fixSummary?: string
  sourceTool: string
  createdAt: string
}

// Report types
export interface ReportScores {
  security: number
  launchReadiness: number
  seo: number
  growth: number
}

export interface Report {
  id: string
  auditJobId: string
  projectId: string
  userId: string
  reportJson: Record<string, unknown>
  plainEnglishSummary?: string
  scores: ReportScores
  createdAt: string
}

// Answer types
export interface ProjectAnswer {
  id: string
  projectId: string
  questionKey: string
  answerValue: unknown
  createdAt: string
}

// Payment types
export interface Credit {
  id: string
  userId: string
  creditType: string
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  userId: string
  stripeCheckoutSessionId?: string
  stripePaymentIntentId?: string
  amountTotal?: number
  currency?: string
  status: string
  createdAt: string
}

