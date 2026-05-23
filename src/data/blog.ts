export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  date: string;
  hue: number;
};

export const BLOG_POSTS: BlogPost[] = [
  { slug: "best-ai-tools-2026", title: "The 25 Best AI Tools of 2026", excerpt: "From image generators to coding copilots — the AI tools every creator and builder is using right now.", category: "AI Tools", author: "Taara Editorial", readTime: "8 min", date: "May 18, 2026", hue: 170 },
  { slug: "ai-for-youtubers", title: "AI Toolkit for YouTubers in 2026", excerpt: "Scripting, thumbnails, voice, edits — automate the entire creator workflow.", category: "AI for Creators", author: "Taara Editorial", readTime: "6 min", date: "May 12, 2026", hue: 320 },
  { slug: "blender-vfx-ai", title: "AI for Blender, VFX and 3D Artists", excerpt: "Generative 3D, texture synthesis and the new wave of AI-assisted VFX pipelines.", category: "Tutorials", author: "Taara Editorial", readTime: "10 min", date: "May 5, 2026", hue: 200 },
  { slug: "image-prompt-guide", title: "The Ultimate AI Image Prompting Guide", excerpt: "Compose prompts like a pro and get pixel-perfect results on any model.", category: "Tutorials", author: "Taara Editorial", readTime: "12 min", date: "Apr 28, 2026", hue: 280 },
  { slug: "ai-automation-business", title: "How Small Teams Use AI to 10× Output", excerpt: "Practical automations that replace whole tools — and don’t need engineers.", category: "Automation", author: "Taara Editorial", readTime: "7 min", date: "Apr 21, 2026", hue: 30 },
  { slug: "claude-vs-gpt-vs-gemini", title: "Claude vs GPT vs Gemini — Which Wins in 2026?", excerpt: "Side-by-side comparisons across reasoning, code, vision and price.", category: "AI News", author: "Taara Editorial", readTime: "9 min", date: "Apr 14, 2026", hue: 220 },
];
