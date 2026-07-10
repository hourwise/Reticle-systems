-- ============================================================================
-- Reticle Systems — Migration 003: Repair Prompts & Verification
-- Date: 2026-07-10
-- Enables the "I've fixed it → Rescan → Verified ✓" loop (Phase 5).
-- ============================================================================

-- ─── Repair Prompts ──────────────────────────────────────────────
-- Stores generated repair prompts per finding, tailored to builder/tool.

create table public.repair_prompts (
  id           uuid primary key default gen_random_uuid(),
  finding_id   uuid not null references public.audit_findings(id) on delete cascade,
  project_id   uuid not null references public.projects(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  builder      text not null,           -- e.g. 'Lovable', 'Cursor', 'Codex', 'generic'
  prompt_title text not null,           -- short label for the prompt
  prompt_body  text not null,           -- the full repair prompt text
  constraints  text[],                  -- e.g. ['no-secrets', 'preserve-auth', 'no-unrelated-changes']
  verification_steps text[],            -- manual verification checklist
  created_at   timestamptz not null default now()
);

-- ─── Verification Attempts ───────────────────────────────────────
-- Logs every rescan/verification attempt for audit trail.

create table public.verification_attempts (
  id              uuid primary key default gen_random_uuid(),
  finding_id      uuid not null references public.audit_findings(id) on delete cascade,
  project_id      uuid not null references public.projects(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  previous_status text not null,
  new_status      text not null
                    check (new_status in (
                      'verified', 'still_failing', 'manual_review_needed'
                    )),
  score_before    jsonb,               -- snapshot of scores before rescan
  score_after     jsonb,               -- snapshot of scores after rescan
  note            text,                -- optional user note
  created_at      timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────

create index idx_repair_prompts_finding_id on public.repair_prompts(finding_id);
create index idx_repair_prompts_project_id on public.repair_prompts(project_id);
create index idx_verification_attempts_finding_id on public.verification_attempts(finding_id);
create index idx_verification_attempts_project_id on public.verification_attempts(project_id);

-- ─── RLS ─────────────────────────────────────────────────────────

alter table public.repair_prompts enable row level security;
alter table public.verification_attempts enable row level security;

-- Repair prompts: users read/write own
create policy "Users can read own repair prompts"
  on public.repair_prompts for select
  using (auth.uid() = user_id);

create policy "Users can insert own repair prompts"
  on public.repair_prompts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own repair prompts"
  on public.repair_prompts for delete
  using (auth.uid() = user_id);

-- Verification attempts: users can read/insert own, no updates/deletes
create policy "Users can read own verification attempts"
  on public.verification_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own verification attempts"
  on public.verification_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users cannot update verification attempts"
  on public.verification_attempts for update
  using (false);

create policy "Users cannot delete verification attempts"
  on public.verification_attempts for delete
  using (false);

-- ============================================================================
-- Function: generate repair prompt from finding
-- Used by the frontend to build safe, tailored prompts.
-- ============================================================================

-- (This is a placeholder — actual prompt generation happens client-side
--  or via an Edge Function. The table stores the results.)

-- ============================================================================
-- Function: recalculate project scores from findings
-- ============================================================================

create or replace function public.get_project_score_summary(p_project_id uuid)
returns table (
  security_score int,
  launch_score int,
  seo_score int,
  growth_score int,
  total_findings int,
  critical_count int,
  high_count int,
  verified_count int,
  still_failing_count int
)
language sql
security definer
as $$
  with stats as (
    select
      count(*)::int as total,
      count(*) filter (where severity = 'critical')::int as crit,
      count(*) filter (where severity = 'high')::int as high,
      count(*) filter (where verification_status = 'verified')::int as verified,
      count(*) filter (where verification_status = 'still_failing')::int as failing
    from public.audit_findings
    where project_id = p_project_id
  ),
  cat_scores as (
    select
      greatest(0, least(100,
        100
        - count(*) filter (where category = 'security' and verification_status not in ('verified'))
            * 8
        - count(*) filter (where category = 'security' and severity = 'critical' and verification_status not in ('verified'))
            * 17
      ))::int as sec,
      greatest(0, least(100,
        100
        - count(*) filter (where category = 'launch' and verification_status not in ('verified'))
            * 10
      ))::int as launch,
      greatest(0, least(100,
        100
        - count(*) filter (where category = 'seo' and verification_status not in ('verified'))
            * 10
      ))::int as seo,
      greatest(0, least(100,
        100
        - count(*) filter (where category = 'growth' and verification_status not in ('verified'))
            * 10
      ))::int as grow
    from public.audit_findings
    where project_id = p_project_id
  )
  select s.sec, s.launch, s.seo, s.grow,
         coalesce(st.total, 0), coalesce(st.crit, 0), coalesce(st.high, 0),
         coalesce(st.verified, 0), coalesce(st.failing, 0)
  from cat_scores s, stats st;
$$;
