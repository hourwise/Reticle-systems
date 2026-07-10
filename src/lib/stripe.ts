import { supabase } from './supabaseClient';
import { PRICING } from './constants';

// ─── Types ───────────────────────────────────────────────────────

export type CreditTier = 'basic' | 'deeper' | 'full';

export interface CreditBalance {
  freeScans: number;
  paidCredits: number;
}

export interface CheckoutOptions {
  tier: CreditTier;
  projectId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

// ─── Credit balance ──────────────────────────────────────────────

export async function getCreditBalance(): Promise<CreditBalance> {
  const { data, error } = await supabase
    .from('credits')
    .select('credit_type, quantity')
    .order('credit_type');

  if (error) throw error;

  const freeRow = (data || []).find((r) => r.credit_type === 'free_scan');
  const paidRow = (data || []).find((r) => r.credit_type === 'paid_report');

  return {
    freeScans: freeRow?.quantity ?? 0,
    paidCredits: paidRow?.quantity ?? 0,
  };
}

// ─── Consume a free scan credit ──────────────────────────────────

export async function consumeFreeScan(): Promise<boolean> {
  const { data } = await supabase
    .from('credits')
    .select('id, quantity')
    .eq('credit_type', 'free_scan')
    .single();

  if (!data || data.quantity <= 0) return false;

  const { error } = await supabase
    .from('credits')
    .update({ quantity: data.quantity - 1, updated_at: new Date().toISOString() })
    .eq('id', data.id);

  if (error) throw error;
  return true;
}

// ─── Consume a paid credit ───────────────────────────────────────

export async function consumePaidCredit(amount: number = 1): Promise<boolean> {
  const { data } = await supabase
    .from('credits')
    .select('id, quantity')
    .eq('credit_type', 'paid_report')
    .single();

  if (!data || data.quantity < amount) return false;

  const { error } = await supabase
    .from('credits')
    .update({ quantity: data.quantity - amount, updated_at: new Date().toISOString() })
    .eq('id', data.id);

  if (error) throw error;
  return true;
}

// ─── Redirect to Stripe Checkout ─────────────────────────────────

export async function redirectToCheckout(options: CheckoutOptions): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Must be signed in to purchase credits.');
  }

  const origin = window.location.origin;
  const tierPricing = PRICING[options.tier.toUpperCase() as keyof typeof PRICING];

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        tier: options.tier,
        projectId: options.projectId || '',
        successUrl: options.successUrl || `${origin}/dashboard?checkout=success`,
        cancelUrl: options.cancelUrl || `${origin}/dashboard?checkout=cancelled`,
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Checkout failed' }));
    throw new Error(err.error || 'Checkout failed');
  }

  const { url } = await response.json();
  if (!url) throw new Error('No checkout URL returned');

  window.location.href = url;
}

// ─── Price display helpers ───────────────────────────────────────

export function getTierPrice(tier: CreditTier): number {
  const key = tier.toUpperCase() as keyof typeof PRICING;
  return PRICING[key]?.price ?? 0;
}

export function getTierCredits(tier: CreditTier): number {
  const key = tier.toUpperCase() as keyof typeof PRICING;
  return PRICING[key]?.credits ?? 0;
}
