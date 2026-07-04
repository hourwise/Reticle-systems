import { supabase } from '@/lib/supabaseClient'
import type { StorageAdapter, StoredProject, StoredReport } from './types'

// ─── Adapter ─────────────────────────────────────────────────────

/**
 * Supabase PostgreSQL adapter.
 *
 * Uses Supabase client with auto-RLS enforcement.
 * All queries are automatically scoped to the authenticated user
 * via Row-Level Security policies.
 */
export const supabaseAdapter: StorageAdapter = {
  provider: 'Supabase',

  isReady: () => true,

  // ── Projects ──────────────────────────────────────────────────

  async saveProject(project: StoredProject): Promise<void> {
    const now = new Date().toISOString()

    const { error } = await supabase.from('projects').upsert(
      {
        id: project.id,
        user_id: project.userId,
        name: project.name,
        website_url: project.websiteUrl || null,
        repo_url: null, // future
        builder_used: project.builderUsed || null,
        backend_used: project.backendUsed || null,
        status: project.status || 'idea',
        target_audience: project.targetAudience || null,
        created_at: project.createdAt || now,
        updated_at: now,
      },
      { onConflict: 'id' },
    )

    if (error) throw error
  },

  async getProject(projectId: string): Promise<StoredProject | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // no rows
      throw error
    }

    return data ? mapProject(data) : null
  },

  async listProjects(userId: string): Promise<StoredProject[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return (data || []).map(mapProject)
  },

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', projectId)
    if (error) throw error
  },

  // ── Reports ───────────────────────────────────────────────────

  async saveReport(report: StoredReport): Promise<void> {
    const { error } = await supabase.from('reports').upsert(
      {
        id: report.id,
        audit_job_id: '00000000-0000-0000-0000-000000000000', // placeholder until real audit jobs
        project_id: report.projectId,
        user_id: report.userId,
        report_json: { scores: report.scores, summary: report.summary },
        plain_english_summary: report.summary,
        launch_readiness_score: report.scores.launchReadiness,
        security_score: report.scores.security,
        seo_score: report.scores.seo,
        growth_score: report.scores.growth,
        created_at: report.createdAt,
      },
      { onConflict: 'id' },
    )

    if (error) throw error
  },

  async getReport(reportId: string): Promise<StoredReport | null> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data ? mapReport(data) : null
  },

  async listReports(projectId: string): Promise<StoredReport[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map(mapReport)
  },

  // ── File uploads ──────────────────────────────────────────────

  async uploadFile(path: string, file: File): Promise<string> {
    const { error } = await supabase.storage.from('uploads').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) throw error

    const { data } = supabase.storage.from('uploads').getPublicUrl(path)
    return data.publicUrl
  },

  async getFileUrl(path: string): Promise<string> {
    const { data } = supabase.storage.from('uploads').getPublicUrl(path)
    return data.publicUrl
  },
}

// ─── Mappers ─────────────────────────────────────────────────────

interface ProjectRow {
  id: string
  user_id: string
  name: string
  website_url: string | null
  builder_used: string | null
  backend_used: string | null
  status: string | null
  target_audience: string | null
  created_at: string
  updated_at: string
}

interface ReportRow {
  id: string
  project_id: string
  user_id: string
  report_json: Record<string, unknown>
  plain_english_summary: string | null
  launch_readiness_score: number
  security_score: number
  seo_score: number
  growth_score: number
  created_at: string
}

function mapProject(row: ProjectRow): StoredProject {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    websiteUrl: row.website_url || '',
    builderUsed: row.builder_used,
    backendUsed: row.backend_used,
    status: row.status,
    auditType: null,
    hasAuth: null,
    storesUserData: null,
    acceptsPayments: null,
    targetAudience: row.target_audience || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapReport(row: ReportRow): StoredReport {
  return {
    id: row.id,
    projectId: row.project_id,
    userId: row.user_id,
    scores: {
      security: row.security_score,
      launchReadiness: row.launch_readiness_score,
      seo: row.seo_score,
      growth: row.growth_score,
    },
    summary: row.plain_english_summary,
    createdAt: row.created_at,
  }
}
