export type { StorageAdapter, StoredProject, StoredReport } from './types'
export { localStorageAdapter } from './localStorageAdapter'
export { b2Adapter } from './b2Adapter'

import { localStorageAdapter } from './localStorageAdapter'
import { b2Adapter } from './b2Adapter'
import type { StorageAdapter } from './types'

/**
 * Returns the active storage adapter based on environment config.
 *
 * Priority:
 *   1. B2 if VITE_B2_APPLICATION_KEY_ID is set
 *   2. localStorage (always available, default)
 */
export function getStorageAdapter(): StorageAdapter {
  if (import.meta.env.VITE_B2_APPLICATION_KEY_ID) {
    return b2Adapter
  }
  return localStorageAdapter
}
