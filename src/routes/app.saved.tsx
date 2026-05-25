import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Folder, Bookmark, ImageIcon, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MotionGlassCard } from "@/components/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { TOOLS } from "@/data/tools";

export const Route = createFileRoute("/app/saved")({
  head: () => ({ meta: [{ title: "Saved Projects — Taara" }] }),
  component: SavedPage,
});

type SavedImage = { id: string; image_url: string; prompt: string };

function SavedPage() {
  const { user } = useAuth();
  const [images, setImages] = useState<SavedImage[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([
      supabase.from("saved_images").select("id, image_url, prompt").order("created_at", { ascending: false }).limit(24),
      supabase.from("bookmarks").select("tool_id"),
    ]).then(([imgs, bks]) => {
      if (imgs.data) setImages(imgs.data);
      if (bks.data) setBookmarks(bks.data.map((d) => d.tool_id));
      setLoading(false);
    });
  }, [user]);

  const removeImage = async (id: string) => {
    setImages((p) => p.filter((x) => x.id !== id));
    await supabase.from("saved_images").delete().eq("id", id);
    toast("Removed");
  };

  const removeBookmark = async (toolId: string) => {
    if (!user) return;
    setBookmarks((p) => p.filter((id) => id !== toolId));
    await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("tool_id", toolId);
    toast("Bookmark removed");
  };

  const bookmarkedTools = TOOLS.filter((t) => bookmarks.includes(t.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Saved <span className="text-gradient">Projects</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Your generated images and bookmarked tools.</p>
      </motion.div>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <ImageIcon className="h-5 w-5 text-primary" /> Generated images
        </h2>
        {loading ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass aspect-square animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <MotionGlassCard className="mt-4 flex flex-col items-center p-10 text-center text-muted-foreground">
            <Folder className="h-8 w-8 text-primary/60" />
            <p className="mt-3 text-sm">No saved images yet. Try the image generator.</p>
          </MotionGlassCard>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <MotionGlassCard key={img.id} delay={i * 0.03} className="group overflow-hidden p-0">
                <img src={img.image_url} alt={img.prompt} loading="lazy" className="aspect-square w-full object-cover" />
                <div className="flex items-start justify-between gap-2 p-4">
                  <p className="line-clamp-2 text-xs text-muted-foreground">{img.prompt}</p>
                  <button onClick={() => removeImage(img.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </MotionGlassCard>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <Bookmark className="h-5 w-5 text-primary" /> Bookmarked tools
        </h2>
        {bookmarkedTools.length === 0 ? (
          <MotionGlassCard className="mt-4 flex flex-col items-center p-10 text-center text-muted-foreground">
            <Bookmark className="h-8 w-8 text-primary/60" />
            <p className="mt-3 text-sm">No bookmarks yet. Explore the AI Tools directory.</p>
          </MotionGlassCard>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarkedTools.map((t, i) => (
              <MotionGlassCard key={t.id} delay={i * 0.02} className="flex items-center gap-3 p-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, oklch(0.55 0.18 ${t.hue}), oklch(0.40 0.20 ${(t.hue + 50) % 360}))` }}
                >
                  {t.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{t.category}</p>
                </div>
                <a href={t.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button onClick={() => removeBookmark(t.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </MotionGlassCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
