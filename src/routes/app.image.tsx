import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Download, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { generateImage } from "@/lib/image.functions";
import { MotionGlassCard } from "@/components/glass-card";

export const Route = createFileRoute("/app/image")({
  head: () => ({ meta: [{ title: "Image Generator — Taara" }] }),
  component: ImagePage,
});

const STYLES = ["Photorealistic", "Cinematic", "Anime", "3D render", "Watercolor", "Cyberpunk", "Minimal"];
const ASPECTS = ["1:1", "16:9", "9:16", "4:3", "3:4"] as const;

type Item = { url: string; prompt: string };

function ImagePage() {
  const gen = useServerFn(generateImage);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<string>("Cinematic");
  const [aspect, setAspect] = useState<typeof ASPECTS[number]>("1:1");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  const run = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      const res = await gen({ data: { prompt: prompt.trim(), style, aspect } });
      setItems((p) => [{ url: res.url, prompt: res.prompt }, ...p]);
      toast.success("Image generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          AI Image <span className="text-gradient">Generator</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Describe anything. Get a beautiful image in seconds.</p>
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
        {items.length === 0 ? (
          <MotionGlassCard className="mt-4 flex flex-col items-center justify-center p-16 text-center text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-40" />
            <p className="mt-3 text-sm">Generated images will appear here.</p>
          </MotionGlassCard>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <MotionGlassCard key={i} delay={i * 0.03} className="overflow-hidden p-0">
                <img src={it.url} alt={it.prompt} className="aspect-square w-full object-cover" />
                <div className="p-4">
                  <p className="line-clamp-2 text-xs text-muted-foreground">{it.prompt}</p>
                  <a
                    href={it.url}
                    download={`taara-${i}.png`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                </div>
              </MotionGlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
