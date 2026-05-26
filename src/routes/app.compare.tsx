import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GitCompare, Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { MODELS } from "@/data/models";
import { MotionGlassCard } from "@/components/glass-card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/compare")({
  head: () => ({ meta: [{ title: "Compare Models — Taara" }] }),
  component: ComparePage,
});

function ComparePage() {
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<string[]>([MODELS[0].id, MODELS[1].id]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const runOne = async (modelId: string, userPrompt: string) => {
    const m = MODELS.find((x) => x.id === modelId)!;
    setBusy((b) => ({ ...b, [modelId]: true }));
    setResponses((r) => ({ ...r, [modelId]: "" }));
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: [{ role: "user", content: userPrompt }], model: m.gateway }),
      });
      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({}));
        toast.error(err.error || `${m.name} failed`);
        return;
      }
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { buf = ""; break; }
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) { acc += c; setResponses((r) => ({ ...r, [modelId]: acc })); }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } finally {
      setBusy((b) => ({ ...b, [modelId]: false }));
    }
  };

  const run = () => {
    const text = prompt.trim();
    if (!text || selected.length === 0) return;
    selected.forEach((id) => runOne(id, text));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Compare <span className="text-gradient">Models</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Send one prompt to multiple AIs. Up to 4 at once.</p>
      </motion.div>

      <MotionGlassCard className="mt-6 p-4">
        <div className="flex flex-wrap gap-1.5">
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => toggle(m.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${selected.includes(m.id) ? "bg-primary text-primary-foreground shadow-glow" : "glass hover:bg-white/5"}`}
            >
              {m.name}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-end gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask the same question to multiple models…"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-glass-border bg-surface/40 px-4 py-3 text-sm focus:border-primary/40 focus:outline-none"
          />
          <button
            onClick={run}
            disabled={!prompt.trim() || selected.length === 0}
            className="flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow hover:brightness-110 disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> Run
          </button>
        </div>
      </MotionGlassCard>

      <div className={`mt-6 grid gap-4 ${selected.length >= 3 ? "lg:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-2"}`}>
        {selected.map((id, i) => {
          const m = MODELS.find((x) => x.id === id)!;
          const r = responses[id];
          const isBusy = busy[id];
          return (
            <MotionGlassCard key={id} delay={i * 0.04} className="flex min-h-[20rem] flex-col p-5">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">{m.name}</p>
                {isBusy && <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-muted-foreground" />}
              </div>
              <div className="mt-3 flex-1 overflow-y-auto text-sm">
                {!r && !isBusy && <p className="text-muted-foreground">Waiting for prompt…</p>}
                <div className="prose prose-sm prose-invert max-w-none prose-code:text-primary">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{r || ""}</ReactMarkdown>
                </div>
              </div>
            </MotionGlassCard>
          );
        })}
      </div>
    </div>
  );
}
