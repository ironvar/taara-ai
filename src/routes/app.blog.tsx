import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";
import { MotionGlassCard } from "@/components/glass-card";

export const Route = createFileRoute("/app/blog")({
  head: () => ({
    meta: [
      { title: "Taara Blog — AI Tools, Tutorials, News" },
      { name: "description", content: "AI tutorials, best AI tools for creators, YouTubers, Blender artists and more." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [q, setQ] = useState("");
  const cats = useMemo(() => Array.from(new Set(BLOG_POSTS.map((p) => p.category))), []);
  const [cat, setCat] = useState<string>("All");
  const filtered = BLOG_POSTS.filter((p) => {
    if (cat !== "All" && p.category !== cat) return false;
    const t = q.trim().toLowerCase();
    return !t || p.title.toLowerCase().includes(t) || p.excerpt.toLowerCase().includes(t);
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Taara <span className="text-gradient">Blog</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">AI tools, tutorials, comparisons and news.</p>
      </motion.div>

      <div className="glass-strong mt-6 flex items-center gap-2 rounded-2xl p-2">
        <Search className="ml-2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles…"
          className="flex-1 bg-transparent px-2 py-2 text-sm focus:outline-none"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {["All", ...cats].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${cat === c ? "bg-primary text-primary-foreground" : "glass hover:bg-white/5"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <MotionGlassCard key={p.slug} delay={i * 0.04} className="overflow-hidden p-0">
            <div
              className="aspect-[16/9] w-full"
              style={{ background: `linear-gradient(135deg, oklch(0.50 0.18 ${p.hue}), oklch(0.30 0.20 ${(p.hue + 60) % 360}))` }}
            />
            <div className="p-5">
              <p className="text-[11px] uppercase tracking-wider text-primary">{p.category}</p>
              <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug">{p.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readTime}</span>
                <span className="inline-flex items-center gap-1 text-primary hover:underline">
                  Read <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </MotionGlassCard>
        ))}
      </div>
    </div>
  );
}
