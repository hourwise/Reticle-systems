import { supabase } from '@/lib/supabaseClient'
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
  MigrationStep,
} from './types'

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

  // ── Project Answers ────────────────────────────────────────────

  async saveProjectAnswers(projectId: string, userId: string, answers: Record<string, unknown>): Promise<void> {
    const rows = Object.entries(answers).map(([key, value]) => ({
      project_id: projectId,
      user_id: userId,
      question_key: key,
      answer_value: value,
    }))

    // Upsert: delete existing answers for this project, then insert
    const { error: deleteErr } = await supabase
      .from('project_answers')
      .delete()
      .eq('project_id', projectId)

    if (deleteErr) throw deleteErr

    if (rows.length > 0) {
      const { error } = await supabase.from('project_answers').insert(rows)
      if (error) throw error
    }
  },

  async getProjectAnswers(projectId: string): Promise<Record<string, unknown>> {
    const { data, error } = await supabase
      .from('project_answers')
      .select('question_key, answer_value')
      .eq('project_id', projectId)

    if (error) throw error

    const result: Record<string, unknown> = {}
    for (const row of data || []) {
      result[row.question_key] = row.answer_value
    }
    return result
  },

  // ── Findings & Verification (Phase 5) ──────────────────────────

  async saveFindings(findings: StoredFinding[]): Promise<void> {
    if (findings.length === 0) return

    const rows = findings.map((f) => ({
      id: f.id,
      audit_job_id: f.auditJobId,
      project_id: f.projectId,
      user_id: f.userId,
      category: f.category,
      severity: f.severity,
      title: f.title,
      explanation: f.explanation,
      file_path: f.filePath,
      line_number: f.lineNumber,
      redacted_snippet: f.redactedSnippet,
      fix_summary: f.fixSummary,
      source_tool: f.sourceTool,
      verification_status: f.verificationStatus,
      updated_at: new Date().toISOString(),
    }))

    // Delete existing findings for this audit job, then insert new ones
    const auditJobId = findings[0].auditJobId
    await supabase.from('audit_findings').delete().eq('audit_job_id', auditJobId)

    const { error } = await supabase.from('audit_findings').upsert(rows, { onConflict: 'id' })
    if (error) throw error
  },

  async getFindings(projectId: string): Promise<StoredFinding[]> {
    const { data, error } = await supabase
      .from('audit_findings')
      .select('*')
      .eq('project_id', projectId)
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(mapFinding)
  },

  async updateFindingStatus(findingId: string, status: VerificationStatus): Promise<void> {
    const { error } = await supabase
      .from('audit_findings')
      .update({ verification_status: status, updated_at: new Date().toISOString() })
      .eq('id', findingId)

    if (error) throw error
  },

  async saveRepairPrompt(prompt: StoredRepairPrompt): Promise<void> {
    const { error } = await supabase.from('repair_prompts').insert({
      id: prompt.id,
      finding_id: prompt.findingId,
      project_id: prompt.projectId,
      user_id: prompt.userId,
      builder: prompt.builder,
      prompt_title: prompt.promptTitle,
      prompt_body: prompt.promptBody,
      constraints: prompt.constraints,
      verification_steps: prompt.verificationSteps,
    })

    if (error) throw error
  },

  async getRepairPrompts(findingId: string): Promise<StoredRepairPrompt[]> {
    const { data, error } = await supabase
      .from('repair_prompts')
      .select('*')
      .eq('finding_id', findingId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      findingId: r.finding_id as string,
      projectId: r.project_id as string,
      userId: r.user_id as string,
      builder: r.builder as string,
      promptTitle: r.prompt_title as string,
      promptBody: r.prompt_body as string,
      constraints: (r.constraints as string[]) || [],
      verificationSteps: (r.verification_steps as string[]) || [],
      createdAt: r.created_at as string,
    }))
  },

  async logVerificationAttempt(attempt: Omit<VerificationAttempt, 'id' | 'createdAt'>): Promise<VerificationAttempt> {
    const { data, error } = await supabase
      .from('verification_attempts')
      .insert({
        finding_id: attempt.findingId,
        project_id: attempt.projectId,
        user_id: attempt.userId,
        previous_status: attempt.previousStatus,
        new_status: attempt.newStatus,
        score_before: attempt.scoreBefore,
        score_after: attempt.scoreAfter,
        note: attempt.note,
      })
      .select('*')
      .single()

    if (error) throw error

    return {
      id: data.id as string,
      findingId: data.finding_id as string,
      projectId: data.project_id as string,
      userId: data.user_id as string,
      previousStatus: data.previous_status as string,
      newStatus: data.new_status as 'verified' | 'still_failing' | 'manual_review_needed',
      scoreBefore: data.score_before as Record<string, number>,
      scoreAfter: data.score_after as Record<string, number>,
      note: data.note as string | null,
      createdAt: data.created_at as string,
    }
  },

  async getVerificationHistory(findingId: string): Promise<VerificationAttempt[]> {
    const { data, error } = await supabase
      .from('verification_attempts')
      .select('*')
      .eq('finding_id', findingId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map((a: Record<string, unknown>) => ({
      id: a.id as string,
      findingId: a.finding_id as string,
      projectId: a.project_id as string,
      userId: a.user_id as string,
      previousStatus: a.previous_status as string,
      newStatus: a.new_status as 'verified' | 'still_failing' | 'manual_review_needed',
      scoreBefore: a.score_before as Record<string, number>,
      scoreAfter: a.score_after as Record<string, number>,
      note: a.note as string | null,
      createdAt: a.created_at as string,
    }))
  },

  // ── Growth Plans (Phase 6) ────────────────────────────────────

  async saveGrowthPlan(plan: StoredGrowthPlan): Promise<void> {
    const { error } = await supabase.from('growth_plans').upsert(
      {
        id: plan.id,
        project_id: plan.projectId,
        user_id: plan.userId,
        seo_score: plan.seoScore,
        conversion_score: plan.conversionScore,
        positioning_score: plan.positioningScore,
        summary: plan.summary,
        status: plan.status,
        generated_at: plan.generatedAt,
      },
      { onConflict: 'project_id' },
    )
    if (error) throw error
  },

  async getGrowthPlan(projectId: string): Promise<StoredGrowthPlan | null> {
    const { data, error } = await supabase
      .from('growth_plans')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      projectId: data.project_id,
      userId: data.user_id,
      seoScore: data.seo_score,
      conversionScore: data.conversion_score,
      positioningScore: data.positioning_score,
      summary: data.summary,
      status: data.status,
      generatedAt: data.generated_at,
      createdAt: data.created_at,
    }
  },

  async saveRecommendations(recs: StoredGrowthRecommendation[]): Promise<void> {
    if (recs.length === 0) return
    // Clear existing for this plan, then insert
    await supabase.from('growth_recommendations').delete().eq('plan_id', recs[0].planId)
    const { error } = await supabase.from('growth_recommendations').insert(
      recs.map((r) => ({
        id: r.id,
        plan_id: r.planId,
        project_id: r.projectId,
        user_id: r.userId,
        category: r.category,
        priority: r.priority,
        title: r.title,
        description: r.description,
        action_items: r.actionItems,
        estimated_impact: r.estimatedImpact,
        completed: r.completed,
        completed_at: r.completedAt,
      })),
    )
    if (error) throw error
  },

  async getRecommendations(planId: string): Promise<StoredGrowthRecommendation[]> {
    const { data, error } = await supabase
      .from('growth_recommendations')
      .select('*')
      .eq('plan_id', planId)
      .order('priority', { ascending: true })

    if (error) throw error
    return (data || []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      planId: r.plan_id as string,
      projectId: r.project_id as string,
      userId: r.user_id as string,
      category: r.category as StoredGrowthRecommendation['category'],
      priority: r.priority as number,
      title: r.title as string,
      description: r.description as string,
      actionItems: (r.action_items as string[]) || [],
      estimatedImpact: r.estimated_impact as 'low' | 'medium' | 'high',
      completed: r.completed as boolean,
      completedAt: r.completed_at as string | null,
      createdAt: r.created_at as string,
    }))
  },

  async updateRecommendation(id: string, completed: boolean): Promise<void> {
    const { error } = await supabase
      .from('growth_recommendations')
      .update({ completed, completed_at: completed ? new Date().toISOString() : null })
      .eq('id', id)
    if (error) throw error
  },

  async saveCalendarItems(items: LaunchCalendarItem[]): Promise<void> {
    if (items.length === 0) return
    await supabase.from('launch_calendar_items').delete().eq('plan_id', items[0].planId)
    const { error } = await supabase.from('launch_calendar_items').insert(
      items.map((i) => ({
        id: i.id,
        plan_id: i.planId,
        project_id: i.projectId,
        user_id: i.userId,
        week_number: i.weekNumber,
        task_title: i.taskTitle,
        task_description: i.taskDescription,
        category: i.category,
        completed: i.completed,
        completed_at: i.completedAt,
        due_date: i.dueDate,
      })),
    )
    if (error) throw error
  },

  async getCalendarItems(planId: string): Promise<LaunchCalendarItem[]> {
    const { data, error } = await supabase
      .from('launch_calendar_items')
      .select('*')
      .eq('plan_id', planId)
      .order('week_number', { ascending: true })

    if (error) throw error
    return (data || []).map((i: Record<string, unknown>) => ({
      id: i.id as string,
      planId: i.plan_id as string,
      projectId: i.project_id as string,
      userId: i.user_id as string,
      weekNumber: i.week_number as number,
      taskTitle: i.task_title as string,
      taskDescription: i.task_description as string,
      category: i.category as LaunchCalendarItem['category'],
      completed: i.completed as boolean,
      completedAt: i.completed_at as string | null,
      dueDate: i.due_date as string | null,
      createdAt: i.created_at as string,
    }))
  },

  async updateCalendarItem(id: string, completed: boolean): Promise<void> {
    const { error } = await supabase
      .from('launch_calendar_items')
      .update({ completed, completed_at: completed ? new Date().toISOString() : null })
      .eq('id', id)
    if (error) throw error
  },

  // ── Professionalisation (Phase 8) ──────────────────────────────

  async getProgress(projectId: string): Promise<ProfessionalisationProgress | null> {
    const { data, error } = await supabase
      .from('professionalisation_progress')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      projectId: data.project_id,
      userId: data.user_id,
      currentLevel: data.current_level,
      level1Exported: data.level_1_exported,
      level2GithubStored: data.level_2_github_stored,
      level3EnvExampleCreated: data.level_3_env_example_created,
      level4BuildWorks: data.level_4_build_works,
      level5SecurityFixed: data.level_5_security_fixed,
      level6RulesVerified: data.level_6_rules_verified,
      level7WebhooksVerified: data.level_7_webhooks_verified,
      level8CiAdded: data.level_8_ci_added,
      level9MonitoringEnabled: data.level_9_monitoring_enabled,
      level10ChecklistDone: data.level_10_checklist_done,
      level11LaunchPackDone: data.level_11_launch_pack_done,
      level12ProductionReady: data.level_12_production_ready,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  },

  async saveProgress(progress: ProfessionalisationProgress): Promise<void> {
    const { error } = await supabase.from('professionalisation_progress').upsert(
      {
        id: progress.id,
        project_id: progress.projectId,
        user_id: progress.userId,
        current_level: progress.currentLevel,
        level_1_exported: progress.level1Exported,
        level_2_github_stored: progress.level2GithubStored,
        level_3_env_example_created: progress.level3EnvExampleCreated,
        level_4_build_works: progress.level4BuildWorks,
        level_5_security_fixed: progress.level5SecurityFixed,
        level_6_rules_verified: progress.level6RulesVerified,
        level_7_webhooks_verified: progress.level7WebhooksVerified,
        level_8_ci_added: progress.level8CiAdded,
        level_9_monitoring_enabled: progress.level9MonitoringEnabled,
        level_10_checklist_done: progress.level10ChecklistDone,
        level_11_launch_pack_done: progress.level11LaunchPackDone,
        level_12_production_ready: progress.level12ProductionReady,
        notes: progress.notes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_id' },
    )
    if (error) throw error
  },

  async updateProgressLevel(projectId: string, level: number): Promise<void> {
    const { error } = await supabase
      .from('professionalisation_progress')
      .update({ current_level: level, updated_at: new Date().toISOString() })
      .eq('project_id', projectId)
    if (error) throw error
  },

  async getMigrationGuide(builder: string): Promise<GithubMigrationGuide | null> {
    const { data, error } = await supabase
      .from('github_migration_guides')
      .select('*')
      .eq('builder', builder)
      .maybeSingle()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      builder: data.builder,
      title: data.title,
      description: data.description,
      steps: (data.steps as MigrationStep[]) || [],
      gitignoreRules: data.gitignore_rules || [],
      envExampleVars: data.env_example_vars || [],
    }
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

interface FindingRow {
  id: string
  audit_job_id: string
  project_id: string
  user_id: string
  category: string
  severity: string
  title: string
  explanation: string | null
  file_path: string | null
  line_number: number | null
  redacted_snippet: string | null
  fix_summary: string | null
  source_tool: string
  verification_status: string
  created_at: string
  updated_at: string
}

function mapFinding(row: FindingRow): StoredFinding {
  return {
    id: row.id,
    auditJobId: row.audit_job_id,
    projectId: row.project_id,
    userId: row.user_id,
    category: row.category,
    severity: row.severity as StoredFinding['severity'],
    title: row.title,
    explanation: row.explanation,
    filePath: row.file_path,
    lineNumber: row.line_number,
    redactedSnippet: row.redacted_snippet,
    fixSummary: row.fix_summary,
    sourceTool: row.source_tool,
    verificationStatus: row.verification_status as VerificationStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
