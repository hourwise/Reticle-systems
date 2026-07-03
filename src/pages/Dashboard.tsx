import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useProjects } from '@/hooks/useProjects'
import type { StoredProject } from '@/lib/storage'

// ─── Helpers ─────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ProjectCard({
  project,
  onDelete,
}: {
  project: StoredProject
  onDelete: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="report-card space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg hal-text tracking-wider text-foreground">
            {project.name}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            STATUS: {project.status?.toUpperCase() || 'UNKNOWN'} &middot;{' '}
            {formatDate(project.updatedAt)}
          </p>
        </div>
        <span className="text-xs text-muted-foreground border border-border px-2 py-1">
          {project.auditType?.toUpperCase() || 'FULL'} SCAN
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-muted-foreground">BUILDER:</span>
          <p className="text-foreground">{project.builderUsed || '\u2014'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">AUTH:</span>
          <p className="text-foreground">{project.hasAuth || '\u2014'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">PAYMENTS:</span>
          <p className="text-foreground">{project.acceptsPayments || '\u2014'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">BACKEND:</span>
          <p className="text-foreground">{project.backendUsed || '\u2014'}</p>
        </div>
      </div>

      {project.websiteUrl && (
        <p className="text-xs text-muted-foreground">
          URL: <span className="text-foreground">{project.websiteUrl}</span>
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-2 items-center">
        <Link
          to={`/report/${encodeURIComponent(project.id)}`}
          className="hal-button text-sm"
        >
          [ VIEW REPORT ]
        </Link>
        <Link to="/intake" className="hal-button text-sm">
          [ NEW SCAN ]
        </Link>

        {/* Delete */}
        {confirming ? (
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            CONFIRM:
            <button
              onClick={() => onDelete(project.id)}
              className="text-red-400 hover:text-red-300 transition-colors tracking-wider"
            >
              [ DELETE ]
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-muted-foreground hover:text-foreground transition-colors tracking-wider"
            >
              [ CANCEL ]
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs text-muted-foreground/50 hover:text-red-400 transition-colors tracking-wider ml-auto"
          >
            [ DELETE ]
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Dashboard Page ──────────────────────────────────────────────

export default function Dashboard() {
  const { user, logOut } = useAuthStore()
  const { projects, loading, error, deleteProject, refresh } = useProjects()

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with sign-out */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold hal-text tracking-widest">
            YOUR PROJECTS
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={logOut}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider"
            >
              [ SIGN OUT ]
            </button>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <p className="hal-text tracking-widest text-muted-foreground animate-pulse">
            LOADING PROJECTS...
          </p>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="report-card border-destructive/50">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={refresh}
              className="hal-button text-sm mt-3"
            >
              [ RETRY ]
            </button>
          </div>
        )}

        {/* ── Project cards ── */}
        {!loading && !error && projects.length > 0 && (
          <div className="space-y-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onDelete={deleteProject} />
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && projects.length === 0 && (
          <>
            <p className="text-muted-foreground">NO PROJECTS YET.</p>

            <div className="report-card">
              <p className="text-sm text-muted-foreground">
                Start a guided project check to see your results here.
              </p>
              <Link to="/intake" className="hal-button text-sm mt-4 inline-block">
                [ START INTAKE ]
              </Link>
            </div>
          </>
        )}

        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">NEXT STEPS:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              ▪{' '}
              {projects.length > 0
                ? 'Run another scan for a different project'
                : 'Start a guided check from the intake page'}
            </li>
            <li>▪ Upload your project repository for deeper analysis</li>
            <li>▪ All reports are stored securely</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

