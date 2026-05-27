import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { MODELS } from "@/data/models";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const MODEL_MAP = new Map(MODELS.map((m) => [m.gateway, m.source]));
const DEFAULT_MODEL = "google/gemini-2.5-flash";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // --- Auth check ---
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return json({ error: "Unauthorized" }, 401);
        }
        const token = authHeader.slice("Bearer ".length);
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return json({ error: "Server misconfigured" }, 500);
        }
        const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: claims, error: claimsErr } = await sb.auth.getClaims(token);
        if (claimsErr || !claims?.claims?.sub) {
          return json({ error: "Unauthorized" }, 401);
        }

        // Per-user authenticated client for RLS-scoped RPC
        const userSb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: { headers: { Authorization: `Bearer ${token}` } },
        });
        const { data: usage, error: usageErr } = await userSb.rpc(
          "check_and_increment_usage",
          { _kind: "chat" }
        );
        if (usageErr) return json({ error: "Usage check failed" }, 500);
        const u = usage as { allowed: boolean; error?: string; limit?: number; plan?: string; remaining?: number };
        if (!u?.allowed) {
          return json({
            error: "limit_reached",
            kind: "chat",
            plan: u?.plan ?? "free",
            limit: u?.limit,
          }, 429);
        }


        let body: { messages?: ChatMessage[]; model?: string };
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const requestedModel = (body.model || DEFAULT_MODEL).toString();
        // Validate model against allowlist; derive source from the allowlist (not client).
        const source = MODEL_MAP.get(requestedModel);
        if (!source) return json({ error: "Invalid model" }, 400);
        const model = requestedModel;

        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) return json({ error: "No messages" }, 400);

        const isOR = source === "openrouter";
        const apiKey = isOR ? process.env.OPENROUTER_API_KEY : process.env.LOVABLE_API_KEY;
        const url = isOR
          ? "https://openrouter.ai/api/v1/chat/completions"
          : "https://ai.gateway.lovable.dev/v1/chat/completions";

        if (!apiKey) {
          return json({ error: `${isOR ? "OPENROUTER_API_KEY" : "LOVABLE_API_KEY"} is not configured` }, 500);
        }

        const headers: Record<string, string> = {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        };
        if (isOR) {
          headers["HTTP-Referer"] = "https://taara.lovable.app";
          headers["X-Title"] = "Taara";
        }

        const upstream = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model,
            stream: true,
            messages: [
              {
                role: "system",
                content:
                  "You are Taara, a futuristic, friendly AI assistant. Respond clearly in concise markdown. Use code blocks for code. Be helpful and direct.",
              },
              ...messages,
            ],
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          if (upstream.status === 429) return json({ error: "Rate limit reached. Try again in a moment." }, 429);
          if (upstream.status === 402) return json({ error: "AI credits exhausted. Top up to continue." }, 402);
          return json({ error: "AI gateway error", detail: text.slice(0, 300) }, 500);
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
