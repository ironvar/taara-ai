import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, ExternalLink, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { TOOLS, CATEGORIES, toolLogoUrl, type ToolCategory, type AITool } from "@/data/tools";
import { MotionGlassCard } from "@/components/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/tools")({
  head: () => ({ meta: [{ title: "AI Tools Directory — Taara" }] }),
  component: ToolsPage,
});

function ToolLogo({ tool }: { tool: AITool }) {
  const logo = toolLogoUrl(tool.url);
  const [failed, setFailed] = useState(false);
  if (logo && !failed) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
        <img
          src={logo}
          alt={`${tool.name} logo`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-9 w-9 object-contain"
        />
      </div>
    );
  }
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
      style={{ background: `linear-gradient(135deg, oklch(0.55 0.18 ${tool.hue}), oklch(0.40 0.20 ${(tool.hue + 50) % 360}))` }}
    >
      {tool.initials}
    </div>
  );
}

function ToolsPage() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ToolCategory | "All">("All");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Load bookmarks
  useEffect(() => {
    if (!user) return;
    supabase.from("bookmarks").select("tool_id").then(({ data }) => {
      if (data) setBookmarks(new Set(data.map((d) => d.tool_id)));
    });
  }, [user]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return TOOLS.filter((x) => {
      if (cat !== "All" && x.category !== cat) return false;
      if (!t) return true;
      return x.name.toLowerCase().includes(t) || x.description.toLowerCase().includes(t);
    });
  }, [q, cat]);

  const toggleBookmark = async (id: string) => {
    if (!user) {
      toast.error("Sign in to save bookmarks");
      return;
    }
    const has = bookmarks.has(id);
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (has) next.delete(id);
      else next.add(id);
      return next;
    });
    if (has) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("tool_id", id);
      toast("Removed bookmark");
    } else {
      const { error } = await supabase.from("bookmarks").insert({ user_id: user.id, tool_id: id });
      if (error) toast.error("Couldn’t save bookmark");
      else toast.success("Bookmarked");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          AI Tools <span className="text-gradient">Directory</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{TOOLS.length} hand-picked tools across {CATEGORIES.length} categories.</p>
      </motion.div>

      <div className="glass-strong mt-6 flex items-center gap-2 rounded-2xl p-2">
        <Search className="ml-2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tools…"
          className="flex-1 bg-transparent px-2 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${cat === c ? "bg-primary text-primary-foreground shadow-glow" : "glass hover:bg-white/5"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t, i) => (
          <MotionGlassCard key={t.id} delay={Math.min(i, 10) * 0.02} className="glow-hover flex flex-col p-5">
            <div className="flex items-start gap-3">
              <ToolLogo tool={t} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold">{t.name}</p>
                  <button
                    onClick={() => toggleBookmark(t.id)}
                    aria-label="Bookmark"
                    className={`rounded-lg p-1 transition ${bookmarks.has(t.id) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarks.has(t.id) ? "fill-primary" : ""}`} />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">{t.category}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" /> {t.rating}
                </span>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">{t.pricing}</span>
              </div>
              <a
                href={t.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Visit <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </MotionGlassCard>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted-foreground">No tools match your search.</p>
      )}
    </div>
  );
}
