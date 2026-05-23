import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  prompt: z.string().min(2).max(2000),
  style: z.string().max(80).optional(),
  aspect: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4"]).default("1:1"),
});

export const generateImage = createServerFn({ method: "POST" })
  .inputValidator((d) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const fullPrompt = `${data.prompt}${data.style ? `, ${data.style} style` : ""}, aspect ratio ${data.aspect}, ultra high detail, cinematic lighting`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: fullPrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Rate limited. Try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Top up to continue.");
      throw new Error(`Image generation failed: ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    const imageUrl: string | undefined =
      json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) throw new Error("No image returned");
    return { url: imageUrl, prompt: data.prompt };
  });
