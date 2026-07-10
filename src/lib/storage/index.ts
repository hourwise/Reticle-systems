export type {
  StorageAdapter,
  StoredProject,
  StoredReport,
  StoredFinding,
  StoredRepairPrompt,
  VerificationAttempt,
  VerificationStatus,
  ScoreSummary,
  StoredGrowthPlan,
  StoredGrowthRecommendation,
  LaunchCalendarItem,
  GrowthCategory,
  ProfessionalisationProgress,
  GithubMigrationGuide,
  MigrationStep,
} from './types'
export { localStorageAdapter } from './localStorageAdapter'
export { supabaseAdapter } from './supabaseAdapter'

import { localStorageAdapter } from './localStorageAdapter'
import { supabaseAdapter } from './supabaseAdapter'
import type { StorageAdapter } from './types'

/**
 * Returns the active storage adapter.
 *
 * Priority:
 *   1. Supabase (if VITE_SUPABASE_URL is set)
 *   2. localStorage (fallback, always available)
 */
export function getStorageAdapter(): StorageAdapter {
  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return supabaseAdapter
  }
  return localStorageAdapter
}
