import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { MotionGlassCard } from "@/components/glass-card";

export const Route = createFileRoute("/app/prompts")({
  head: () => ({ meta: [{ title: "Prompt Library — Taara" }] }),
  component: PromptsPage,
});

const PROMPTS = [
  { cat: "Writing", title: "Blog post outline", text: "Create a detailed blog post outline about [TOPIC] for a [AUDIENCE]. Include hook, key points, and CTA." },
  { cat: "Code", title: "Code review", text: "Review this code for bugs, performance issues and readability:\n\n[PASTE CODE]" },
  { cat: "Marketing", title: "Cold email", text: "Write a 3-line cold email to [PERSONA] selling [PRODUCT]. Casual, no fluff, 1 CTA." },
  { cat: "Image", title: "Cinematic portrait", text: "A cinematic close-up portrait of [SUBJECT], soft rim lighting, shallow depth of field, shot on 85mm." },
  { cat: "Research", title: "Compare options", text: "Compare [A] vs [B] across price, features, learning curve, and best use cases. Use a markdown table." },
  { cat: "Learning", title: "Explain like I'm 5", text: "Explain [CONCEPT] like I'm 5, then like I'm a senior engineer. Use analogies." },
];

function PromptsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Prompt <span className="text-gradient">Library</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Battle-tested prompts to copy & customize.</p>
      </motion.div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROMPTS.map((p, i) => (
          <MotionGlassCard key={p.title} delay={i * 0.04} className="flex flex-col p-5">
            <p className="text-[11px] uppercase tracking-wider text-primary">{p.cat}</p>
            <h3 className="mt-1.5 font-semibold">{p.title}</h3>
            <pre className="mt-3 flex-1 whitespace-pre-wrap rounded-xl bg-surface/40 p-3 text-xs text-muted-foreground">{p.text}</pre>
            <button
              onClick={() => { navigator.clipboard.writeText(p.text); toast.success("Copied"); }}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/15 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/25"
            >
              <Copy className="h-3.5 w-3.5" /> Copy prompt
            </button>
          </MotionGlassCard>
        ))}
      </div>
    </div>
  );
}
