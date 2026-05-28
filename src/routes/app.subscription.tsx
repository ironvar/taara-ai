import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Zap, Sparkles, Clock, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MotionGlassCard } from "@/components/glass-card";
import { UsageWidget } from "@/components/usage-widget";
import { useUsage, PLAN_LABELS, type Plan } from "@/hooks/use-usage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/subscription")({
  head: () => ({ meta: [{ title: "Subscription — Taara" }] }),
  component: SubscriptionPage,
});

type PlanDef = {
  id: Plan;
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  highlight: boolean;
};

const PLANS: PlanDef[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Try the full Taara experience",
    features: ["20 AI chats / day", "5 image generations / day", "3 video generations / day", "Full tools directory", "Save & sync across devices"],
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$5",
    period: "/month",
    tagline: "For creators & power users",
    features: ["50 AI chats / day", "20 image generations / day", "15 video generations / day", "All Free features", "Priority response times"],
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$10",
    period: "/month",
    tagline: "For professionals & teams",
    features: ["Unlimited AI chats", "50 image generations / day", "30 video generations / day", "Side-by-side model compare", "Priority support"],
    highlight: false,
  },
];

const ROWS = [
  { label: "AI chats / day", free: "20", premium: "50", pro: "Unlimited" },
  { label: "Image generations / day", free: "5", premium: "20", pro: "50" },
  { label: "Video generations / day", free: "3", premium: "15", pro: "30" },
  { label: "Multi-model compare", free: "—", premium: "—", pro: "✓" },
  { label: "Priority support", free: "—", premium: "✓", pro: "✓" },
  { label: "Cloud sync", free: "✓", premium: "✓", pro: "✓" },
];

function SubscriptionPage() {
  const { user } = useAuth();
  const { usage, refresh } = useUsage();
  const [upgrading, setUpgrading] = useState<Plan | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; event_type: string; amount_cents: number | null; currency: string | null; created_at: string }>>([]);

  // Payment status toast on return from checkout (?status=success|cancel)
  useEffect(() => {
    const u = new URL(window.location.href);
    const status = u.searchParams.get("status");
    if (status === "success") toast.success("Subscription activated 🎉");
    if (status === "cancel") toast("Checkout canceled");
    if (status) {
      u.searchParams.delete("status");
      window.history.replaceState({}, "", u.toString());
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("payment_events")
      .select("id,event_type,amount_cents,currency,created_at")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setHistory((data as typeof history) ?? []));
  }, [user]);

  const currentPlan = usage?.plan ?? "free";

  const upgrade = async (plan: Plan) => {
    if (!user) { toast("Sign in first"); return; }
    setUpgrading(plan);
    // Payments are not enabled yet. Plan changes must come from a trusted backend
    // (Stripe webhook → service role) — the client cannot self-upgrade.
    toast("Payments coming soon", {
      description: `${PLAN_LABELS[plan]} will be available once checkout is enabled.`,
    });
    setUpgrading(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Choose your <span className="text-gradient">plan</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Daily limits reset every 24 hours. Cancel anytime.</p>
      </motion.div>

      {user && (
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1"><UsageWidget /></div>
          <MotionGlassCard className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Current plan</p>
                <p className="mt-0.5 font-display text-lg font-semibold">{PLAN_LABELS[currentPlan]}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                <Clock className="h-3 w-3" /> Active
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Usage limits renew automatically every day at 00:00 UTC. You can upgrade or downgrade any time.
            </p>
          </MotionGlassCard>
        </div>
      )}

      {/* Pricing cards */}
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p, i) => {
          const isCurrent = currentPlan === p.id;
          return (
            <MotionGlassCard
              key={p.id}
              delay={i * 0.06}
              className={`relative overflow-hidden p-7 transition ${p.highlight ? "ring-1 ring-primary/50 shadow-glow" : ""}`}
            >
              {p.highlight && (
                <>
                  <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-primary-glow/10" />
                  <span className="relative inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    <Sparkles className="h-3 w-3" /> Recommended
                  </span>
                </>
              )}
              <div className="relative">
                <p className={`${p.highlight ? "mt-3" : ""} text-xs uppercase tracking-wider text-muted-foreground`}>{p.name}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>

                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => upgrade(p.id)}
                  disabled={isCurrent || upgrading === p.id}
                  className={`group relative mt-7 w-full overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                    p.highlight
                      ? "bg-primary text-primary-foreground shadow-glow hover:brightness-110"
                      : isCurrent
                      ? "border border-glass-border bg-glass"
                      : "border border-glass-border bg-glass hover:bg-white/5"
                  }`}
                >
                  {p.highlight && !isCurrent && (
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  )}
                  <span className="relative inline-flex items-center justify-center gap-1.5">
                    {isCurrent ? "Current plan" : p.id === "free" ? "Downgrade" : <><Zap className="h-4 w-4" /> Upgrade to {p.name}</>}
                  </span>
                </button>
              </div>
            </MotionGlassCard>
          );
        })}
      </div>

      {/* Comparison table */}
      <MotionGlassCard className="mt-10 overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-glass-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-4 text-left font-medium">Features</th>
              <th className="px-5 py-4 text-center font-medium">Free</th>
              <th className="px-5 py-4 text-center font-medium text-primary">Premium</th>
              <th className="px-5 py-4 text-center font-medium">Pro</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.label} className={i % 2 === 0 ? "bg-white/[0.015]" : ""}>
                <td className="px-5 py-3 text-foreground/90">{r.label}</td>
                <td className="px-5 py-3 text-center text-muted-foreground">{r.free}</td>
                <td className="px-5 py-3 text-center font-medium">{r.premium}</td>
                <td className="px-5 py-3 text-center text-muted-foreground">{r.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </MotionGlassCard>

      {/* Billing history */}
      {user && (
        <MotionGlassCard className="mt-10 p-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Billing history</h3>
          </div>
          {history.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No payments yet. Your invoices will appear here once you upgrade.
            </p>
          ) : (
            <table className="mt-4 w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 text-left font-medium">Date</th>
                  <th className="py-2 text-left font-medium">Event</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-t border-glass-border">
                    <td className="py-2 text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</td>
                    <td className="py-2">{h.event_type}</td>
                    <td className="py-2 text-right">
                      {h.amount_cents != null ? `${(h.amount_cents / 100).toFixed(2)} ${h.currency?.toUpperCase() ?? ""}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </MotionGlassCard>
      )}

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Need help?{" "}
        <Link to="/app/settings" className="text-primary hover:underline">Manage your account</Link>
      </p>
    </div>
  );
}
