import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Folder } from "lucide-react";
import { MotionGlassCard } from "@/components/glass-card";

export const Route = createFileRoute("/app/saved")({
  head: () => ({ meta: [{ title: "Saved Projects — Taara" }] }),
  component: () => (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Saved <span className="text-gradient">Projects</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Your chats, images and bookmarks in one place.</p>
      </motion.div>
      <MotionGlassCard className="mt-8 flex flex-col items-center p-14 text-center">
        <Folder className="h-10 w-10 text-primary/60" />
        <p className="mt-3 text-sm text-muted-foreground">No saved projects yet. Start a chat or generate an image — it’ll show up here.</p>
      </MotionGlassCard>
    </div>
  ),
});
