import { useState, useCallback, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { getStorageAdapter } from '@/lib/storage'
import type { ProfessionalisationProgress, GithubMigrationGuide, MigrationStep } from '@/lib/storage'

// ─── Embedded fallback guides (used when Supabase is unavailable) ─

const EMBEDDED_GUIDES: Record<string, GithubMigrationGuide> = {
  Lovable: {
    id: 'embedded-lovable',
    builder: 'Lovable',
    title: 'Export from Lovable to GitHub',
    description: 'Lovable projects can be exported as a ZIP containing your full codebase.',
    steps: [
      { order: 1, title: 'Download your project from Lovable', detail: 'In Lovable, click the three-dot menu → "Export" → "Download as ZIP". Save the ZIP file to your Desktop.', tip: 'Make sure you have exported the latest version.' },
      { order: 2, title: 'Extract the ZIP file', detail: 'Right-click the ZIP → "Extract All" → choose a folder like C:\\Users\\YourName\\Projects\\your-project-name.', tip: 'Avoid folders synced with OneDrive or iCloud.' },
      { order: 3, title: 'Install GitHub Desktop', detail: 'Download GitHub Desktop from desktop.github.com. Install and sign in.', tip: 'GitHub Desktop is free and works on Windows and Mac.' },
      { order: 4, title: 'Create a GitHub repository', detail: 'In GitHub Desktop: File → "Add local repository" → choose your folder. Then "Publish repository" → Private.', tip: 'Always start with a Private repository.' },
      { order: 5, title: 'Create a .gitignore file', detail: 'Create ".gitignore" with: node_modules/, .env, .env.local, dist/, build/, *.log.', tip: 'This prevents secrets and generated files from being committed.' },
      { order: 6, title: 'Create a .env.example file', detail: 'Copy .env.local to .env.example, replace all values with placeholders like "your-key-here".', tip: 'Commit .env.example, never .env or .env.local.' },
      { order: 7, title: 'Make your first commit', detail: 'In GitHub Desktop, write "Initial project export from Lovable" and click "Commit to main" → "Push origin".', tip: 'Good commit messages help you understand changes later.' },
      { order: 8, title: 'Verify nothing sensitive was committed', detail: 'Check GitHub online. If secrets are visible, rotate those keys immediately.', tip: 'Open your repo in an incognito window to see it as a stranger would.' },
    ],
    gitignoreRules: ['node_modules/', 'dist/', 'build/', '.env', '.env.local', '.env.*.local', '*.log', '.DS_Store', 'Thumbs.db', '.vscode/', '.idea/'],
    envExampleVars: ['VITE_SUPABASE_URL=your-supabase-url', 'VITE_SUPABASE_ANON_KEY=your-supabase-anon-key'],
  },
  Bolt: {
    id: 'embedded-bolt', builder: 'Bolt', title: 'Export from Bolt.new to GitHub',
    description: 'Bolt.new projects can be downloaded as a ZIP or connected directly to GitHub.',
    steps: [
      { order: 1, title: 'Download your project from Bolt', detail: 'In Bolt, click the download icon → "Download as ZIP". Save to Desktop.', tip: 'If Bolt offers direct GitHub integration, use it.' },
      { order: 2, title: 'Extract and set up locally', detail: 'Extract ZIP, run "npm install" and "npm run dev" to verify.', tip: 'Bolt projects use Vite + React + TypeScript.' },
      { order: 3, title: 'Install GitHub Desktop and create repo', detail: 'Add your project folder, publish as Private.', tip: 'No command line needed.' },
      { order: 4, title: 'Set up .gitignore and .env.example', detail: 'Exclude node_modules/, .env, build outputs. List all env vars with placeholders.', tip: 'Bolt projects often have Supabase keys — make sure .env is gitignored.' },
      { order: 5, title: 'Commit and push', detail: 'Stage files, write message, push. Verify online.', tip: 'Review every file before pushing.' },
    ],
    gitignoreRules: ['node_modules/', 'dist/', '.env', '.env.local', '*.log', '.DS_Store', '.vscode/'],
    envExampleVars: ['VITE_SUPABASE_URL=your-supabase-url', 'VITE_SUPABASE_ANON_KEY=your-supabase-anon-key'],
  },
  Replit: {
    id: 'embedded-replit', builder: 'Replit', title: 'Export from Replit to GitHub',
    description: 'Replit has built-in Git support for direct GitHub connection.',
    steps: [
      { order: 1, title: 'Connect Replit to GitHub', detail: 'In Replit, open Version Control tab → "Connect to GitHub".', tip: 'No download needed — Replit pushes directly.' },
      { order: 2, title: 'Create a GitHub repository', detail: 'In Version Control, click "Create a repository". Set to Private.', tip: 'Add .gitignore first if your Repl has secrets.' },
      { order: 3, title: 'Verify the repository', detail: 'Open GitHub, check all files, ensure no API keys are visible.', tip: 'Replit Repls sometimes include test keys.' },
      { order: 4, title: 'Clone locally for further work', detail: 'Install GitHub Desktop, clone your repo, run "npm install" and "npm run dev".', tip: 'Local development gives more control.' },
    ],
    gitignoreRules: ['node_modules/', '.env', '.replit', 'replit.nix', '*.log'],
    envExampleVars: ['VITE_API_URL=your-api-url', 'DATABASE_URL=your-database-url'],
  },
  Cursor: {
    id: 'embedded-cursor', builder: 'Cursor', title: 'Push a Cursor project to GitHub',
    description: 'Cursor projects are local-first with built-in Git support.',
    steps: [
      { order: 1, title: 'Open your project in Cursor', detail: 'Your project is already on disk. Cursor has built-in Git (Ctrl+Shift+G).', tip: 'Use the Source Control panel.' },
      { order: 2, title: 'Initialise Git', detail: 'Terminal: "git init" or Source Control → "Initialise Repository".', tip: 'If .git folder exists, Git is already initialised.' },
      { order: 3, title: 'Create .gitignore', detail: 'Add: node_modules/, .env, .env.local, dist/, build/, *.log.', tip: 'Ask Cursor AI: "generate a .gitignore for Vite React TypeScript".' },
      { order: 4, title: 'Create .env.example', detail: 'Copy .env.local → .env.example, replace values with placeholders.', tip: 'Ask Cursor AI to generate it from your .env.local.' },
      { order: 5, title: 'Push to GitHub', detail: 'Create Private repo on github.com. Terminal: "git remote add origin <url>" → "git push -u origin main".', tip: 'Or use GitHub Desktop for visual interface.' },
      { order: 6, title: 'Verify', detail: 'Check GitHub online. Rotate any exposed keys immediately.', tip: 'Review commit contents before pushing.' },
    ],
    gitignoreRules: ['node_modules/', 'dist/', 'build/', '.env', '.env.local', '.env.*.local', '*.log', '.DS_Store', 'Thumbs.db', '.cursor/'],
    envExampleVars: ['VITE_SUPABASE_URL=your-supabase-url', 'VITE_SUPABASE_ANON_KEY=your-supabase-anon-key'],
  },
  Codex: {
    id: 'embedded-codex', builder: 'Codex', title: 'Push a Codex project to GitHub',
    description: 'Codex CLI projects are local and use Git natively.',
    steps: [
      { order: 1, title: 'Verify project runs locally', detail: 'Run "npm install" and "npm run dev" to confirm.', tip: 'Fix issues locally first.' },
      { order: 2, title: 'Init Git and .gitignore', detail: 'Run "git init". Create .gitignore with node_modules/, .env, dist/, build/.', tip: 'Run "git status" to check what will be committed.' },
      { order: 3, title: 'Create .env.example', detail: 'Copy .env.local → .env.example, replace values with placeholders.', tip: 'Include comments explaining each variable.' },
      { order: 4, title: 'Commit and push', detail: '"git add .", "git commit -m \'Initial setup\'", create Private repo, push.', tip: 'Review "git diff --cached" before committing.' },
      { order: 5, title: 'Branch protection', detail: 'On GitHub: Settings → Branches → require pull requests before merging to main.', tip: 'Good habit from day one.' },
    ],
    gitignoreRules: ['node_modules/', 'dist/', 'build/', '.env', '.env.local', '.env.*.local', '*.log', '.DS_Store', 'coverage/'],
    envExampleVars: ['VITE_SUPABASE_URL=your-supabase-url', 'VITE_SUPABASE_ANON_KEY=your-supabase-anon-key', 'VITE_ENABLE_PAYMENTS=false', 'VITE_ENABLE_AI_FEATURES=false'],
  },
  Claude: {
    id: 'embedded-claude', builder: 'Claude', title: 'Push a Claude project to GitHub',
    description: 'Claude Code and Claude.ai can generate complete projects.',
    steps: [
      { order: 1, title: 'Save files locally', detail: 'Copy generated code into local files matching the same structure.', tip: 'Keep the same file names and hierarchy.' },
      { order: 2, title: 'Run locally first', detail: '"npm install" and "npm run dev". Fix issues before pushing.', tip: 'Claude code sometimes needs minor adjustments.' },
      { order: 3, title: 'Git, .gitignore, .env.example', detail: '"git init", create .gitignore, create .env.example with placeholders.', tip: 'Ask Claude to generate a .gitignore for your stack.' },
      { order: 4, title: 'Push and verify', detail: 'Create Private repo, push, verify no secrets online.', tip: 'Search for "key", "secret", "token", "password" before pushing.' },
    ],
    gitignoreRules: ['node_modules/', 'dist/', 'build/', '.env', '.env.local', '*.log', '.DS_Store', '.vscode/'],
    envExampleVars: ['VITE_SUPABASE_URL=your-supabase-url', 'VITE_SUPABASE_ANON_KEY=your-supabase-anon-key'],
  },
  Other: {
    id: 'embedded-other', builder: 'Other', title: 'Export your project to GitHub',
    description: 'Generic guide for moving any project to GitHub safely.',
    steps: [
      { order: 1, title: 'Locate your project files', detail: 'Find where files are stored. Look for Export/Download option.', tip: 'If no export exists, recreate locally with same stack.' },
      { order: 2, title: 'Extract and organise', detail: 'Extract ZIP, delete temp/cache/build files.', tip: 'A clean folder makes Git setup easier.' },
      { order: 3, title: 'Set up Git and GitHub', detail: 'Install GitHub Desktop, add folder, create Private repo, publish.', tip: 'No command line needed with GitHub Desktop.' },
      { order: 4, title: 'Create .gitignore and .env.example', detail: 'Use gitignore.io for your stack. List all env vars with placeholders.', tip: 'Start with: node_modules/, .env, .env.local, dist/, build/, *.log.' },
      { order: 5, title: 'Commit, push, verify', detail: 'Stage, commit, push. Verify online with incognito window.', tip: 'Incognito mode reveals what strangers can see.' },
    ],
    gitignoreRules: ['node_modules/', 'dist/', 'build/', '.env', '.env.local', '*.log', '.DS_Store', 'Thumbs.db'],
    envExampleVars: ['# List all env vars your project needs'],
  },
}

// ─── Hook ────────────────────────────────────────────────────────

export interface UseProfessionalisationReturn {
  progress: ProfessionalisationProgress | null
  guide: GithubMigrationGuide | null
  loading: boolean
  error: string | null
  initProgress: (projectId: string) => Promise<void>
  markExported: () => Promise<void>
  markGithubStored: () => Promise<void>
  markEnvExampleDone: () => Promise<void>
  markBuildWorks: () => Promise<void>
  markSecurityFixed: () => Promise<void>
  refresh: () => Promise<void>
}

export function useProfessionalisation(projectId: string | undefined): UseProfessionalisationReturn {
  const { user } = useAuthStore()
  const adapter = getStorageAdapter()

  const [progress, setProgress] = useState<ProfessionalisationProgress | null>(null)
  const [guide, setGuide] = useState<GithubMigrationGuide | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [builderUsed, setBuilderUsed] = useState<string>('Other')

  const refresh = useCallback(async () => {
    if (!projectId || !user) return
    setLoading(true)
    setError(null)
    try {
      // Load progress
      const p = await adapter.getProgress(projectId)
      setProgress(p)

      // Determine builder for guide
      const builder = await resolveBuilder(projectId)
      setBuilderUsed(builder)

      // Load guide — try DB first, fall back to embedded
      const dbGuide = await adapter.getMigrationGuide(builder)
      setGuide(dbGuide || EMBEDDED_GUIDES[builder] || EMBEDDED_GUIDES.Other)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress')
    } finally {
      setLoading(false)
    }
  }, [projectId, user, adapter])

  useEffect(() => {
    refresh()
  }, [refresh])

  const resolveBuilder = async (pid: string): Promise<string> => {
    try {
      const project = await adapter.getProject(pid)
      const b = project?.builderUsed
      if (b && EMBEDDED_GUIDES[b]) return b
    } catch { /* fall through */ }
    return 'Other'
  }

  const initProgress = useCallback(async (pid: string) => {
    if (!user) return
    const now = new Date().toISOString()
    const p: ProfessionalisationProgress = {
      id: crypto.randomUUID(),
      projectId: pid,
      userId: user.id,
      currentLevel: 1,
      level1Exported: false,
      level2GithubStored: false,
      level3EnvExampleCreated: false,
      level4BuildWorks: false,
      level5SecurityFixed: false,
      level6RulesVerified: false,
      level7WebhooksVerified: false,
      level8CiAdded: false,
      level9MonitoringEnabled: false,
      level10ChecklistDone: false,
      level11LaunchPackDone: false,
      level12ProductionReady: false,
      notes: null,
      createdAt: now,
      updatedAt: now,
    }
    await adapter.saveProgress(p)
    setProgress(p)
  }, [user, adapter])

  const updateField = useCallback(async (field: keyof ProfessionalisationProgress, level: number) => {
    if (!progress || !projectId || !user) return
    const updated = {
      ...progress,
      [field]: true,
      currentLevel: Math.max(progress.currentLevel, level),
      updatedAt: new Date().toISOString(),
    }
    await adapter.saveProgress(updated)
    await adapter.updateProgressLevel(projectId, updated.currentLevel)
    setProgress(updated)
  }, [progress, projectId, user, adapter])

  const markExported = () => updateField('level1Exported', 2)
  const markGithubStored = () => updateField('level2GithubStored', 3)
  const markEnvExampleDone = () => updateField('level3EnvExampleCreated', 4)
  const markBuildWorks = () => updateField('level4BuildWorks', 5)
  const markSecurityFixed = () => updateField('level5SecurityFixed', 6)

  return {
    progress, guide, loading, error,
    initProgress, markExported, markGithubStored, markEnvExampleDone,
    markBuildWorks, markSecurityFixed, refresh,
  }
}
