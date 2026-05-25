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
  | "Marketing AI"
  | "Voice AI"
  | "Automation AI"
  | "Research AI"
  | "Education AI"
  | "Finance AI"
  | "Resume AI"
  | "Website Builders"
  | "AI Agents"
  | "Presentations AI"
  | "Translation AI"
  | "Data AI"
  | "Fashion AI"
  | "Interior AI"
  | "Health AI"
  | "Business AI";

export type AITool = {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  rating: number;
  pricing: "Free" | "Freemium" | "Paid";
  url: string;
  initials: string;
  hue: number;
};

export const CATEGORIES: ToolCategory[] = [
  "Image AI",
  "Video AI",
  "Design AI",
  "Coding AI",
  "Productivity AI",
  "Music AI",
  "Voice AI",
  "Animation AI",
  "3D AI",
  "Writing AI",
  "Marketing AI",
  "Automation AI",
  "AI Agents",
  "Research AI",
  "Education AI",
  "Finance AI",
  "Business AI",
  "Resume AI",
  "Website Builders",
  "Presentations AI",
  "Translation AI",
  "Data AI",
  "Fashion AI",
  "Interior AI",
  "Health AI",
];

/** Try to fetch a real brand logo (Clearbit). Falls back to initials tile on error. */
export function toolLogoUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return `https://logo.clearbit.com/${host}`;
  } catch {
    return null;
  }
}

export const TOOLS: AITool[] = [
  // ---- Image AI ----
  { id: "midjourney", name: "Midjourney", description: "Photoreal & artistic image generation via Discord and web.", category: "Image AI", rating: 4.9, pricing: "Paid", url: "https://midjourney.com", initials: "MJ", hue: 260 },
  { id: "dalle", name: "DALL·E 3", description: "OpenAI’s flagship text-to-image model.", category: "Image AI", rating: 4.7, pricing: "Freemium", url: "https://openai.com/dall-e-3", initials: "DE", hue: 200 },
  { id: "leonardo", name: "Leonardo.Ai", description: "Production-grade AI image & asset generator for creators.", category: "Image AI", rating: 4.6, pricing: "Freemium", url: "https://leonardo.ai", initials: "LA", hue: 180 },
  { id: "ideogram", name: "Ideogram", description: "Best-in-class text rendering in generated images.", category: "Image AI", rating: 4.5, pricing: "Freemium", url: "https://ideogram.ai", initials: "ID", hue: 320 },
  { id: "flux", name: "Flux", description: "Open-weights diffusion model with stunning photorealism.", category: "Image AI", rating: 4.7, pricing: "Free", url: "https://blackforestlabs.ai", initials: "FX", hue: 30 },
  { id: "krea", name: "Krea", description: "Realtime AI generation and creative canvas.", category: "Image AI", rating: 4.6, pricing: "Freemium", url: "https://krea.ai", initials: "KR", hue: 290 },
  { id: "firefly", name: "Adobe Firefly", description: "Commercially safe generative images and effects.", category: "Image AI", rating: 4.5, pricing: "Freemium", url: "https://firefly.adobe.com", initials: "AF", hue: 0 },
  { id: "stability", name: "Stability AI", description: "Stable Diffusion XL & SD3 for high-quality imagery.", category: "Image AI", rating: 4.6, pricing: "Freemium", url: "https://stability.ai", initials: "SD", hue: 270 },
  { id: "replicate", name: "Replicate", description: "Run thousands of open-source AI models in the cloud.", category: "Image AI", rating: 4.7, pricing: "Freemium", url: "https://replicate.com", initials: "RP", hue: 220 },
  { id: "huggingface", name: "Hugging Face", description: "Hub for open-source models, datasets and spaces.", category: "Image AI", rating: 4.8, pricing: "Freemium", url: "https://huggingface.co", initials: "HF", hue: 40 },

  // ---- Video AI ----
  { id: "runway", name: "Runway", description: "Gen-3 text-to-video and AI editing suite.", category: "Video AI", rating: 4.8, pricing: "Freemium", url: "https://runwayml.com", initials: "RW", hue: 220 },
  { id: "pika", name: "Pika", description: "Idea-to-video AI with cinematic motion.", category: "Video AI", rating: 4.6, pricing: "Freemium", url: "https://pika.art", initials: "PK", hue: 340 },
  { id: "kling", name: "Kling", description: "Long-form, high-fidelity AI video generation.", category: "Video AI", rating: 4.7, pricing: "Freemium", url: "https://klingai.com", initials: "KL", hue: 210 },
  { id: "luma", name: "Luma Dream Machine", description: "Realistic and surreal video from text or image.", category: "Video AI", rating: 4.5, pricing: "Freemium", url: "https://lumalabs.ai", initials: "LM", hue: 250 },
  { id: "sora", name: "OpenAI Sora", description: "OpenAI’s flagship text-to-video model.", category: "Video AI", rating: 4.9, pricing: "Paid", url: "https://openai.com/sora", initials: "SR", hue: 190 },
  { id: "heygen", name: "HeyGen", description: "AI avatars and lip-synced video at scale.", category: "Video AI", rating: 4.5, pricing: "Freemium", url: "https://heygen.com", initials: "HG", hue: 160 },
  { id: "synthesia", name: "Synthesia", description: "Studio-quality AI avatar videos for teams.", category: "Video AI", rating: 4.6, pricing: "Paid", url: "https://synthesia.io", initials: "SY", hue: 240 },
  { id: "descript", name: "Descript", description: "Edit videos and podcasts by editing text.", category: "Video AI", rating: 4.6, pricing: "Freemium", url: "https://descript.com", initials: "DS", hue: 290 },

  // ---- Design AI ----
  { id: "figma-ai", name: "Figma AI", description: "AI features baked into Figma design canvas.", category: "Design AI", rating: 4.6, pricing: "Freemium", url: "https://figma.com", initials: "FG", hue: 0 },
  { id: "framer-ai", name: "Framer AI", description: "Generate complete website layouts from a prompt.", category: "Design AI", rating: 4.5, pricing: "Freemium", url: "https://framer.com", initials: "FR", hue: 230 },
  { id: "uizard", name: "Uizard", description: "Turn sketches into editable UI mockups.", category: "Design AI", rating: 4.3, pricing: "Freemium", url: "https://uizard.io", initials: "UZ", hue: 300 },
  { id: "galileo", name: "Galileo AI", description: "Editable UI designs from natural language.", category: "Design AI", rating: 4.4, pricing: "Paid", url: "https://usegalileo.ai", initials: "GA", hue: 280 },
  { id: "magician", name: "Magician", description: "Magical AI plugin for Figma — icons, copy & illustrations.", category: "Design AI", rating: 4.2, pricing: "Paid", url: "https://magician.design", initials: "MG", hue: 320 },
  { id: "canva-ai", name: "Canva Magic", description: "Magic Studio AI tools inside Canva.", category: "Design AI", rating: 4.7, pricing: "Freemium", url: "https://canva.com", initials: "CV", hue: 200 },

  // ---- Coding AI ----
  { id: "cursor", name: "Cursor", description: "AI-first code editor built for pair programming.", category: "Coding AI", rating: 4.9, pricing: "Freemium", url: "https://cursor.sh", initials: "CR", hue: 200 },
  { id: "copilot", name: "GitHub Copilot", description: "AI pair programmer inside your IDE.", category: "Coding AI", rating: 4.7, pricing: "Paid", url: "https://github.com/features/copilot", initials: "CP", hue: 240 },
  { id: "v0", name: "v0 by Vercel", description: "Generate UI components from natural language.", category: "Coding AI", rating: 4.6, pricing: "Freemium", url: "https://v0.dev", initials: "V0", hue: 0 },
  { id: "lovable", name: "Lovable", description: "Build full-stack apps by chatting with AI.", category: "Coding AI", rating: 4.9, pricing: "Freemium", url: "https://lovable.dev", initials: "LV", hue: 170 },
  { id: "codeium", name: "Codeium", description: "Free AI autocomplete and chat for 70+ languages.", category: "Coding AI", rating: 4.5, pricing: "Freemium", url: "https://codeium.com", initials: "CD", hue: 195 },
  { id: "tabnine", name: "Tabnine", description: "Private AI code completion for teams.", category: "Coding AI", rating: 4.3, pricing: "Freemium", url: "https://tabnine.com", initials: "TN", hue: 215 },
  { id: "bolt", name: "Bolt.new", description: "Full-stack app prototyping in the browser.", category: "Coding AI", rating: 4.6, pricing: "Freemium", url: "https://bolt.new", initials: "BL", hue: 260 },

  // ---- Productivity AI ----
  { id: "notion-ai", name: "Notion AI", description: "Writing, summarizing & Q&A inside your workspace.", category: "Productivity AI", rating: 4.6, pricing: "Freemium", url: "https://notion.so", initials: "NT", hue: 0 },
  { id: "perplexity", name: "Perplexity", description: "Answer engine with live citations.", category: "Productivity AI", rating: 4.8, pricing: "Freemium", url: "https://perplexity.ai", initials: "PX", hue: 195 },
  { id: "mem", name: "Mem", description: "Self-organizing AI notes & memory.", category: "Productivity AI", rating: 4.3, pricing: "Freemium", url: "https://mem.ai", initials: "MM", hue: 270 },
  { id: "fireflies", name: "Fireflies", description: "AI meeting notes, transcription & summaries.", category: "Productivity AI", rating: 4.5, pricing: "Freemium", url: "https://fireflies.ai", initials: "FF", hue: 20 },
  { id: "reclaim", name: "Reclaim", description: "Smart AI calendar & scheduling.", category: "Productivity AI", rating: 4.4, pricing: "Freemium", url: "https://reclaim.ai", initials: "RC", hue: 140 },
  { id: "motion", name: "Motion", description: "AI calendar that auto-plans your day.", category: "Productivity AI", rating: 4.4, pricing: "Paid", url: "https://usemotion.com", initials: "MO", hue: 210 },
  { id: "raycast-ai", name: "Raycast AI", description: "AI commands at your fingertips on macOS.", category: "Productivity AI", rating: 4.7, pricing: "Freemium", url: "https://raycast.com", initials: "RX", hue: 350 },

  // ---- Music AI ----
  { id: "suno", name: "Suno", description: "Text-to-song AI with vocals and instrumentation.", category: "Music AI", rating: 4.8, pricing: "Freemium", url: "https://suno.com", initials: "SN", hue: 290 },
  { id: "udio", name: "Udio", description: "High-fidelity AI music generation.", category: "Music AI", rating: 4.7, pricing: "Freemium", url: "https://udio.com", initials: "UD", hue: 320 },
  { id: "elevenlabs-m", name: "ElevenLabs Music", description: "Studio-quality AI music & sound effects.", category: "Music AI", rating: 4.6, pricing: "Freemium", url: "https://elevenlabs.io", initials: "EL", hue: 0 },

  // ---- Voice AI ----
  { id: "elevenlabs", name: "ElevenLabs", description: "Ultra-realistic AI voices and cloning.", category: "Voice AI", rating: 4.9, pricing: "Freemium", url: "https://elevenlabs.io", initials: "11", hue: 0 },
  { id: "playht", name: "Play.ht", description: "AI voice generator with 800+ voices.", category: "Voice AI", rating: 4.5, pricing: "Freemium", url: "https://play.ht", initials: "PH", hue: 200 },
  { id: "murf", name: "Murf", description: "Studio-quality AI voiceovers in 20+ languages.", category: "Voice AI", rating: 4.5, pricing: "Freemium", url: "https://murf.ai", initials: "MU", hue: 320 },
  { id: "resemble", name: "Resemble AI", description: "Custom AI voice cloning for products.", category: "Voice AI", rating: 4.4, pricing: "Paid", url: "https://resemble.ai", initials: "RS", hue: 260 },
  { id: "wellsaid", name: "WellSaid Labs", description: "Enterprise-grade AI voiceover platform.", category: "Voice AI", rating: 4.4, pricing: "Paid", url: "https://wellsaidlabs.com", initials: "WS", hue: 220 },

  // ---- Animation AI ----
  { id: "kaiber", name: "Kaiber", description: "Animate images & generate music videos.", category: "Animation AI", rating: 4.4, pricing: "Freemium", url: "https://kaiber.ai", initials: "KB", hue: 310 },
  { id: "animatediff", name: "AnimateDiff", description: "Open-source motion for diffusion models.", category: "Animation AI", rating: 4.3, pricing: "Free", url: "https://github.com/guoyww/AnimateDiff", initials: "AD", hue: 240 },
  { id: "viggle", name: "Viggle", description: "Animate characters with controllable motion.", category: "Animation AI", rating: 4.5, pricing: "Freemium", url: "https://viggle.ai", initials: "VG", hue: 30 },

  // ---- 3D AI ----
  { id: "meshy", name: "Meshy", description: "Text & image to 3D models for games and AR.", category: "3D AI", rating: 4.6, pricing: "Freemium", url: "https://meshy.ai", initials: "ME", hue: 200 },
  { id: "luma3d", name: "Luma Genie", description: "3D models from text in seconds.", category: "3D AI", rating: 4.4, pricing: "Freemium", url: "https://lumalabs.ai/genie", initials: "LG", hue: 220 },
  { id: "rodin", name: "Rodin", description: "Generative 3D model creator.", category: "3D AI", rating: 4.2, pricing: "Freemium", url: "https://hyperhuman.deemos.com", initials: "RD", hue: 340 },
  { id: "csm", name: "CSM", description: "Common Sense Machines — generative 3D worlds.", category: "3D AI", rating: 4.3, pricing: "Freemium", url: "https://csm.ai", initials: "CS", hue: 180 },

  // ---- Writing AI ----
  { id: "jasper", name: "Jasper", description: "Marketing copy & brand-aligned long-form writing.", category: "Writing AI", rating: 4.4, pricing: "Paid", url: "https://jasper.ai", initials: "JS", hue: 30 },
  { id: "copyai", name: "Copy.ai", description: "AI copywriter for ads, emails & sales.", category: "Writing AI", rating: 4.3, pricing: "Freemium", url: "https://copy.ai", initials: "CA", hue: 280 },
  { id: "rytr", name: "Rytr", description: "Affordable AI writing assistant.", category: "Writing AI", rating: 4.2, pricing: "Freemium", url: "https://rytr.me", initials: "RY", hue: 200 },
  { id: "writesonic", name: "Writesonic", description: "AI writer, paraphraser & SEO toolkit.", category: "Writing AI", rating: 4.3, pricing: "Freemium", url: "https://writesonic.com", initials: "WS", hue: 320 },
  { id: "lex", name: "Lex", description: "AI-augmented writing environment.", category: "Writing AI", rating: 4.5, pricing: "Freemium", url: "https://lex.page", initials: "LX", hue: 220 },
  { id: "grammarly", name: "Grammarly AI", description: "AI writing assistance everywhere you type.", category: "Writing AI", rating: 4.7, pricing: "Freemium", url: "https://grammarly.com", initials: "GR", hue: 140 },

  // ---- Marketing AI ----
  { id: "hubspot-ai", name: "HubSpot AI", description: "AI features across HubSpot’s marketing suite.", category: "Marketing AI", rating: 4.4, pricing: "Freemium", url: "https://hubspot.com", initials: "HS", hue: 20 },
  { id: "adcreative", name: "AdCreative.ai", description: "Generate high-converting ad creatives.", category: "Marketing AI", rating: 4.3, pricing: "Paid", url: "https://adcreative.ai", initials: "AC", hue: 0 },
  { id: "surferseo", name: "Surfer SEO", description: "Optimize content to rank with AI guidance.", category: "Marketing AI", rating: 4.5, pricing: "Paid", url: "https://surferseo.com", initials: "SF", hue: 220 },
  { id: "neuronwriter", name: "NeuronWriter", description: "SERP-driven content optimization.", category: "Marketing AI", rating: 4.3, pricing: "Paid", url: "https://neuronwriter.com", initials: "NW", hue: 250 },
  { id: "mutiny", name: "Mutiny", description: "AI-personalized landing pages for B2B.", category: "Marketing AI", rating: 4.4, pricing: "Paid", url: "https://mutinyhq.com", initials: "MT", hue: 290 },
  { id: "icon8", name: "Icons8 AI", description: "AI-generated icons, illustrations & photos.", category: "Marketing AI", rating: 4.2, pricing: "Freemium", url: "https://icons8.com", initials: "I8", hue: 200 },

  // ---- Automation AI ----
  { id: "zapier", name: "Zapier AI", description: "AI-powered automations across 6000+ apps.", category: "Automation AI", rating: 4.7, pricing: "Freemium", url: "https://zapier.com", initials: "ZP", hue: 30 },
  { id: "make", name: "Make", description: "Visual automation platform with AI modules.", category: "Automation AI", rating: 4.5, pricing: "Freemium", url: "https://make.com", initials: "MK", hue: 280 },
  { id: "n8n", name: "n8n", description: "Open-source workflow automation with AI nodes.", category: "Automation AI", rating: 4.7, pricing: "Freemium", url: "https://n8n.io", initials: "N8", hue: 0 },
  { id: "relevanceai", name: "Relevance AI", description: "Build no-code AI agents & workflows.", category: "Automation AI", rating: 4.5, pricing: "Freemium", url: "https://relevanceai.com", initials: "RV", hue: 200 },

  // ---- AI Agents ----
  { id: "autogpt", name: "AutoGPT", description: "Autonomous AI agent for complex multi-step tasks.", category: "AI Agents", rating: 4.3, pricing: "Free", url: "https://agpt.co", initials: "AG", hue: 240 },
  { id: "crewai", name: "CrewAI", description: "Orchestrate teams of role-playing AI agents.", category: "AI Agents", rating: 4.5, pricing: "Freemium", url: "https://crewai.com", initials: "CW", hue: 180 },
  { id: "agentgpt", name: "AgentGPT", description: "Browser-based autonomous AI agents.", category: "AI Agents", rating: 4.2, pricing: "Freemium", url: "https://agentgpt.reworkd.ai", initials: "AT", hue: 320 },
  { id: "lindy", name: "Lindy", description: "Build personal AI assistants without code.", category: "AI Agents", rating: 4.4, pricing: "Freemium", url: "https://lindy.ai", initials: "LD", hue: 160 },

  // ---- Research AI ----
  { id: "elicit", name: "Elicit", description: "Find & summarize research papers with AI.", category: "Research AI", rating: 4.6, pricing: "Freemium", url: "https://elicit.com", initials: "EC", hue: 195 },
  { id: "consensus", name: "Consensus", description: "AI-powered search across scientific papers.", category: "Research AI", rating: 4.5, pricing: "Freemium", url: "https://consensus.app", initials: "CN", hue: 220 },
  { id: "scite", name: "Scite", description: "Smart citations and research insights.", category: "Research AI", rating: 4.3, pricing: "Paid", url: "https://scite.ai", initials: "SC", hue: 260 },
  { id: "scholarcy", name: "Scholarcy", description: "Auto-summarize research articles.", category: "Research AI", rating: 4.2, pricing: "Freemium", url: "https://scholarcy.com", initials: "SH", hue: 30 },

  // ---- Education AI ----
  { id: "khanmigo", name: "Khanmigo", description: "Khan Academy’s AI tutor for students.", category: "Education AI", rating: 4.6, pricing: "Freemium", url: "https://khanmigo.ai", initials: "KM", hue: 140 },
  { id: "quizlet", name: "Quizlet AI", description: "AI flashcards, practice tests & explanations.", category: "Education AI", rating: 4.5, pricing: "Freemium", url: "https://quizlet.com", initials: "QZ", hue: 240 },
  { id: "speak", name: "Speak", description: "AI tutor to learn languages by speaking.", category: "Education AI", rating: 4.7, pricing: "Freemium", url: "https://speak.com", initials: "SP", hue: 30 },
  { id: "socratic", name: "Socratic", description: "Google’s AI homework helper.", category: "Education AI", rating: 4.4, pricing: "Free", url: "https://socratic.org", initials: "SO", hue: 200 },

  // ---- Finance AI ----
  { id: "kavout", name: "Kavout", description: "AI-driven stock ratings and insights.", category: "Finance AI", rating: 4.2, pricing: "Paid", url: "https://kavout.com", initials: "KV", hue: 210 },
  { id: "cleo", name: "Cleo", description: "AI money assistant that chats with you.", category: "Finance AI", rating: 4.5, pricing: "Freemium", url: "https://meetcleo.com", initials: "CO", hue: 320 },
  { id: "magnifi", name: "Magnifi", description: "AI investing copilot for everyone.", category: "Finance AI", rating: 4.3, pricing: "Freemium", url: "https://magnifi.com", initials: "MF", hue: 250 },
  { id: "incrmnt", name: "Truewind", description: "AI bookkeeping & finance for startups.", category: "Finance AI", rating: 4.4, pricing: "Paid", url: "https://truewind.ai", initials: "TW", hue: 180 },

  // ---- Resume AI ----
  { id: "rezi", name: "Rezi", description: "AI resume builder optimized for ATS.", category: "Resume AI", rating: 4.6, pricing: "Freemium", url: "https://rezi.ai", initials: "RZ", hue: 260 },
  { id: "kickresume", name: "Kickresume", description: "AI-powered resume and cover letter generator.", category: "Resume AI", rating: 4.5, pricing: "Freemium", url: "https://kickresume.com", initials: "KK", hue: 30 },
  { id: "teal", name: "Teal", description: "AI resume builder and job tracker.", category: "Resume AI", rating: 4.5, pricing: "Freemium", url: "https://tealhq.com", initials: "TE", hue: 170 },
  { id: "enhancv", name: "Enhancv", description: "Beautiful AI resumes that get interviews.", category: "Resume AI", rating: 4.4, pricing: "Freemium", url: "https://enhancv.com", initials: "EN", hue: 220 },

  // ---- Website Builders ----
  { id: "durable", name: "Durable", description: "Spin up a full website in 30 seconds with AI.", category: "Website Builders", rating: 4.5, pricing: "Freemium", url: "https://durable.co", initials: "DR", hue: 30 },
  { id: "wix-ai", name: "Wix AI", description: "AI website creator and design assistant.", category: "Website Builders", rating: 4.4, pricing: "Freemium", url: "https://wix.com", initials: "WX", hue: 220 },
  { id: "hostinger-ai", name: "Hostinger AI", description: "Build sites with AI in minutes.", category: "Website Builders", rating: 4.3, pricing: "Paid", url: "https://hostinger.com", initials: "HO", hue: 280 },
  { id: "bolt-sites", name: "10Web", description: "AI website builder powered by WordPress.", category: "Website Builders", rating: 4.3, pricing: "Freemium", url: "https://10web.io", initials: "10", hue: 200 },

  // ---- Presentations AI ----
  { id: "gamma", name: "Gamma", description: "AI presentations, docs and webpages.", category: "Presentations AI", rating: 4.7, pricing: "Freemium", url: "https://gamma.app", initials: "GM", hue: 290 },
  { id: "tome", name: "Tome", description: "AI-native storytelling for sales & marketing.", category: "Presentations AI", rating: 4.4, pricing: "Freemium", url: "https://tome.app", initials: "TM", hue: 0 },
  { id: "beautifulai", name: "Beautiful.ai", description: "Design beautiful slides with smart templates.", category: "Presentations AI", rating: 4.5, pricing: "Paid", url: "https://beautiful.ai", initials: "BA", hue: 340 },
  { id: "slidesai", name: "SlidesAI", description: "Generate Google Slides from text instantly.", category: "Presentations AI", rating: 4.3, pricing: "Freemium", url: "https://slidesai.io", initials: "SA", hue: 40 },

  // ---- Translation AI ----
  { id: "deepl", name: "DeepL", description: "Most accurate AI translator across 30+ languages.", category: "Translation AI", rating: 4.9, pricing: "Freemium", url: "https://deepl.com", initials: "DL", hue: 220 },
  { id: "lokalise", name: "Lokalise AI", description: "AI-powered localization for product teams.", category: "Translation AI", rating: 4.5, pricing: "Paid", url: "https://lokalise.com", initials: "LK", hue: 280 },
  { id: "smartling", name: "Smartling", description: "Enterprise translation management with AI.", category: "Translation AI", rating: 4.4, pricing: "Paid", url: "https://smartling.com", initials: "SM", hue: 30 },

  // ---- Data AI ----
  { id: "julius", name: "Julius AI", description: "Chat with your spreadsheets and data.", category: "Data AI", rating: 4.6, pricing: "Freemium", url: "https://julius.ai", initials: "JU", hue: 200 },
  { id: "hex", name: "Hex Magic", description: "AI for data notebooks and analytics teams.", category: "Data AI", rating: 4.6, pricing: "Freemium", url: "https://hex.tech", initials: "HX", hue: 320 },
  { id: "akkio", name: "Akkio", description: "No-code AI for business analytics.", category: "Data AI", rating: 4.4, pricing: "Paid", url: "https://akkio.com", initials: "AK", hue: 260 },
  { id: "tableau-ai", name: "Tableau AI", description: "Generative AI inside Tableau dashboards.", category: "Data AI", rating: 4.5, pricing: "Paid", url: "https://tableau.com", initials: "TB", hue: 220 },

  // ---- Fashion AI ----
  { id: "vue-ai", name: "Vue.ai", description: "AI styling, catalog automation for fashion.", category: "Fashion AI", rating: 4.3, pricing: "Paid", url: "https://vue.ai", initials: "VU", hue: 340 },
  { id: "ai-stylist", name: "The New Black", description: "Generate fashion designs with AI.", category: "Fashion AI", rating: 4.4, pricing: "Freemium", url: "https://thenewblack.ai", initials: "NB", hue: 0 },
  { id: "resleeve", name: "Resleeve", description: "AI fashion design and moodboards.", category: "Fashion AI", rating: 4.2, pricing: "Freemium", url: "https://resleeve.ai", initials: "RL", hue: 320 },

  // ---- Interior AI ----
  { id: "interiorai", name: "Interior AI", description: "Redesign any room with AI in seconds.", category: "Interior AI", rating: 4.5, pricing: "Freemium", url: "https://interiorai.com", initials: "IA", hue: 30 },
  { id: "reroom", name: "REimagineHome", description: "AI-powered virtual home staging.", category: "Interior AI", rating: 4.4, pricing: "Freemium", url: "https://reimaginehome.ai", initials: "RH", hue: 200 },
  { id: "collov", name: "Collov AI", description: "Interior design tools powered by AI.", category: "Interior AI", rating: 4.3, pricing: "Freemium", url: "https://collov.ai", initials: "CL", hue: 250 },

  // ---- Health AI ----
  { id: "ada", name: "Ada Health", description: "AI symptom checker and triage assistant.", category: "Health AI", rating: 4.6, pricing: "Free", url: "https://ada.com", initials: "AD", hue: 200 },
  { id: "k-health", name: "K Health", description: "AI primary care from your phone.", category: "Health AI", rating: 4.4, pricing: "Freemium", url: "https://khealth.com", initials: "KH", hue: 220 },
  { id: "babylon", name: "Babylon Health", description: "Digital-first AI health platform.", category: "Health AI", rating: 4.3, pricing: "Paid", url: "https://babylonhealth.com", initials: "BB", hue: 260 },

  // ---- Business AI ----
  { id: "salesforce-ein", name: "Einstein GPT", description: "Salesforce’s generative AI for CRM.", category: "Business AI", rating: 4.5, pricing: "Paid", url: "https://salesforce.com/einstein", initials: "EI", hue: 200 },
  { id: "gong", name: "Gong", description: "AI revenue intelligence and sales insights.", category: "Business AI", rating: 4.7, pricing: "Paid", url: "https://gong.io", initials: "GO", hue: 340 },
  { id: "clay", name: "Clay", description: "AI-powered data enrichment for sales teams.", category: "Business AI", rating: 4.7, pricing: "Freemium", url: "https://clay.com", initials: "CY", hue: 30 },
];
