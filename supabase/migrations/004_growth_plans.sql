-- ============================================================================
-- Reticle Systems — Migration 004: Growth Plans (Phase 6)
-- Date: 2026-07-10
-- Enables post-audit growth advice: SEO, landing page, social launch, positioning.
-- Growth advice appears after critical technical blockers are addressed.
-- ============================================================================

-- ─── Growth Plans ────────────────────────────────────────────────
-- One plan per project. Regenerated on demand when project data changes.

create table public.growth_plans (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references public.projects(id) on delete cascade,
  user_id           uuid not null references public.profiles(id) on delete cascade,
  seo_score         int not null default 0,
  conversion_score  int not null default 0,
  positioning_score int not null default 0,
  summary           text,
  status            text not null default 'draft'
                      check (status in ('draft', 'active', 'archived')),
  generated_at      timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  unique(project_id)
);

-- ─── Growth Recommendations ──────────────────────────────────────
-- Individual actionable items within a growth plan.

create table public.growth_recommendations (
  id                uuid primary key default gen_random_uuid(),
  plan_id           uuid not null references public.growth_plans(id) on delete cascade,
  project_id        uuid not null references public.projects(id) on delete cascade,
  user_id           uuid not null references public.profiles(id) on delete cascade,
  category          text not null
                      check (category in ('seo', 'conversion', 'social', 'positioning', 'email', 'launch', 'content', 'analytics')),
  priority          int not null default 3 check (priority between 1 and 5),
  title             text not null,
  description       text not null,
  action_items      text[] not null default '{}',
  estimated_impact  text not null default 'medium'
                      check (estimated_impact in ('low', 'medium', 'high')),
  completed         boolean not null default false,
  completed_at      timestamptz,
  created_at        timestamptz not null default now()
);

-- ─── Launch Calendar ─────────────────────────────────────────────
-- 12-week launch timeline with categorized tasks.

create table public.launch_calendar_items (
  id                uuid primary key default gen_random_uuid(),
  plan_id           uuid not null references public.growth_plans(id) on delete cascade,
  project_id        uuid not null references public.projects(id) on delete cascade,
  user_id           uuid not null references public.profiles(id) on delete cascade,
  week_number       int not null check (week_number between 1 and 12),
  task_title        text not null,
  task_description  text not null,
  category          text not null
                      check (category in ('social', 'content', 'outreach', 'technical', 'review', 'launch')),
  completed         boolean not null default false,
  completed_at      timestamptz,
  due_date          date,
  created_at        timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────

create index idx_growth_plans_project_id on public.growth_plans(project_id);
create index idx_growth_recommendations_plan_id on public.growth_recommendations(plan_id);
create index idx_growth_recommendations_project_id on public.growth_recommendations(project_id);
create index idx_launch_calendar_plan_id on public.launch_calendar_items(plan_id);
create index idx_launch_calendar_project_id on public.launch_calendar_items(project_id);

-- ─── RLS ─────────────────────────────────────────────────────────

alter table public.growth_plans enable row level security;
alter table public.growth_recommendations enable row level security;
alter table public.launch_calendar_items enable row level security;

-- Growth plans: users read/write own
create policy "Users can read own growth plans"
  on public.growth_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own growth plans"
  on public.growth_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own growth plans"
  on public.growth_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete own growth plans"
  on public.growth_plans for delete
  using (auth.uid() = user_id);

-- Recommendations: users read/write own
create policy "Users can read own recommendations"
  on public.growth_recommendations for select
  using (auth.uid() = user_id);

create policy "Users can insert own recommendations"
  on public.growth_recommendations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own recommendations"
  on public.growth_recommendations for update
  using (auth.uid() = user_id);

create policy "Users can delete own recommendations"
  on public.growth_recommendations for delete
  using (auth.uid() = user_id);

-- Calendar: users read/write own
create policy "Users can read own calendar items"
  on public.launch_calendar_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own calendar items"
  on public.launch_calendar_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own calendar items"
  on public.launch_calendar_items for update
  using (auth.uid() = user_id);

create policy "Users can delete own calendar items"
  on public.launch_calendar_items for delete
  using (auth.uid() = user_id);
