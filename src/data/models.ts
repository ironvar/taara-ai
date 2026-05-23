export type AIModel = {
  id: string;
  name: string;
  provider: string;
  gateway: string; // openrouter-style id used with Lovable AI gateway
  badge: "Fast" | "Reasoning" | "Multimodal" | "Image" | "Pro";
  speed: 1 | 2 | 3 | 4 | 5;
  reasoning: 1 | 2 | 3 | 4 | 5;
  use: string;
  tagline: string;
  accent: string; // tailwind color tag class for chip
};

export const MODELS: AIModel[] = [
  {
    id: "gemini-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    gateway: "google/gemini-2.5-flash",
    badge: "Fast",
    speed: 5,
    reasoning: 4,
    use: "Balanced reasoning & multimodal",
    tagline: "Fast, smart default",
    accent: "from-emerald-400/30 to-cyan-400/20",
  },
  {
    id: "gemini-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    gateway: "google/gemini-2.5-pro",
    badge: "Reasoning",
    speed: 3,
    reasoning: 5,
    use: "Deep reasoning, long context",
    tagline: "Top-tier visual + text",
    accent: "from-sky-400/30 to-indigo-400/20",
  },
  {
    id: "gpt5",
    name: "GPT-5",
    provider: "OpenAI",
    gateway: "openai/gpt-5",
    badge: "Pro",
    speed: 3,
    reasoning: 5,
    use: "Nuanced answers, hard problems",
    tagline: "Powerful all-rounder",
    accent: "from-fuchsia-400/30 to-violet-400/20",
  },
  {
    id: "gpt5-mini",
    name: "GPT-5 Mini",
    provider: "OpenAI",
    gateway: "openai/gpt-5-mini",
    badge: "Fast",
    speed: 4,
    reasoning: 4,
    use: "Strong & cost-efficient",
    tagline: "Sweet spot",
    accent: "from-amber-400/30 to-rose-400/20",
  },
  {
    id: "gpt5-nano",
    name: "GPT-5 Nano",
    provider: "OpenAI",
    gateway: "openai/gpt-5-nano",
    badge: "Fast",
    speed: 5,
    reasoning: 2,
    use: "Volume, classification, quick replies",
    tagline: "Blazing fast",
    accent: "from-teal-400/30 to-emerald-400/20",
  },
  {
    id: "gemini-flash-lite",
    name: "Gemini Flash Lite",
    provider: "Google",
    gateway: "google/gemini-2.5-flash-lite",
    badge: "Fast",
    speed: 5,
    reasoning: 2,
    use: "Cheap, simple tasks",
    tagline: "Ultra lightweight",
    accent: "from-lime-400/30 to-emerald-400/20",
  },
];

export const DEFAULT_MODEL_ID = "gemini-flash";
