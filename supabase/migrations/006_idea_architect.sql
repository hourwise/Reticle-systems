-- ============================================================================
-- Reticle Systems — Migration 006: Idea Architect (Phase 9)
-- Date: 2026-07-10
-- Idea interview → project blueprint generation with 11 document types.
-- ============================================================================

-- ─── Idea Architect Sessions ─────────────────────────────────────
-- One session per ideation interview. Stores all answers.

create table public.idea_architect_sessions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  idea_name           text,                              -- working project name
  one_liner           text,                              -- one-sentence description
  problem_statement   text,                              -- what problem it solves
  target_audience     text,                              -- who it is for
  project_type        text not null                      -- saas, mobile_app, marketplace, website, game, api, automation, other
                        check (project_type in ('saas', 'mobile_app', 'marketplace', 'website', 'game', 'api', 'automation', 'other')),
  skill_level         text not null                      -- beginner, intermediate, advanced
                        check (skill_level in ('beginner', 'intermediate', 'advanced')),
  budget              text not null                      -- none, under_1k, 1k_10k, over_10k
                        check (budget in ('none', 'under_1k', '1k_10k', 'over_10k')),
  timeline            text not null                      -- weekend, month, quarter, year
                        check (timeline in ('weekend', 'month', 'quarter', 'year')),
  needs_auth          boolean not null default false,
  needs_payments      boolean not null default false,
  needs_mobile        boolean not null default false,
  compliance          text[] not null default '{}',      -- gdpr, hipaa, pci, none
  competitors         text,                              -- known competitors
  monetisation        text not null                      -- subscription, one_time, freemium, ads, marketplace, unsure
                        check (monetisation in ('subscription', 'one_time', 'freemium', 'ads', 'marketplace', 'unsure')),
  brand_name          text,                              -- desired brand name
  extra_context       text,                              -- anything else
  generated_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── Generated Documents ─────────────────────────────────────────
-- One row per generated document. Content is markdown.

create table public.idea_architect_documents (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.idea_architect_sessions(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  doc_type        text not null
                    check (doc_type in (
                      'readme', 'idea_summary', 'validation_report', 'business_model',
                      'budget_plan', 'build_plan', 'marketing_plan', 'learning_plan',
                      'source_of_truth', 'agents', 'env_example'
                    )),
  filename        text not null,                         -- e.g. 'README.md'
  title           text not null,                         -- display title
  content         text not null,                         -- markdown content
  created_at      timestamptz not null default now(),
  unique(session_id, doc_type)
);

-- ─── Indexes ─────────────────────────────────────────────────────

create index idx_idea_sessions_user_id on public.idea_architect_sessions(user_id);
create index idx_idea_documents_session_id on public.idea_architect_documents(session_id);

-- ─── RLS ─────────────────────────────────────────────────────────

alter table public.idea_architect_sessions enable row level security;
alter table public.idea_architect_documents enable row level security;

create policy "Users can read own sessions"
  on public.idea_architect_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.idea_architect_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.idea_architect_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete own sessions"
  on public.idea_architect_sessions for delete
  using (auth.uid() = user_id);

create policy "Users can read own documents"
  on public.idea_architect_documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on public.idea_architect_documents for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.idea_architect_documents for delete
  using (auth.uid() = user_id);
