import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MotionGlassCard } from "@/components/glass-card";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Taara" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Settings
      </motion.h1>
      <MotionGlassCard className="mt-6 p-6">
        <h2 className="font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Display name, avatar and language preferences.</p>
        <div className="mt-4 space-y-3">
          <input placeholder="Display name" className="w-full rounded-xl border border-glass-border bg-surface/40 px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none" />
          <input placeholder="Email" className="w-full rounded-xl border border-glass-border bg-surface/40 px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none" />
        </div>
      </MotionGlassCard>
      <MotionGlassCard className="mt-4 p-6">
        <h2 className="font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">Taara uses a dark futuristic theme by default.</p>
      </MotionGlassCard>
    </div>
  ),
});
