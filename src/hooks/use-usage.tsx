import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type Plan = "free" | "premium" | "pro";

export const PLAN_LIMITS: Record<Plan, { chat: number | null; image: number; video: number }> = {
  free:    { chat: 20, image: 5,  video: 3 },
  premium: { chat: 50, image: 20, video: 15 },
  pro:     { chat: null, image: 50, video: 30 },
};

export const PLAN_LABELS: Record<Plan, string> = { free: "Free", premium: "Premium", pro: "Pro" };

export type UsageSummary = {
  plan: Plan;
  day: string;
  chat: number;
  image: number;
  video: number;
};

export function useUsage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setUsage(null); setLoading(false); return; }
    const { data, error } = await supabase.rpc("get_my_usage_summary");
    if (!error && data) setUsage(data as UsageSummary);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  // Time until UTC midnight (rolling 24h reset)
  const resetIn = (() => {
    const now = new Date();
    const reset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
    return Math.max(0, reset.getTime() - now.getTime());
  })();

  return { usage, loading, refresh, resetIn };
}

export function formatCountdown(ms: number) {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}
