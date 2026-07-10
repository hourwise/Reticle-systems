import { useState, useCallback, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { getStorageAdapter, type StoredProject } from '@/lib/storage'

interface UseProjectsReturn {
  projects: StoredProject[]
  loading: boolean
  error: string | null
  saveProject: (project: Omit<StoredProject, 'userId' | 'id' | 'createdAt' | 'updatedAt'> & { id?: string; userId?: string }) => Promise<StoredProject>
  deleteProject: (projectId: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useProjects(): UseProjectsReturn {
  const { user } = useAuthStore()
  const adapter = getStorageAdapter()

  const [projects, setProjects] = useState<StoredProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setProjects([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const list = await adapter.listProjects(user.id)
      setProjects(list)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load projects'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [user, adapter])

  // Load on mount and when user changes
  useEffect(() => {
    refresh()
  }, [refresh])

  const saveProject = useCallback(
    async (
      input: Omit<StoredProject, 'userId' | 'id' | 'createdAt' | 'updatedAt'> & { id?: string; userId?: string },
    ): Promise<StoredProject> => {
      if (!user) throw new Error('Must be signed in to save a project')

      const now = new Date().toISOString()

      const project: StoredProject = {
        id: input.id || crypto.randomUUID(),
        userId: user.id,
        name: input.name,
        websiteUrl: input.websiteUrl,
        builderUsed: input.builderUsed,
        backendUsed: input.backendUsed,
        status: input.status,
        auditType: input.auditType,
        hasAuth: input.hasAuth,
        storesUserData: input.storesUserData,
        acceptsPayments: input.acceptsPayments,
        targetAudience: input.targetAudience,
        createdAt: now,
        updatedAt: now,
      }

      setError(null)

      try {
        await adapter.saveProject(project)

        // Update local state optimistically
        setProjects((prev) => {
          const idx = prev.findIndex((p) => p.id === project.id)
          if (idx >= 0) {
            const updated = [...prev]
            updated[idx] = project
            return updated
          }
          return [project, ...prev]
        })

        return project
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save project'
        setError(message)
        throw err
      }
    },
    [user, adapter],
  )

  const deleteProject = useCallback(
    async (projectId: string) => {
      setError(null)

      try {
        await adapter.deleteProject(projectId)
        setProjects((prev) => prev.filter((p) => p.id !== projectId))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete project'
        setError(message)
        throw err
      }
    },
    [adapter],
  )

  return { projects, loading, error, saveProject, deleteProject, refresh }
}
