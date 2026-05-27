import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Zap, X } from "lucide-react";
import { PLAN_LABELS, type Plan } from "@/hooks/use-usage";

type Props = {
  open: boolean;
  onClose: () => void;
  kind: "chat" | "image" | "video";
  plan?: Plan;
  limit?: number | null;
};

const KIND_LABEL = { chat: "chats", image: "image generations", video: "video generations" };

export function LimitReachedModal({ open, onClose, kind, plan = "free", limit }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-md rounded-3xl p-7 shadow-glow"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/30 to-rose-500/20 text-amber-300">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold">Daily limit reached</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You've used all {limit ?? ""} of your {KIND_LABEL[kind]} on the{" "}
              <span className="text-foreground font-medium">{PLAN_LABELS[plan]}</span> plan today.
              Limits reset at 00:00 UTC.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-glass-border bg-glass px-4 py-2.5 text-sm font-medium hover:bg-white/5"
              >
                Maybe later
              </button>
              <Link
                to="/app/subscription"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:brightness-110"
              >
                <Zap className="h-4 w-4" /> Upgrade
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
