import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  getCreditBalance,
  consumeFreeScan,
  consumePaidCredit,
  redirectToCheckout,
  type CreditBalance,
  type CreditTier,
} from '@/lib/stripe';

interface UseCreditsReturn {
  balance: CreditBalance;
  loading: boolean;
  error: string | null;
  hasFreeScan: boolean;
  hasPaidCredits: boolean;
  consumeFree: () => Promise<boolean>;
  consumePaid: (amount?: number) => Promise<boolean>;
  purchase: (tier: CreditTier, projectId?: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useCredits(): UseCreditsReturn {
  const { user } = useAuthStore();

  const [balance, setBalance] = useState<CreditBalance>({ freeScans: 0, paidCredits: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setBalance({ freeScans: 0, paidCredits: 0 });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const b = await getCreditBalance();
      setBalance(b);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load credits';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const consumeFree = useCallback(async (): Promise<boolean> => {
    try {
      const ok = await consumeFreeScan();
      if (ok) await refresh();
      return ok;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to consume free scan');
      return false;
    }
  }, [refresh]);

  const consumePaid = useCallback(
    async (amount: number = 1): Promise<boolean> => {
      try {
        const ok = await consumePaidCredit(amount);
        if (ok) await refresh();
        return ok;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to consume credit');
        return false;
      }
    },
    [refresh],
  );

  const purchase = useCallback(
    async (tier: CreditTier, projectId?: string) => {
      setError(null);
      try {
        await redirectToCheckout({ tier, projectId });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Purchase failed');
      }
    },
    [],
  );

  return {
    balance,
    loading,
    error,
    hasFreeScan: balance.freeScans > 0,
    hasPaidCredits: balance.paidCredits > 0,
    consumeFree,
    consumePaid,
    purchase,
    refresh,
  };
}
