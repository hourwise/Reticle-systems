-- ============================================================================
-- Reticle Systems — Migration 005: Professionalisation & GitHub Migration
-- Date: 2026-07-10
-- Tracks the user's journey from builder project → professional codebase.
-- Phase 8: GitHub Migration Assistant + Professionalisation Layer.
-- ============================================================================

-- ─── Professionalisation Progress ────────────────────────────────
-- One row per project. Tracks which professionalisation milestones
-- have been achieved (levels 1–12).

create table public.professionalisation_progress (
  id                          uuid primary key default gen_random_uuid(),
  project_id                  uuid not null references public.projects(id) on delete cascade,
  user_id                     uuid not null references public.profiles(id) on delete cascade,
  current_level               int not null default 1 check (current_level between 1 and 12),
  level_1_exported            boolean not null default false,   -- Project downloaded from builder
  level_2_github_stored       boolean not null default false,   -- Project stored in GitHub
  level_3_env_example_created  boolean not null default false,   -- .env.example created, secrets removed
  level_4_build_works         boolean not null default false,   -- Build command succeeds locally
  level_5_security_fixed      boolean not null default false,   -- Critical security blockers resolved
  level_6_rules_verified      boolean not null default false,   -- Firebase/Supabase rules verified
  level_7_webhooks_verified   boolean not null default false,   -- Stripe webhooks verified (if payments)
  level_8_ci_added            boolean not null default false,   -- CI pipeline configured
  level_9_monitoring_enabled  boolean not null default false,   -- Monitoring/alerting enabled
  level_10_checklist_done     boolean not null default false,   -- Production checklist completed
  level_11_launch_pack_done   boolean not null default false,   -- Launch pack generated
  level_12_production_ready   boolean not null default false,   -- Marked production-ready
  notes                       text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  unique(project_id)
);

-- ─── GitHub Migration Guides ─────────────────────────────────────
-- Builder-specific step-by-step instructions for migrating to GitHub.

create table public.github_migration_guides (
  id              uuid primary key default gen_random_uuid(),
  builder         text not null unique,  -- 'Lovable', 'Bolt', 'Replit', 'Cursor', 'Codex', 'Other'
  title           text not null,
  description     text not null,
  steps           jsonb not null,        -- [{ "order": 1, "title": "...", "detail": "...", "tip": "..." }]
  gitignore_rules text[],                -- Recommended .gitignore entries for this builder
  env_example_vars text[],              -- Recommended .env.example entries
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────

create index idx_prof_progress_project_id on public.professionalisation_progress(project_id);
create index idx_migration_guides_builder on public.github_migration_guides(builder);

-- ─── RLS ─────────────────────────────────────────────────────────

alter table public.professionalisation_progress enable row level security;
alter table public.github_migration_guides enable row level security;

-- Progress: users read/write own
create policy "Users can read own progress"
  on public.professionalisation_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.professionalisation_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.professionalisation_progress for update
  using (auth.uid() = user_id);

-- Guides: readable by all authenticated users
create policy "Authenticated users can read migration guides"
  on public.github_migration_guides for select
  using (auth.role() = 'authenticated');

-- ============================================================================
-- Seed data: Builder-specific migration guides
-- ============================================================================

insert into public.github_migration_guides (builder, title, description, steps, gitignore_rules, env_example_vars) values
(
  'Lovable',
  'Export from Lovable to GitHub',
  'Lovable projects can be exported as a ZIP containing your full codebase. This guide walks you through downloading, setting up Git, and pushing to GitHub — no terminal required.',
  '[
    {"order":1,"title":"Download your project from Lovable","detail":"In Lovable, click the three-dot menu → \"Export\" → \"Download as ZIP\". Save the ZIP file to your Desktop.","tip":"Make sure you have exported the latest version of your project."},
    {"order":2,"title":"Extract the ZIP file","detail":"Right-click the ZIP file → \"Extract All\" → choose a folder like C:\\Users\\YourName\\Projects\\your-project-name.","tip":"Avoid folders synced with OneDrive or iCloud — they can interfere with Git."},
    {"order":3,"title":"Install GitHub Desktop","detail":"Download GitHub Desktop from desktop.github.com. Install and sign in with your GitHub account.","tip":"GitHub Desktop is free and works on Windows and Mac. No terminal needed."},
    {"order":4,"title":"Create a GitHub repository","detail":"In GitHub Desktop: File → \"Add local repository\" → choose your extracted project folder. Then \"Publish repository\" → set it to Private.","tip":"Always start with a Private repository. You can make it public later when ready to launch."},
    {"order":5,"title":"Create a .gitignore file","detail":"Create a file called \".gitignore\" in your project root (use Notepad). Add entries for node_modules, .env, .env.local, and build outputs.","tip":"A .gitignore prevents secrets and generated files from being committed. See the recommended rules below."},
    {"order":6,"title":"Create a .env.example file","detail":"Copy your .env or .env.local file, rename it to .env.example, and replace all actual values with placeholder text like \"your-key-here\". Commit .env.example but never .env.","tip":"This lets other developers (and your future self) know what environment variables are needed without exposing secrets."},
    {"order":7,"title":"Make your first commit","detail":"In GitHub Desktop, you will see changed files. Write a summary like \"Initial project export from Lovable\" and click \"Commit to main\". Then \"Push origin\".","tip":"Good commit messages help you understand what changed when you look back weeks later."},
    {"order":8,"title":"Verify nothing sensitive was committed","detail":"Check your GitHub repository online. Make sure .env files, API keys, and passwords are NOT visible. If they are, remove them immediately and force-push a cleaned history.","tip":"If you accidentally committed secrets, rotate (change) those keys immediately — they are now compromised."}
  ]',
  ARRAY[
    'node_modules/',
    'dist/',
    'build/',
    '.env',
    '.env.local',
    '.env.*.local',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    '.vscode/',
    '.idea/'
  ],
  ARRAY[
    'VITE_SUPABASE_URL=your-supabase-url',
    'VITE_SUPABASE_ANON_KEY=your-supabase-anon-key',
    '# Add any other environment variables your project uses below'
  ]
),
(
  'Bolt',
  'Export from Bolt.new to GitHub',
  'Bolt.new projects can be downloaded as a ZIP or connected directly to GitHub. This guide covers both approaches.',
  '[
    {"order":1,"title":"Download your project from Bolt","detail":"In Bolt, click the download icon in the top bar. Choose \"Download as ZIP\". Save to your Desktop.","tip":"Alternatively, if Bolt offers direct GitHub integration, use that — it is faster."},
    {"order":2,"title":"Extract and set up locally","detail":"Extract the ZIP to a folder. The project uses Vite + React + TypeScript by default.","tip":"Bolt projects use npm. Run \"npm install\" and \"npm run dev\" to verify everything works locally first."},
    {"order":3,"title":"Install GitHub Desktop and create repo","detail":"Download GitHub Desktop from desktop.github.com. Add your project folder as a local repository, then publish it as Private.","tip":"GitHub Desktop handles all Git operations visually — no command line needed."},
    {"order":4,"title":"Set up .gitignore and .env.example","detail":"Create both files in your project root. The .gitignore should exclude node_modules, .env, and build outputs. The .env.example should list all needed variables with placeholder values.","tip":"Bolt projects often have Supabase keys in .env. Make sure .env is in .gitignore before committing."},
    {"order":5,"title":"Commit and push","detail":"Stage all files, write a descriptive commit message, and push to GitHub. Verify online that no secrets are exposed.","tip":"Review every file in the commit before pushing. It is much easier to fix now than after secrets are public."}
  ]',
  ARRAY[
    'node_modules/',
    'dist/',
    '.env',
    '.env.local',
    '*.log',
    '.DS_Store',
    '.vscode/'
  ],
  ARRAY[
    'VITE_SUPABASE_URL=your-supabase-url',
    'VITE_SUPABASE_ANON_KEY=your-supabase-anon-key'
  ]
),
(
  'Replit',
  'Export from Replit to GitHub',
  'Replit has built-in Git support. You can connect your Repl directly to a GitHub repository.',
  '[
    {"order":1,"title":"Connect Replit to GitHub","detail":"In Replit, open the Version Control tab (Git icon in the left sidebar). Click \"Connect to GitHub\" and authorise Replit.","tip":"Replit can push directly to GitHub — no download needed."},
    {"order":2,"title":"Create a GitHub repository","detail":"In the Version Control tab, click \"Create a repository\". Choose a name, set it to Private, and click Create. Replit will push your code automatically.","tip":"If your Repl has secrets, add a .gitignore first to exclude .env and any config files with keys."},
    {"order":3,"title":"Verify the repository","detail":"Open GitHub in your browser, find your new repository, and verify all files look correct. Check that no API keys or passwords are visible.","tip":"Replit Repls sometimes include test keys. Review every file carefully before sharing the repo."},
    {"order":4,"title":"Clone locally for further work","detail":"Install GitHub Desktop, clone your repository, and run \"npm install\" followed by \"npm run dev\" to verify it works locally.","tip":"Working locally gives you more control and lets you use tools like VS Code for deeper development."}
  ]',
  ARRAY[
    'node_modules/',
    '.env',
    '.replit',
    'replit.nix',
    '*.log'
  ],
  ARRAY[
    '# Replit may inject these; replace with your own:',
    'VITE_API_URL=your-api-url',
    'DATABASE_URL=your-database-url'
  ]
),
(
  'Cursor',
  'Push a Cursor project to GitHub',
  'Cursor projects are local-first and use Git natively. This guide covers setting up a remote repository.',
  '[
    {"order":1,"title":"Open your project in Cursor","detail":"Your project already lives on your computer. Open it in Cursor if it is not already open.","tip":"Cursor has built-in Git support in the Source Control panel (Ctrl+Shift+G)."},
    {"order":2,"title":"Initialise Git (if not already)","detail":"Open the terminal in Cursor (Ctrl+`) and run \"git init\". Or use the Source Control panel: \"Initialise Repository\".","tip":"If you see a .git folder already, Git is initialised — skip this step."},
    {"order":3,"title":"Create a .gitignore file","detail":"Create a .gitignore file in the root. Add node_modules/, .env, .env.local, dist/, and any build outputs.","tip":"Cursor''s AI can help: ask it to \"generate a .gitignore for a Vite React TypeScript project\"."},
    {"order":4,"title":"Create a .env.example file","detail":"Copy .env.local to .env.example. Replace all secret values with placeholder text. Commit .env.example, never .env.local.","tip":"Use Cursor''s AI: \"create a .env.example with placeholder values for all my environment variables\"."},
    {"order":5,"title":"Create a GitHub repository and push","detail":"Go to github.com → New repository (Private). Copy the remote URL. In Cursor''s terminal: \"git remote add origin <url>\" then \"git push -u origin main\".","tip":"Alternatively, install GitHub Desktop for a visual interface."},
    {"order":6,"title":"Verify and review","detail":"Visit your GitHub repository online. Check that .env files are not visible. Review the file list for anything unexpected.","tip":"If you see any secrets, rotate them immediately and clean your Git history."}
  ]',
  ARRAY[
    'node_modules/',
    'dist/',
    'build/',
    '.env',
    '.env.local',
    '.env.*.local',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    '.cursor/'
  ],
  ARRAY[
    'VITE_SUPABASE_URL=your-supabase-url',
    'VITE_SUPABASE_ANON_KEY=your-supabase-anon-key',
    '# Add any other variables your project uses'
  ]
),
(
  'Codex',
  'Push a Codex project to GitHub',
  'Codex CLI projects are local and use Git natively. This guide assumes you have a working project on your machine.',
  '[
    {"order":1,"title":"Verify your project runs locally","detail":"Run \"npm install\" and \"npm run dev\" to confirm everything works before pushing to GitHub.","tip":"Fixing issues locally is always easier than after pushing broken code."},
    {"order":2,"title":"Initialise Git and create .gitignore","detail":"Run \"git init\" in your project folder. Create a .gitignore with at minimum: node_modules/, .env, .env.local, dist/, build/.","tip":"Run \"git status\" to see what will be committed. If .env files appear, add them to .gitignore now."},
    {"order":3,"title":"Create a .env.example","detail":"Run \"cp .env.local .env.example\" then edit .env.example to replace all values with placeholders. Never commit .env.local.","tip":"A good .env.example includes comments explaining what each variable does."},
    {"order":4,"title":"Make initial commit and push","detail":"Run \"git add .\", \"git commit -m ''Initial project setup''\", then create a Private repo on GitHub and push.","tip":"Review \"git diff --cached\" before committing to catch anything you do not want to share."},
    {"order":5,"title":"Set up branch protection","detail":"On GitHub, go to Settings → Branches → Add rule. Protect your main branch: require pull requests before merging.","tip":"Branch protection prevents accidental direct pushes to main — a good habit from day one."}
  ]',
  ARRAY[
    'node_modules/',
    'dist/',
    'build/',
    '.env',
    '.env.local',
    '.env.*.local',
    '*.log',
    '.DS_Store',
    'coverage/'
  ],
  ARRAY[
    'VITE_SUPABASE_URL=your-supabase-url',
    'VITE_SUPABASE_ANON_KEY=your-supabase-anon-key',
    'VITE_ENABLE_PAYMENTS=false',
    'VITE_ENABLE_AI_FEATURES=false'
  ]
),
(
  'Other',
  'Export your project to GitHub',
  'Generic guide for projects built with other tools. Covers the fundamentals of moving any project to GitHub safely.',
  '[
    {"order":1,"title":"Locate your project files","detail":"Find where your project files are stored. If they are only online, look for an Export or Download option. Download as ZIP if available.","tip":"If your builder does not offer export, you may need to recreate the project locally using the same stack."},
    {"order":2,"title":"Extract and organise","detail":"Extract the ZIP to a clean folder. Delete any files you recognise as temporary, cache, or build outputs.","tip":"A clean project folder makes Git setup easier. Remove anything you would not want in version control."},
    {"order":3,"title":"Set up Git and GitHub","detail":"Install GitHub Desktop from desktop.github.com. Add your project folder, create a Private repository, and publish.","tip":"GitHub Desktop is the easiest way to use Git without the command line."},
    {"order":4,"title":"Create .gitignore and .env.example","detail":"Create a .gitignore file (use a template from gitignore.io for your tech stack). Create a .env.example listing all environment variables with placeholder values.","tip":"If you are unsure what to ignore, start with: node_modules/, .env, .env.local, dist/, build/, *.log."},
    {"order":5,"title":"Commit, push, and verify","detail":"Stage all files, write a clear commit message, push to GitHub. Then visit your repository online and verify no secrets, keys, or passwords are visible.","tip":"Open your repo in a private/incognito browser window to see it as a stranger would — this reveals accidentally public files."}
  ]',
  ARRAY[
    'node_modules/',
    'dist/',
    'build/',
    '.env',
    '.env.local',
    '*.log',
    '.DS_Store',
    'Thumbs.db'
  ],
  ARRAY[
    '# List all environment variables your project needs:',
    '# Example: API_KEY=your-api-key',
    '# Example: DATABASE_URL=your-database-url'
  ]
),
(
  'Claude',
  'Push a Claude-generated project to GitHub',
  'Claude Code and Claude.ai can generate complete projects. This guide helps you move from generated code to a proper GitHub repository.',
  '[
    {"order":1,"title":"Save your project files locally","detail":"If using Claude Code, your project already lives on disk. If using claude.ai, copy the generated code into local files using the same folder structure.","tip":"Create a folder structure matching what Claude generated. Keep the same file names and hierarchy."},
    {"order":2,"title":"Run the project locally first","detail":"Run \"npm install\" and \"npm run dev\" (or the equivalent for your stack). Fix any issues before pushing to GitHub.","tip":"Claude-generated code sometimes needs minor adjustments. Test everything works before sharing."},
    {"order":3,"title":"Set up Git, .gitignore, and .env.example","detail":"Run \"git init\", create a .gitignore excluding node_modules/ and .env, create .env.example with placeholder values. Install GitHub Desktop for a visual interface.","tip":"Ask Claude to generate a .gitignore tailored to your tech stack if you are unsure."},
    {"order":4,"title":"Push to GitHub and verify","detail":"Create a Private repository on GitHub, push your code, and verify online that no secrets are exposed.","tip":"Claude might have included test API keys in code or comments. Search your project for \"key\", \"secret\", \"token\", and \"password\" before pushing."}
  ]',
  ARRAY[
    'node_modules/',
    'dist/',
    'build/',
    '.env',
    '.env.local',
    '*.log',
    '.DS_Store',
    '.vscode/'
  ],
  ARRAY[
    'VITE_SUPABASE_URL=your-supabase-url',
    'VITE_SUPABASE_ANON_KEY=your-supabase-anon-key',
    '# Claude may have added other env vars — list them all here'
  ]
);
