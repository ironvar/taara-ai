export type ToolCategory =
  | "Image AI"
  | "Video AI"
  | "Design AI"
  | "Coding AI"
  | "Productivity AI"
  | "Music AI"
  | "Animation AI"
  | "3D AI"
  | "Writing AI"
  | "Marketing AI";

export type AITool = {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  rating: number; // 1..5
  pricing: "Free" | "Freemium" | "Paid";
  url: string;
  initials: string;
  hue: number; // 0..360 for the avatar gradient
};

export const CATEGORIES: ToolCategory[] = [
  "Image AI",
  "Video AI",
  "Design AI",
  "Coding AI",
  "Productivity AI",
  "Music AI",
  "Animation AI",
  "3D AI",
  "Writing AI",
  "Marketing AI",
];

export const TOOLS: AITool[] = [
  { id: "midjourney", name: "Midjourney", description: "Photoreal & artistic image generation via Discord and web.", category: "Image AI", rating: 4.9, pricing: "Paid", url: "https://midjourney.com", initials: "MJ", hue: 260 },
  { id: "dalle", name: "DALL·E 3", description: "OpenAI’s flagship text-to-image model.", category: "Image AI", rating: 4.7, pricing: "Freemium", url: "https://openai.com/dall-e-3", initials: "DE", hue: 200 },
  { id: "leonardo", name: "Leonardo.Ai", description: "Production-grade AI image & asset generator for creators.", category: "Image AI", rating: 4.6, pricing: "Freemium", url: "https://leonardo.ai", initials: "LA", hue: 180 },
  { id: "ideogram", name: "Ideogram", description: "Best-in-class text rendering in generated images.", category: "Image AI", rating: 4.5, pricing: "Freemium", url: "https://ideogram.ai", initials: "ID", hue: 320 },
  { id: "flux", name: "Flux", description: "Open-weights diffusion model with stunning photorealism.", category: "Image AI", rating: 4.7, pricing: "Free", url: "https://blackforestlabs.ai", initials: "FX", hue: 30 },
  { id: "krea", name: "Krea", description: "Realtime AI generation and creative canvas.", category: "Image AI", rating: 4.6, pricing: "Freemium", url: "https://krea.ai", initials: "KR", hue: 290 },

  { id: "runway", name: "Runway", description: "Gen-3 text-to-video and AI editing suite.", category: "Video AI", rating: 4.8, pricing: "Freemium", url: "https://runwayml.com", initials: "RW", hue: 220 },
  { id: "pika", name: "Pika", description: "Idea-to-video AI with cinematic motion.", category: "Video AI", rating: 4.6, pricing: "Freemium", url: "https://pika.art", initials: "PK", hue: 340 },
  { id: "kling", name: "Kling", description: "Long-form, high-fidelity AI video generation.", category: "Video AI", rating: 4.7, pricing: "Freemium", url: "https://klingai.com", initials: "KL", hue: 210 },
  { id: "luma", name: "Luma Dream Machine", description: "Realistic and surreal video from text or image.", category: "Video AI", rating: 4.5, pricing: "Freemium", url: "https://lumalabs.ai", initials: "LM", hue: 250 },
  { id: "sora", name: "OpenAI Sora", description: "OpenAI’s flagship text-to-video model.", category: "Video AI", rating: 4.9, pricing: "Paid", url: "https://openai.com/sora", initials: "SR", hue: 190 },
  { id: "heygen", name: "HeyGen", description: "AI avatars and lip-synced video at scale.", category: "Video AI", rating: 4.5, pricing: "Freemium", url: "https://heygen.com", initials: "HG", hue: 160 },

  { id: "figma-ai", name: "Figma AI", description: "AI features baked into Figma design canvas.", category: "Design AI", rating: 4.6, pricing: "Freemium", url: "https://figma.com", initials: "FG", hue: 0 },
  { id: "framer-ai", name: "Framer AI", description: "Generate complete website layouts from a prompt.", category: "Design AI", rating: 4.5, pricing: "Freemium", url: "https://framer.com", initials: "FR", hue: 230 },
  { id: "uizard", name: "Uizard", description: "Turn sketches into editable UI mockups.", category: "Design AI", rating: 4.3, pricing: "Freemium", url: "https://uizard.io", initials: "UZ", hue: 300 },
  { id: "galileo", name: "Galileo AI", description: "Editable UI designs from natural language.", category: "Design AI", rating: 4.4, pricing: "Paid", url: "https://usegalileo.ai", initials: "GA", hue: 280 },
  { id: "magician", name: "Magician", description: "Magical AI plugin for Figma — icons, copy & illustrations.", category: "Design AI", rating: 4.2, pricing: "Paid", url: "https://magician.design", initials: "MG", hue: 320 },

  { id: "cursor", name: "Cursor", description: "AI-first code editor built for pair programming.", category: "Coding AI", rating: 4.9, pricing: "Freemium", url: "https://cursor.sh", initials: "CR", hue: 200 },
  { id: "copilot", name: "GitHub Copilot", description: "AI pair programmer inside your IDE.", category: "Coding AI", rating: 4.7, pricing: "Paid", url: "https://github.com/features/copilot", initials: "CP", hue: 240 },
  { id: "v0", name: "v0 by Vercel", description: "Generate UI components from natural language.", category: "Coding AI", rating: 4.6, pricing: "Freemium", url: "https://v0.dev", initials: "V0", hue: 0 },
  { id: "lovable", name: "Lovable", description: "Build full-stack apps by chatting with AI.", category: "Coding AI", rating: 4.9, pricing: "Freemium", url: "https://lovable.dev", initials: "LV", hue: 170 },
  { id: "codeium", name: "Codeium", description: "Free AI autocomplete and chat for 70+ languages.", category: "Coding AI", rating: 4.5, pricing: "Freemium", url: "https://codeium.com", initials: "CD", hue: 195 },
  { id: "tabnine", name: "Tabnine", description: "Private AI code completion for teams.", category: "Coding AI", rating: 4.3, pricing: "Freemium", url: "https://tabnine.com", initials: "TN", hue: 215 },

  { id: "notion-ai", name: "Notion AI", description: "Writing, summarizing & Q&A inside your workspace.", category: "Productivity AI", rating: 4.6, pricing: "Freemium", url: "https://notion.so", initials: "NT", hue: 0 },
  { id: "perplexity", name: "Perplexity", description: "Answer engine with live citations.", category: "Productivity AI", rating: 4.8, pricing: "Freemium", url: "https://perplexity.ai", initials: "PX", hue: 195 },
  { id: "mem", name: "Mem", description: "Self-organizing AI notes & memory.", category: "Productivity AI", rating: 4.3, pricing: "Freemium", url: "https://mem.ai", initials: "MM", hue: 270 },
  { id: "fireflies", name: "Fireflies", description: "AI meeting notes, transcription & summaries.", category: "Productivity AI", rating: 4.5, pricing: "Freemium", url: "https://fireflies.ai", initials: "FF", hue: 20 },
  { id: "reclaim", name: "Reclaim", description: "Smart AI calendar & scheduling.", category: "Productivity AI", rating: 4.4, pricing: "Freemium", url: "https://reclaim.ai", initials: "RC", hue: 140 },

  { id: "suno", name: "Suno", description: "Text-to-song AI with vocals and instrumentation.", category: "Music AI", rating: 4.8, pricing: "Freemium", url: "https://suno.com", initials: "SN", hue: 290 },
  { id: "udio", name: "Udio", description: "High-fidelity AI music generation.", category: "Music AI", rating: 4.7, pricing: "Freemium", url: "https://udio.com", initials: "UD", hue: 320 },
  { id: "elevenlabs-m", name: "ElevenLabs Music", description: "Studio-quality AI music & sound effects.", category: "Music AI", rating: 4.6, pricing: "Freemium", url: "https://elevenlabs.io", initials: "EL", hue: 0 },

  { id: "kaiber", name: "Kaiber", description: "Animate images & generate music videos.", category: "Animation AI", rating: 4.4, pricing: "Freemium", url: "https://kaiber.ai", initials: "KB", hue: 310 },
  { id: "animatediff", name: "AnimateDiff", description: "Open-source motion for diffusion models.", category: "Animation AI", rating: 4.3, pricing: "Free", url: "https://github.com/guoyww/AnimateDiff", initials: "AD", hue: 240 },
  { id: "viggle", name: "Viggle", description: "Animate characters with controllable motion.", category: "Animation AI", rating: 4.5, pricing: "Freemium", url: "https://viggle.ai", initials: "VG", hue: 30 },

  { id: "meshy", name: "Meshy", description: "Text & image to 3D models for games and AR.", category: "3D AI", rating: 4.6, pricing: "Freemium", url: "https://meshy.ai", initials: "ME", hue: 200 },
  { id: "luma3d", name: "Luma Genie", description: "3D models from text in seconds.", category: "3D AI", rating: 4.4, pricing: "Freemium", url: "https://lumalabs.ai/genie", initials: "LG", hue: 220 },
  { id: "rodin", name: "Rodin", description: "Generative 3D model creator.", category: "3D AI", rating: 4.2, pricing: "Freemium", url: "https://hyperhuman.deemos.com", initials: "RD", hue: 340 },
  { id: "csm", name: "CSM", description: "Common Sense Machines — generative 3D worlds.", category: "3D AI", rating: 4.3, pricing: "Freemium", url: "https://csm.ai", initials: "CS", hue: 180 },

  { id: "jasper", name: "Jasper", description: "Marketing copy & brand-aligned long-form writing.", category: "Writing AI", rating: 4.4, pricing: "Paid", url: "https://jasper.ai", initials: "JS", hue: 30 },
  { id: "copyai", name: "Copy.ai", description: "AI copywriter for ads, emails & sales.", category: "Writing AI", rating: 4.3, pricing: "Freemium", url: "https://copy.ai", initials: "CA", hue: 280 },
  { id: "rytr", name: "Rytr", description: "Affordable AI writing assistant.", category: "Writing AI", rating: 4.2, pricing: "Freemium", url: "https://rytr.me", initials: "RY", hue: 200 },
  { id: "writesonic", name: "Writesonic", description: "AI writer, paraphraser & SEO toolkit.", category: "Writing AI", rating: 4.3, pricing: "Freemium", url: "https://writesonic.com", initials: "WS", hue: 320 },
  { id: "lex", name: "Lex", description: "AI-augmented writing environment.", category: "Writing AI", rating: 4.5, pricing: "Freemium", url: "https://lex.page", initials: "LX", hue: 220 },

  { id: "hubspot-ai", name: "HubSpot AI", description: "AI features across HubSpot’s marketing suite.", category: "Marketing AI", rating: 4.4, pricing: "Freemium", url: "https://hubspot.com", initials: "HS", hue: 20 },
  { id: "adcreative", name: "AdCreative.ai", description: "Generate high-converting ad creatives.", category: "Marketing AI", rating: 4.3, pricing: "Paid", url: "https://adcreative.ai", initials: "AC", hue: 0 },
  { id: "surferseo", name: "Surfer SEO", description: "Optimize content to rank with AI guidance.", category: "Marketing AI", rating: 4.5, pricing: "Paid", url: "https://surferseo.com", initials: "SF", hue: 220 },
  { id: "neuronwriter", name: "NeuronWriter", description: "SERP-driven content optimization.", category: "Marketing AI", rating: 4.3, pricing: "Paid", url: "https://neuronwriter.com", initials: "NW", hue: 250 },
  { id: "mutiny", name: "Mutiny", description: "AI-personalized landing pages for B2B.", category: "Marketing AI", rating: 4.4, pricing: "Paid", url: "https://mutinyhq.com", initials: "MT", hue: 290 },
  { id: "icon8", name: "Icons8 AI", description: "AI-generated icons, illustrations & photos.", category: "Marketing AI", rating: 4.2, pricing: "Freemium", url: "https://icons8.com", initials: "I8", hue: 200 },
];
