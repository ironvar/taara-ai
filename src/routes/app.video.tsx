import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Video, Sparkles } from "lucide-react";
import { MotionGlassCard } from "@/components/glass-card";

export const Route = createFileRoute("/app/video")({
  head: () => ({ meta: [{ title: "Video Generator — Taara" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Video <span className="text-gradient">Generator</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Turn a prompt into a cinematic short clip.</p>
      </motion.div>
      <MotionGlassCard className="mt-8 flex flex-col items-center p-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
          <Video className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold">Coming in v1.1</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Video generation is rolling out next. In the meantime, try our image generator — it’s ready to go.
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" /> Early access soon
        </span>
      </MotionGlassCard>
    </div>
  ),
});
