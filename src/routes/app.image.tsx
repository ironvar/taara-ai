import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Download, Loader2, ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { generateImage } from "@/lib/image.functions";
import { MotionGlassCard } from "@/components/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { LimitReachedModal } from "@/components/limit-reached-modal";
import { PLAN_LIMITS, type Plan } from "@/hooks/use-usage";


export const Route = createFileRoute("/app/image")({
  head: () => ({ meta: [{ title: "Image Generator — Taara" }] }),
  component: ImagePage,
});

const STYLES = ["Photorealistic", "Cinematic", "Anime", "3D render", "Watercolor", "Cyberpunk", "Minimal"];
const ASPECTS = ["1:1", "16:9", "9:16", "4:3", "3:4"] as const;

type Item = { id?: string; url: string; prompt: string };

function ImagePage() {
  const gen = useServerFn(generateImage);
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<string>("Cinematic");
  const [aspect, setAspect] = useState<typeof ASPECTS[number]>("1:1");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [limitInfo, setLimitInfo] = useState<{ plan: Plan; limit?: number } | null>(null);


  // Load saved images
  useEffect(() => {
    if (!user) { setLoadingGallery(false); return; }
    supabase
      .from("saved_images")
      .select("id, image_url, prompt")
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data, error }) => {
        if (!error && data) {
          setItems(data.map((d) => ({ id: d.id, url: d.image_url, prompt: d.prompt })));
        }
        setLoadingGallery(false);
      });
  }, [user]);

  const run = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      const res = await gen({ data: { prompt: prompt.trim(), style, aspect } });
      const newItem: Item = { url: res.url, prompt: res.prompt };

      // Persist
      if (user) {
        const { data, error } = await supabase
          .from("saved_images")
          .insert({ user_id: user.id, image_url: res.url, prompt: res.prompt, model: "gemini-image" })
          .select("id")
          .single();
        if (!error && data) newItem.id = data.id;
      }

      setItems((p) => [newItem, ...p]);
      toast.success("Image generated & saved");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed";
      const m = msg.match(/LIMIT_REACHED:image:(\w+):(\d+)/);
      if (m) {
        const plan = m[1] as Plan;
        setLimitInfo({ plan, limit: PLAN_LIMITS[plan].image });
      } else {
        toast.error(msg);
      }
    } finally {

      setLoading(false);
    }
  };

  const remove = async (it: Item, idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
    if (it.id) {
      await supabase.from("saved_images").delete().eq("id", it.id);
      toast("Removed from gallery");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          AI Image <span className="text-gradient">Generator</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Describe anything. Generations auto-save to your gallery.</p>
      </motion.div>

      <MotionGlassCard className="mt-8 p-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A futuristic neon city at dusk, reflective wet streets, drone shot…"
          rows={3}
          className="w-full resize-none rounded-xl border border-glass-border bg-surface/40 px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary/40 focus:outline-none"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Style</p>
            <div className="flex flex-wrap gap-1.5">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`rounded-full px-3 py-1 text-xs transition ${style === s ? "bg-primary text-primary-foreground" : "glass hover:bg-white/5"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Aspect ratio</p>
            <div className="flex flex-wrap gap-1.5">
              {ASPECTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAspect(a)}
                  className={`rounded-full px-3 py-1 text-xs transition ${aspect === a ? "bg-primary text-primary-foreground" : "glass hover:bg-white/5"}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={run}
          disabled={loading || !prompt.trim()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          Generate
        </button>
      </MotionGlassCard>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">Your gallery</h2>
        {loadingGallery ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass aspect-square animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <MotionGlassCard className="mt-4 flex flex-col items-center justify-center p-16 text-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-40" />
            <p className="mt-3 text-sm">Generated images will appear here.</p>
          </MotionGlassCard>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <MotionGlassCard key={it.id ?? i} delay={Math.min(i, 6) * 0.03} className="group overflow-hidden p-0">
                <img src={it.url} alt={it.prompt} loading="lazy" className="aspect-square w-full object-cover transition group-hover:scale-[1.02]" />
                <div className="p-4">
                  <p className="line-clamp-2 text-xs text-muted-foreground">{it.prompt}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <a
                      href={it.url}
                      download={`taara-${i}.png`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                    <button
                      onClick={() => remove(it, i)}
                      className="text-xs text-muted-foreground transition hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </MotionGlassCard>
            ))}
          </div>
        )}
      </div>
      <LimitReachedModal
        open={!!limitInfo}
        onClose={() => setLimitInfo(null)}
        kind="image"
        plan={limitInfo?.plan ?? "free"}
        limit={limitInfo?.limit}
      />
    </div>
  );
}

