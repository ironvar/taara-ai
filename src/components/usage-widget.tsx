import { useEffect, useState } from "react";
import { MessageSquare, ImageIcon, Video, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { MotionGlassCard } from "@/components/glass-card";
import { PLAN_LABELS, PLAN_LIMITS, formatCountdown, useUsage } from "@/hooks/use-usage";

export function UsageWidget() {
  const { usage, loading, resetIn } = useUsage();
  const [tick, setTick] = useState(resetIn);

  useEffect(() => {
    setTick(resetIn);
    const id = setInterval(() => setTick((t) => Math.max(0, t - 60_000)), 60_000);
    return () => clearInterval(id);
  }, [resetIn]);

  if (loading || !usage) {
    return <div className="glass h-44 animate-pulse rounded-2xl" />;
  }

  const limits = PLAN_LIMITS[usage.plan];
  const rows = [
    { key: "chat", label: "Chats", icon: MessageSquare, used: usage.chat, limit: limits.chat },
    { key: "image", label: "Images", icon: ImageIcon, used: usage.image, limit: limits.image },
    { key: "video", label: "Videos", icon: Video, used: usage.video, limit: limits.video },
  ] as const;

  return (
    <MotionGlassCard className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Your plan</p>
          <p className="mt-0.5 font-display text-lg font-semibold">
            {PLAN_LABELS[usage.plan]}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
          <Clock className="h-3 w-3" /> Resets in {formatCountdown(tick)}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((r) => {
          const unlimited = r.limit === null;
          const pct = unlimited ? 100 : Math.min(100, (r.used / (r.limit as number)) * 100);
          const danger = !unlimited && pct >= 100;
          const warn = !unlimited && pct >= 80 && !danger;
          return (
            <div key={r.key}>
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <r.icon className="h-3.5 w-3.5" /> {r.label}
                </span>
                <span className={`font-medium ${danger ? "text-rose-400" : warn ? "text-amber-300" : "text-foreground"}`}>
                  {r.used}
                  {unlimited ? " / ∞" : ` / ${r.limit}`}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    danger
                      ? "bg-gradient-to-r from-rose-500 to-rose-400"
                      : warn
                      ? "bg-gradient-to-r from-amber-500 to-amber-300"
                      : "bg-gradient-to-r from-primary to-primary-glow"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </MotionGlassCard>
  );
}
