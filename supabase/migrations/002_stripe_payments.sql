-- ============================================================================
-- Reticle Systems — Migration 002: Stripe Payments Foundation
-- Date: 2026-07-10
-- Adds stripe_customer_id to profiles and a free_scan credit bootstrap.
-- ============================================================================

-- Add Stripe customer ID to profiles for checkout session creation
alter table public.profiles
  add column if not exists stripe_customer_id text;

-- Bootstrap: grant 1 free scan credit to every existing user who doesn't have one
insert into public.credits (user_id, credit_type, quantity)
select id, 'free_scan', 1
from public.profiles
where not exists (
  select 1 from public.credits
  where public.credits.user_id = public.profiles.id
    and public.credits.credit_type = 'free_scan'
);

-- ============================================================================
-- 🔒 RLS policies for free_scan credit auto-grant on new user signup
-- ============================================================================

-- Update the handle_new_user function to also grant a free scan credit
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  );

  -- Grant 1 free scan credit to every new user
  insert into public.credits (user_id, credit_type, quantity)
  values (new.id, 'free_scan', 1);

  return new;
end;
$$;
