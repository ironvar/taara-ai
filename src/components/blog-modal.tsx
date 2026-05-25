import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Calendar, Tag, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/data/blog";

export function BlogModal({ post, onClose }: { post: BlogPost | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {post && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="glass-strong relative w-full max-w-2xl overflow-hidden rounded-3xl border border-glass-border shadow-glass"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-lg bg-background/40 p-1.5 text-foreground backdrop-blur hover:bg-background/70"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative aspect-[16/8] w-full overflow-hidden">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                <div
                  className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{ background: `linear-gradient(135deg, oklch(0.50 0.18 ${post.hue}), oklch(0.30 0.20 ${(post.hue + 60) % 360}))` }}
                />
              </div>
              <div className="p-7">
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span className="rounded-full bg-primary/15 px-2 py-1 text-primary"><Tag className="mr-1 inline h-3 w-3" />{post.category}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold leading-tight sm:text-3xl">{post.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <p className="mt-2 text-xs text-muted-foreground">By {post.author}</p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {[post.category, "AI", "2026"].map((t) => (
                      <span key={t} className="glass rounded-full px-2.5 py-1 text-[10px] text-muted-foreground">#{t}</span>
                    ))}
                  </div>
                  <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:brightness-110">
                    Read Full Article <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
