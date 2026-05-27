import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, Loader2, ChevronDown, Plus, Trash2, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { MODELS, DEFAULT_MODEL_ID, type AIModel } from "@/data/models";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { LimitReachedModal } from "@/components/limit-reached-modal";
import type { Plan } from "@/hooks/use-usage";


export const Route = createFileRoute("/app/chat")({
  head: () => ({ meta: [{ title: "AI Chat — Taara" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };
type ChatRow = { id: string; title: string; model: string; updated_at: string };

function ChatPage() {
  const { user } = useAuth();
  const [model, setModel] = useState<AIModel>(MODELS.find((m) => m.id === DEFAULT_MODEL_ID)!);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [chats, setChats] = useState<ChatRow[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [limitInfo, setLimitInfo] = useState<{ plan: Plan; limit?: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Load chat list
  useEffect(() => {
    if (!user) return;
    supabase
      .from("chats")
      .select("id,title,model,updated_at")
      .order("updated_at", { ascending: false })
      .limit(50)
      .then(({ data }) => setChats((data as ChatRow[]) || []));
  }, [user]);

  const loadChat = async (id: string) => {
    setChatId(id);
    setShowList(false);
    const { data } = await supabase
      .from("messages")
      .select("role,content")
      .eq("chat_id", id)
      .order("created_at", { ascending: true });
    setMessages(((data || []) as Msg[]).filter((m) => m.role !== ("system" as Msg["role"])));
  };

  const newChat = () => {
    setChatId(null);
    setMessages([]);
    setShowList(false);
  };

  const deleteChat = async (id: string) => {
    await supabase.from("chats").delete().eq("id", id);
    setChats((c) => c.filter((x) => x.id !== id));
    if (chatId === id) newChat();
    toast.success("Chat deleted");
  };

  const ensureChat = async (firstMsg: string): Promise<string | null> => {
    if (!user) return null;
    if (chatId) return chatId;
    const title = firstMsg.slice(0, 60);
    const { data, error } = await supabase
      .from("chats")
      .insert({ user_id: user.id, title, model: model.gateway })
      .select("id,title,model,updated_at")
      .single();
    if (error || !data) return null;
    setChatId(data.id);
    setChats((c) => [data as ChatRow, ...c]);
    return data.id;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Persist user message
    const cid = await ensureChat(text);
    if (user && cid) {
      await supabase.from("messages").insert({
        chat_id: cid,
        user_id: user.id,
        role: "user",
        content: text,
      });
    }

    let acc = "";
    const upsert = (delta: string) => {
      acc += delta;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: acc } : m));
        }
        return [...prev, { role: "assistant", content: acc }];
      });
    };

    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: newMessages, model: model.gateway }),
      });
      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        if (resp.status === 429 && err.error === "limit_reached") {
          setLimitInfo({ plan: (err.plan ?? "free") as Plan, limit: err.limit });
          setMessages(messages); // revert optimistic add
        } else {
          toast.error(err.error || "Chat failed");
        }
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }

      // Persist assistant message
      if (user && cid && acc) {
        await supabase.from("messages").insert({
          chat_id: cid,
          user_id: user.id,
          role: "assistant",
          content: acc,
        });
        await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", cid);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* header */}
      <div className="glass-strong sticky top-0 z-30 flex items-center justify-between border-b border-glass-border px-4 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={() => setShowList((s) => !s)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              title="Chat history"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setPickerOpen((o) => !o)}
              className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium glow-hover"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              {model.name}
              <ChevronDown className={`h-3.5 w-3.5 transition ${pickerOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {pickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  className="glass-strong absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-[24rem] overflow-y-auto rounded-2xl p-2 shadow-glass"
                >
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setModel(m);
                        setPickerOpen(false);
                      }}
                      className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-white/5 ${model.id === m.id ? "bg-white/5" : ""}`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${m.accent} text-xs font-bold`}>
                        {m.provider.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold">{m.name}</p>
                          <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary">{m.badge}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{m.provider} · {m.tagline}</p>
                        <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                          <span>⚡ {m.speed}/5</span>
                          <span>🧠 {m.reasoning}/5</span>
                          {m.context && <span>📚 {m.context}</span>}
                          <span className="text-primary/70">{m.source === "lovable" ? "Built-in" : "OpenRouter"}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={newChat}
            className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            title="New chat"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* chat list drawer */}
      <AnimatePresence>
        {showList && user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass border-b border-glass-border overflow-hidden"
          >
            <div className="mx-auto max-w-3xl space-y-1 px-4 py-3 sm:px-8">
              {chats.length === 0 && <p className="py-2 text-xs text-muted-foreground">No saved chats yet.</p>}
              {chats.map((c) => (
                <div key={c.id} className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 ${chatId === c.id ? "bg-primary/10" : "hover:bg-white/5"}`}>
                  <button onClick={() => loadChat(c.id)} className="flex-1 truncate text-left text-sm">
                    {c.title}
                  </button>
                  <button
                    onClick={() => deleteChat(c.id)}
                    className="rounded p-1 text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold">How can I help today?</h2>
              <p className="mt-2 text-sm text-muted-foreground">Ask anything. {model.name} is ready.</p>
              <div className="mx-auto mt-6 grid max-w-lg gap-2 sm:grid-cols-2">
                {["Explain quantum computing", "Plan a 7-day Tokyo trip", "Write a landing page hero", "Compare React vs Svelte"].map((s) => (
                  <button key={s} onClick={() => setInput(s)} className="glass glow-hover rounded-xl p-3 text-left text-sm">
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-primary/30 to-primary-glow/10 text-primary"}`}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-primary/15 text-foreground" : "glass"}`}>
                <div className="prose prose-sm prose-invert max-w-none prose-pre:bg-surface-2 prose-pre:border prose-pre:border-glass-border prose-code:text-primary">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || "…"}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary-glow/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* input */}
      <div className="border-t border-glass-border bg-glass px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="glass-strong flex items-end gap-2 rounded-2xl p-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={`Message ${model.name}…`}
              rows={1}
              className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {user ? "Chats are saved to your account · " : "Sign in to save chats · "}
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
      <LimitReachedModal
        open={!!limitInfo}
        onClose={() => setLimitInfo(null)}
        kind="chat"
        plan={limitInfo?.plan ?? "free"}
        limit={limitInfo?.limit}
      />
    </div>
  );
}

