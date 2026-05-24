export type AIModel = {
  id: string;
  name: string;
  provider: string;
  gateway: string; // model id sent upstream
  source: "lovable" | "openrouter";
  badge: "Fast" | "Reasoning" | "Multimodal" | "Image" | "Pro";
  speed: 1 | 2 | 3 | 4 | 5;
  reasoning: 1 | 2 | 3 | 4 | 5;
  context?: string;
  use: string;
  tagline: string;
  accent: string;
};

export const MODELS: AIModel[] = [
  // Lovable AI (built-in, no key)
  { id: "gemini-flash", name: "Gemini 2.5 Flash", provider: "Google", gateway: "google/gemini-2.5-flash", source: "lovable", badge: "Fast", speed: 5, reasoning: 4, context: "1M", use: "Balanced reasoning & multimodal", tagline: "Fast smart default", accent: "from-emerald-400/30 to-cyan-400/20" },
  { id: "gemini-pro", name: "Gemini 2.5 Pro", provider: "Google", gateway: "google/gemini-2.5-pro", source: "lovable", badge: "Reasoning", speed: 3, reasoning: 5, context: "2M", use: "Deep reasoning, long context", tagline: "Top-tier visual + text", accent: "from-sky-400/30 to-indigo-400/20" },
  { id: "gpt5", name: "GPT-5", provider: "OpenAI", gateway: "openai/gpt-5", source: "lovable", badge: "Pro", speed: 3, reasoning: 5, context: "400K", use: "Hard problems, nuanced answers", tagline: "Powerful all-rounder", accent: "from-fuchsia-400/30 to-violet-400/20" },
  { id: "gpt5-mini", name: "GPT-5 Mini", provider: "OpenAI", gateway: "openai/gpt-5-mini", source: "lovable", badge: "Fast", speed: 4, reasoning: 4, context: "400K", use: "Strong & cost-efficient", tagline: "Sweet spot", accent: "from-amber-400/30 to-rose-400/20" },
  { id: "gpt5-nano", name: "GPT-5 Nano", provider: "OpenAI", gateway: "openai/gpt-5-nano", source: "lovable", badge: "Fast", speed: 5, reasoning: 2, context: "400K", use: "Volume, quick replies", tagline: "Blazing fast", accent: "from-teal-400/30 to-emerald-400/20" },
  { id: "gemini-flash-lite", name: "Gemini Flash Lite", provider: "Google", gateway: "google/gemini-2.5-flash-lite", source: "lovable", badge: "Fast", speed: 5, reasoning: 2, context: "1M", use: "Cheap, simple tasks", tagline: "Ultra lightweight", accent: "from-lime-400/30 to-emerald-400/20" },

  // OpenRouter
  { id: "claude-sonnet", name: "Claude Sonnet 4.5", provider: "Anthropic", gateway: "anthropic/claude-sonnet-4.5", source: "openrouter", badge: "Reasoning", speed: 4, reasoning: 5, context: "200K", use: "Writing, code, analysis", tagline: "Best for nuanced writing", accent: "from-orange-400/30 to-amber-400/20" },
  { id: "claude-opus", name: "Claude Opus 4", provider: "Anthropic", gateway: "anthropic/claude-opus-4", source: "openrouter", badge: "Pro", speed: 2, reasoning: 5, context: "200K", use: "Hardest tasks, agentic", tagline: "Anthropic flagship", accent: "from-orange-500/30 to-red-400/20" },
  { id: "grok-4", name: "Grok 4", provider: "xAI", gateway: "x-ai/grok-4", source: "openrouter", badge: "Reasoning", speed: 3, reasoning: 5, context: "256K", use: "Realtime knowledge, witty", tagline: "xAI flagship", accent: "from-slate-400/30 to-zinc-400/20" },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", gateway: "deepseek/deepseek-r1", source: "openrouter", badge: "Reasoning", speed: 3, reasoning: 5, context: "128K", use: "Math, code, reasoning", tagline: "Open reasoning beast", accent: "from-blue-400/30 to-cyan-400/20" },
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", gateway: "deepseek/deepseek-chat-v3", source: "openrouter", badge: "Fast", speed: 4, reasoning: 4, context: "128K", use: "General chat, code", tagline: "Best price/perf", accent: "from-blue-400/30 to-indigo-400/20" },
  { id: "llama-3-3", name: "Llama 3.3 70B", provider: "Meta", gateway: "meta-llama/llama-3.3-70b-instruct", source: "openrouter", badge: "Fast", speed: 4, reasoning: 4, context: "131K", use: "Open weights, general", tagline: "Meta open model", accent: "from-purple-400/30 to-fuchsia-400/20" },
  { id: "mistral-large", name: "Mistral Large", provider: "Mistral", gateway: "mistralai/mistral-large", source: "openrouter", badge: "Reasoning", speed: 3, reasoning: 4, context: "128K", use: "Multilingual, code", tagline: "European AI", accent: "from-rose-400/30 to-orange-400/20" },
  { id: "qwen-72b", name: "Qwen 2.5 72B", provider: "Alibaba", gateway: "qwen/qwen-2.5-72b-instruct", source: "openrouter", badge: "Reasoning", speed: 3, reasoning: 4, context: "128K", use: "Multilingual, math", tagline: "Alibaba open model", accent: "from-violet-400/30 to-purple-400/20" },
  { id: "perplexity-sonar", name: "Perplexity Sonar", provider: "Perplexity", gateway: "perplexity/sonar-pro", source: "openrouter", badge: "Multimodal", speed: 4, reasoning: 4, context: "200K", use: "Web-augmented answers", tagline: "Cites sources", accent: "from-cyan-400/30 to-sky-400/20" },
  { id: "command-r", name: "Command R+", provider: "Cohere", gateway: "cohere/command-r-plus", source: "openrouter", badge: "Reasoning", speed: 4, reasoning: 4, context: "128K", use: "RAG, long context", tagline: "Enterprise RAG", accent: "from-pink-400/30 to-rose-400/20" },
  { id: "mixtral", name: "Mixtral 8x22B", provider: "Mistral", gateway: "mistralai/mixtral-8x22b-instruct", source: "openrouter", badge: "Fast", speed: 4, reasoning: 3, context: "65K", use: "MoE, efficient", tagline: "Open MoE", accent: "from-rose-400/30 to-pink-400/20" },
  { id: "gemma-2", name: "Gemma 2 27B", provider: "Google", gateway: "google/gemma-2-27b-it", source: "openrouter", badge: "Fast", speed: 5, reasoning: 3, context: "8K", use: "Lightweight assistant", tagline: "Google open model", accent: "from-emerald-400/30 to-lime-400/20" },
];

export const DEFAULT_MODEL_ID = "gemini-flash";
