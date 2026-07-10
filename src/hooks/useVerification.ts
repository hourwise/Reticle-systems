import { useState, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { getStorageAdapter } from '@/lib/storage'
import type { StoredFinding, StoredRepairPrompt, VerificationAttempt, VerificationStatus } from '@/lib/storage'

// ─── Types ───────────────────────────────────────────────────────

interface FindingInput {
  title: string
  category: string
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
  detail: string
  fix: string
}

interface UseVerificationReturn {
  /** Persist client-side findings to the database */
  persistFindings: (projectId: string, auditJobId: string, findings: FindingInput[]) => Promise<StoredFinding[]>
  /** Load persisted findings */
  loadFindings: (projectId: string) => Promise<StoredFinding[]>
  /** Mark a finding as "I've fixed it" */
  claimFixed: (finding: StoredFinding) => Promise<void>
  /** Re-scan: compare new findings against persisted ones */
  rescan: (projectId: string, currentFindings: FindingInput[]) => Promise<RescanResult>
  /** Generate and save a repair prompt for a finding */
  generateRepairPrompt: (finding: StoredFinding, builder: string) => Promise<StoredRepairPrompt>
  /** Get repair prompts for a finding */
  getPrompts: (findingId: string) => Promise<StoredRepairPrompt[]>
  /** Get verification history for a finding */
  getHistory: (findingId: string) => Promise<VerificationAttempt[]>
  loading: boolean
  error: string | null
}

export interface RescanResult {
  newlyFixed: StoredFinding[]      // findings that disappeared → were fixed
  stillFailing: StoredFinding[]    // findings that still appear
  newFindings: FindingInput[]       // brand new issues detected
  scoreChange: {
    before: { security: number; launch: number; seo: number; growth: number }
    after: { security: number; launch: number; seo: number; growth: number }
  }
}

// ─── Repair prompt templates ─────────────────────────────────────

function buildRepairPrompt(finding: StoredFinding, builder: string): StoredRepairPrompt {
  const constraints = [
    'Do not place secret keys in frontend code.',
    'Move privileged API calls to a server-side function.',
    'Use environment variables for secrets.',
    'Do not disable authentication or weaken security rules.',
    'Do not change unrelated UI or functionality.',
    'Add a short explanation of what changed.',
  ]

  const verificationSteps = [
    `Verify ${finding.title} no longer appears in a rescan.`,
    'Run the project build and confirm no new errors.',
    'Manually test the affected functionality.',
  ]

  const builderContext =
    builder === 'Lovable'
      ? 'You are working in Lovable. Use the built-in editor and Supabase integration.'
      : builder === 'Bolt'
        ? 'You are working in Bolt. Modify the relevant files directly.'
        : builder === 'Cursor'
          ? 'You are working in Cursor with the project open. Use the Composer to make changes.'
          : builder === 'Codex'
            ? 'You are working with Codex CLI. Apply changes to the local repository.'
            : 'You are working on your project. Apply these changes using your preferred tool.'

  return {
    id: crypto.randomUUID(),
    findingId: finding.id,
    projectId: finding.projectId,
    userId: finding.userId,
    builder,
    promptTitle: `Fix: ${finding.title}`,
    promptBody: `## Repair Prompt: ${finding.title}

${builderContext}

### Goal
Fix the following issue identified by O.D.I.N.:

**${finding.title}**

${finding.explanation || finding.fixSummary || ''}

### Required Changes
${finding.fixSummary || 'Apply the fix described above.'}

### Constraints
${constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}

### Verification
Run and confirm:

\`\`\`bash
npm run build
\`\`\`

Then manually verify:
${verificationSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    constraints,
    verificationSteps,
    createdAt: new Date().toISOString(),
  }
}

// ─── Score calculator ────────────────────────────────────────────

function calcScores(findings: FindingInput[]): { security: number; launch: number; seo: number; growth: number } {
  const start = { security: 100, launch: 100, seo: 100, growth: 100 }
  const penalties: Record<string, number> = { critical: 25, high: 15, medium: 8, low: 3, info: 0 }

  for (const f of findings) {
    const penalty = penalties[f.severity] || 0
    if (f.category === 'security') start.security -= penalty
    if (f.category === 'launch') start.launch -= penalty
    if (f.category === 'seo') start.seo -= penalty
    if (f.category === 'growth') start.growth -= penalty
  }

  return {
    security: Math.max(0, Math.min(100, start.security)),
    launch: Math.max(0, Math.min(100, start.launch)),
    seo: Math.max(0, Math.min(100, start.seo)),
    growth: Math.max(0, Math.min(100, start.growth)),
  }
}

// ─── Hook ────────────────────────────────────────────────────────

export function useVerification(): UseVerificationReturn {
  const { user } = useAuthStore()
  const adapter = getStorageAdapter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const persistFindings = useCallback(
    async (projectId: string, auditJobId: string, findings: FindingInput[]): Promise<StoredFinding[]> {
      if (!user) throw new Error('Must be signed in')
      setLoading(true)
      setError(null)

      try {
        const stored: StoredFinding[] = findings.map((f) => ({
          id: crypto.randomUUID(),
          auditJobId,
          projectId,
          userId: user.id,
          category: f.category,
          severity: f.severity,
          title: f.title,
          explanation: f.detail,
          filePath: null,
          lineNumber: null,
          redactedSnippet: null,
          fixSummary: f.fix,
          sourceTool: 'pre_audit_intake',
          verificationStatus: 'not_started',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))

        await adapter.saveFindings(stored)
        return stored
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to persist findings'
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [user, adapter],
  )

  const loadFindings = useCallback(
    async (projectId: string): Promise<StoredFinding[]> => {
      setLoading(true)
      setError(null)
      try {
        return await adapter.getFindings(projectId)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load findings')
        return []
      } finally {
        setLoading(false)
      }
    },
    [adapter],
  )

  const claimFixed = useCallback(
    async (finding: StoredFinding): Promise<void> => {
      setError(null)
      try {
        await adapter.updateFindingStatus(finding.id, 'user_claimed_fixed')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update status')
      }
    },
    [adapter],
  )

  const rescan = useCallback(
    async (projectId: string, currentFindings: FindingInput[]): Promise<RescanResult> => {
      if (!user) throw new Error('Must be signed in')
      setLoading(true)
      setError(null)

      try {
        const persisted = await adapter.getFindings(projectId)
        const persistedTitles = new Set(persisted.map((f) => f.title))
        const currentTitles = new Set(currentFindings.map((f) => f.title))

        const newlyFixed = persisted.filter(
          (f) => !currentTitles.has(f.title) && f.verificationStatus === 'user_claimed_fixed',
        )
        const stillFailing = persisted.filter(
          (f) => currentTitles.has(f.title) && f.verificationStatus === 'user_claimed_fixed',
        )
        const newFindings = currentFindings.filter((f) => !persistedTitles.has(f.title))

        // Update statuses
        for (const f of newlyFixed) {
          await adapter.updateFindingStatus(f.id, 'verified')
          await adapter.logVerificationAttempt({
            findingId: f.id,
            projectId,
            userId: user.id,
            previousStatus: 'user_claimed_fixed',
            newStatus: 'verified',
            scoreBefore: {},
            scoreAfter: {},
            note: 'Rescan confirmed fix',
          })
        }

        for (const f of stillFailing) {
          await adapter.updateFindingStatus(f.id, 'still_failing')
          await adapter.logVerificationAttempt({
            findingId: f.id,
            projectId,
            userId: user.id,
            previousStatus: 'user_claimed_fixed',
            newStatus: 'still_failing',
            scoreBefore: {},
            scoreAfter: {},
            note: 'Rescan still detects issue',
          })
        }

        const beforeScores = calcScores(
          persisted.map((f) => ({ title: f.title, category: f.category, severity: f.severity, detail: '', fix: '' })),
        )
        const afterScores = calcScores(currentFindings)

        return {
          newlyFixed,
          stillFailing,
          newFindings,
          scoreChange: { before: beforeScores, after: afterScores },
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Rescan failed'
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [user, adapter],
  )

  const generateRepairPrompt = useCallback(
    async (finding: StoredFinding, builder: string): Promise<StoredRepairPrompt> => {
      const prompt = buildRepairPrompt(finding, builder)
      await adapter.saveRepairPrompt(prompt)
      return prompt
    },
    [adapter],
  )

  const getPrompts = useCallback(
    async (findingId: string): Promise<StoredRepairPrompt[]> => {
      return adapter.getRepairPrompts(findingId)
    },
    [adapter],
  )

  const getHistory = useCallback(
    async (findingId: string): Promise<VerificationAttempt[]> => {
      return adapter.getVerificationHistory(findingId)
    },
    [adapter],
  )

  return {
    persistFindings,
    loadFindings,
    claimFixed,
    rescan,
    generateRepairPrompt,
    getPrompts,
    getHistory,
    loading,
    error,
  }
}
