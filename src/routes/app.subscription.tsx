import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { MotionGlassCard } from "@/components/glass-card";

export const Route = createFileRoute("/app/subscription")({
  head: () => ({ meta: [{ title: "Subscription — Taara" }] }),
  component: SubscriptionPage,
});

const PLANS = [
  { name: "Free", price: "$0", features: ["100 chat msgs/mo", "20 image gens", "Tools directory"], highlight: false },
  { name: "Pro", price: "$19", features: ["Unlimited chats", "Unlimited image gen", "Compare 4 models", "Prompt library"], highlight: true },
  { name: "Team", price: "$49", features: ["Everything in Pro", "5 seats", "Shared library", "Priority support"], highlight: false },
];

function SubscriptionPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Choose your <span className="text-gradient">plan</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Upgrade anytime. Cancel anytime.</p>
      </motion.div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <MotionGlassCard key={p.name} delay={i * 0.05} className={`p-7 ${p.highlight ? "ring-1 ring-primary/40" : ""}`}>
            {p.highlight && (
              <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                <Zap className="h-3 w-3" /> Most Popular
              </span>
            )}
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.name}</p>
            <p className="mt-3 font-display text-4xl font-bold">
              {p.price}<span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="mt-6 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <button className={`mt-7 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${p.highlight ? "bg-primary text-primary-foreground shadow-glow hover:brightness-110" : "border border-glass-border bg-glass hover:bg-white/5"}`}>
              {p.name === "Free" ? "Current plan" : `Upgrade to ${p.name}`}
            </button>
          </MotionGlassCard>
        ))}
      </div>
    </div>
  );
}
