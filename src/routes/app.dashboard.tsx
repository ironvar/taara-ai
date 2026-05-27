import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MessageSquare, ImageIcon, GitCompare, Wand2, Sparkles, TrendingUp, Zap, Folder } from "lucide-react";
import { MotionGlassCard } from "@/components/glass-card";
import { UsageWidget } from "@/components/usage-widget";
import { TOOLS } from "@/data/tools";


export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Taara" }] }),
  component: Dashboard,
});

const quickActions = [
  { to: "/app/chat", label: "Start a chat", icon: MessageSquare, desc: "Multi-model AI" },
  { to: "/app/image", label: "Generate image", icon: ImageIcon, desc: "Any style or ratio" },
  { to: "/app/compare", label: "Compare models", icon: GitCompare, desc: "Side-by-side" },
  { to: "/app/tools", label: "Browse tools", icon: Wand2, desc: "50+ curated" },
];

const stats = [
  { label: "Chats this week", value: "12", icon: MessageSquare },
  { label: "Images generated", value: "37", icon: ImageIcon },
  { label: "Tools bookmarked", value: "8", icon: Folder },
  { label: "Active streak", value: "5 days", icon: TrendingUp },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-sm text-muted-foreground">Welcome back 👋</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          What will you <span className="text-gradient">create</span> today?
        </h1>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a, i) => (
          <MotionGlassCard key={a.to} delay={i * 0.05} className="p-5">
            <Link to={a.to} className="block">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary-glow/10 text-primary">
                <a.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-semibold">{a.label}</p>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </Link>
          </MotionGlassCard>
        ))}
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1"><UsageWidget /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {stats.map((s, i) => (
            <MotionGlassCard key={s.label} delay={i * 0.04} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold">{s.value}</p>
            </MotionGlassCard>
          ))}
        </div>
      </div>


      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Trending tools</h2>
          <Link to="/app/tools" className="text-sm text-primary hover:underline">See all →</Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.slice(0, 6).map((t, i) => (
            <MotionGlassCard key={t.id} delay={i * 0.03} className="flex items-center gap-3 p-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg, oklch(0.55 0.18 ${t.hue}), oklch(0.40 0.20 ${(t.hue + 50) % 360}))` }}
              >
                {t.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{t.name}</p>
                <p className="truncate text-xs text-muted-foreground">{t.category}</p>
              </div>
              <Sparkles className="h-4 w-4 text-primary/60" />
            </MotionGlassCard>
          ))}
        </div>
      </div>

      <MotionGlassCard className="mt-10 flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Zap className="h-3.5 w-3.5" /> Taara Pro
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold">Go unlimited</h3>
          <p className="mt-1 text-sm text-muted-foreground">Unlimited chats, image gen, and side-by-side model compare.</p>
        </div>
        <Link to="/app/subscription" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:brightness-110">
          Upgrade
        </Link>
      </MotionGlassCard>
    </div>
  );
}
