import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { messages?: ChatMessage[]; model?: string; source?: "lovable" | "openrouter" };
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const model = (body.model || "google/gemini-2.5-flash").toString();
        const source = body.source === "openrouter" ? "openrouter" : "lovable";
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
