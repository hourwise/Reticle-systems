import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitBranch, CheckCircle, ChevronRight, ExternalLink, Download } from 'lucide-react'
import type { ProfessionalisationProgress, GithubMigrationGuide } from '@/lib/storage'

interface Props {
  progress: ProfessionalisationProgress | null
  guide: GithubMigrationGuide | null
  loading: boolean
  onInit: () => Promise<void>
  onMarkExported: () => Promise<void>
  onMarkGithubStored: () => Promise<void>
  onMarkEnvExampleDone: () => Promise<void>
  onMarkBuildWorks: () => Promise<void>
  onMarkSecurityFixed: () => Promise<void>
}

const LEVEL_LABELS: Record<number, { title: string; description: string; action: string }> = {
  1: { title: 'Project download', description: 'Download your project from the builder platform', action: 'Export your project as a ZIP from your builder' },
  2: { title: 'GitHub repository', description: 'Store your project in a GitHub repository', action: 'Create a Private GitHub repo and push your project' },
  3: { title: 'Environment safety', description: 'Create .env.example and remove secrets', action: 'Create .env.example with placeholders, add .env to .gitignore' },
  4: { title: 'Local build', description: 'Confirm the project builds successfully', action: 'Run npm install && npm run build — fix any errors' },
  5: { title: 'Security hardened', description: 'Critical security blockers resolved', action: 'Resolve all critical findings in your ODIN report' },
  6: { title: 'Rules verified', description: 'Firebase/Supabase security rules confirmed', action: 'Verify RLS policies and security rules are deployed' },
  7: { title: 'Webhooks live', description: 'Payment webhooks verified (if applicable)', action: 'Set up and test Stripe webhook endpoint' },
  8: { title: 'CI pipeline', description: 'Continuous integration configured', action: 'Add GitHub Actions workflow for build + test' },
  9: { title: 'Monitoring', description: 'Uptime and error monitoring enabled', action: 'Set up Sentry, UptimeRobot, or similar' },
  10: { title: 'Production checklist', description: 'Pre-launch checklist completed', action: 'Review all items: HTTPS, backups, rate limiting, error pages' },
  11: { title: 'Launch pack', description: 'Release notes and documentation ready', action: 'Write release notes, update README, prepare launch assets' },
  12: { title: 'Production ready', description: 'Your project is ready for production', action: 'Congratulations! Monitor, iterate, and keep building.' },
}

export default function ProfessionalisationPanel({
  progress, guide, loading, onInit, onMarkExported, onMarkGithubStored,
  onMarkEnvExampleDone, onMarkBuildWorks, onMarkSecurityFixed,
}: Props) {
  const [showGuide, setShowGuide] = useState(false)

  if (loading) {
    return (
      <div className="report-card">
        <p className="text-xs text-muted-foreground animate-pulse">LOADING PROGRESS...</p>
      </div>
    )
  }

  // No progress yet — prompt to initialise
  if (!progress) {
    return (
      <div className="report-card">
        <div className="flex items-center gap-3 mb-3">
          <GitBranch className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm hal-text tracking-wider">PROFESSIONALISATION</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Track your journey from AI-built prototype to production-ready application.
          ODIN will guide you through each milestone.
        </p>
        <button onClick={onInit} className="hal-button text-xs">
          [ BEGIN PROFESSIONALISATION ]
        </button>
      </div>
    )
  }

  const currentLevel = progress.currentLevel
  const levelInfo = LEVEL_LABELS[currentLevel] || LEVEL_LABELS[1]
  const completedCount = Object.entries(progress)
    .filter(([k, v]) => k.startsWith('level') && v === true)
    .length

  return (
    <div className="report-card space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <GitBranch className="w-4 h-4 text-green-400" />
        <h2 className="text-sm hal-text tracking-wider">PROFESSIONALISATION — LEVEL {currentLevel}/12</h2>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentLevel / 12) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{completedCount} of 12 milestones reached</span>
          <span>{Math.round((currentLevel / 12) * 100)}%</span>
        </div>
      </div>

      {/* Level badges */}
      <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((level) => {
          const fieldKey = `level${level}${level === 1 ? 'Exported' : level === 2 ? 'GithubStored' : level === 3 ? 'EnvExampleCreated' : level === 4 ? 'BuildWorks' : level === 5 ? 'SecurityFixed' : level === 6 ? 'RulesVerified' : level === 7 ? 'WebhooksVerified' : level === 8 ? 'CiAdded' : level === 9 ? 'MonitoringEnabled' : level === 10 ? 'ChecklistDone' : level === 11 ? 'LaunchPackDone' : 'ProductionReady'}` as keyof ProfessionalisationProgress
          const done = progress[fieldKey] === true
          const isCurrent = level === currentLevel
          return (
            <div
              key={level}
              className={`text-center py-1.5 rounded text-[10px] border transition-colors ${
                done
                  ? 'border-green-500/50 bg-green-500/10 text-green-400'
                  : isCurrent
                    ? 'border-foreground/30 bg-foreground/5 text-foreground'
                    : 'border-border text-muted-foreground/40'
              }`}
              title={LEVEL_LABELS[level]?.title}
            >
              {done ? <CheckCircle className="w-2.5 h-2.5 mx-auto" /> : level}
            </div>
          )
        })}
      </div>

      {/* Current milestone */}
      <div className="border border-border p-3 space-y-2">
        <p className="text-xs text-muted-foreground tracking-wider">NEXT MILESTONE</p>
        <p className="text-sm font-semibold text-foreground">
          Level {currentLevel}: {levelInfo.title}
        </p>
        <p className="text-xs text-muted-foreground">{levelInfo.description}</p>
        <p className="text-xs text-green-400 font-mono">→ {levelInfo.action}</p>
      </div>

      {/* Quick actions for early levels */}
      <div className="flex flex-wrap gap-2">
        {currentLevel === 1 && (
          <button onClick={onMarkExported} className="hal-button text-xs">
            [ ✓ PROJECT EXPORTED ]
          </button>
        )}
        {currentLevel === 2 && (
          <button onClick={onMarkGithubStored} className="hal-button text-xs">
            [ ✓ PUSHED TO GITHUB ]
          </button>
        )}
        {currentLevel === 3 && (
          <button onClick={onMarkEnvExampleDone} className="hal-button text-xs">
            [ ✓ .ENV.EXAMPLE CREATED ]
          </button>
        )}
        {currentLevel === 4 && (
          <button onClick={onMarkBuildWorks} className="hal-button text-xs">
            [ ✓ BUILD SUCCEEDS ]
          </button>
        )}
        {currentLevel === 5 && (
          <button onClick={onMarkSecurityFixed} className="hal-button text-xs">
            [ ✓ SECURITY BLOCKERS RESOLVED ]
          </button>
        )}
      </div>

      {/* GitHub migration guide toggle */}
      {guide && (currentLevel <= 3) && (
        <div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            {showGuide ? '[ HIDE MIGRATION GUIDE ]' : `[ SHOW ${guide.builder.toUpperCase()} → GITHUB GUIDE ]`}
          </button>

          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 border border-border p-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{guide.title}</h3>
                    <p className="text-xs text-muted-foreground">{guide.description}</p>
                  </div>

                  {/* Steps */}
                  <ol className="space-y-2">
                    {guide.steps.map((step) => (
                      <li key={step.order} className="text-xs border-l-2 border-border pl-3 py-1">
                        <p className="font-semibold text-foreground">
                          {step.order}. {step.title}
                        </p>
                        <p className="text-muted-foreground mt-0.5">{step.detail}</p>
                        <p className="text-green-400/70 text-[10px] mt-0.5">💡 {step.tip}</p>
                      </li>
                    ))}
                  </ol>

                  {/* .gitignore rules */}
                  {guide.gitignoreRules.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">RECOMMENDED .GITIGNORE:</p>
                      <pre className="text-[10px] text-muted-foreground bg-muted/20 p-2 overflow-x-auto">
                        {guide.gitignoreRules.join('\n')}
                      </pre>
                    </div>
                  )}

                  {/* .env.example vars */}
                  {guide.envExampleVars.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">RECOMMENDED .ENV.EXAMPLE:</p>
                      <pre className="text-[10px] text-muted-foreground bg-muted/20 p-2 overflow-x-auto">
                        {guide.envExampleVars.join('\n')}
                      </pre>
                    </div>
                  )}

                  {/* External links */}
                  <div className="flex gap-3 text-xs pt-2">
                    <a
                      href="https://desktop.github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> GitHub Desktop
                    </a>
                    <a
                      href="https://gitignore.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> gitignore.io
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
