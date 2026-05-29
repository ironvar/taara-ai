import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Sparkles,
  MessageSquare,
  ImageIcon,
  Video,
  GitCompare,
  Wand2,
  Zap,
  Brain,
  Layers,
  Shield,
  Star,
  Check,
  Plus,
  Minus,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useState } from "react";
import { AmbientBackground } from "@/components/ambient-background";
import { Logo } from "@/components/logo";
import { MotionGlassCard } from "@/components/glass-card";
import { TOOLS, CATEGORIES } from "@/data/tools";
import { ReviewsSection } from "@/components/reviews-section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Taara — One Platform For Every AI Tool" },
      {
        name: "description",
        content:
          "Chat with GPT, Gemini, Claude and more. Generate images and videos. Discover 100+ AI tools — all in one futuristic platform.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AmbientBackground />
      <Nav />
      <Hero />
      <TrendingTools />
      <Categories />
      <Features />
      <ReviewsSection />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

/* ---------- Nav ---------- */

function Nav() {
  return (
    <header className="glass-strong sticky top-0 z-40 border-b border-glass-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">Features</a>
          <a href="#tools" className="transition hover:text-foreground">Tools</a>
          <a href="#pricing" className="transition hover:text-foreground">Pricing</a>
          <a href="#faq" className="transition hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/app/dashboard"
            className="hidden rounded-xl border border-glass-border bg-glass px-4 py-2 text-sm font-medium transition hover:bg-white/5 sm:inline-flex"
          >
            Open App
          </Link>
          <Link
            to="/app/chat"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
          >
            Try free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const [q, setQ] = useState("");
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-28 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Now with multi-model chat & instant image gen
        </span>

        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          <span className="text-gradient">One Platform</span>
          <br />
          <span>For Every AI Tool</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Chat, create, generate, compare and discover the world’s most powerful
          AI tools — all from one beautifully simple dashboard.
        </p>

        {/* Search bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="glass-strong mt-10 flex w-full max-w-xl items-center gap-2 rounded-2xl p-2 shadow-glass"
        >
          <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 100+ AI tools, models or prompts…"
            className="flex-1 bg-transparent px-2 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <Link
            to="/app/tools"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
          >
            Explore
          </Link>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/app/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
          >
            <MessageSquare className="h-4 w-4" />
            Start chatting
          </Link>
          <Link
            to="/app/image"
            className="inline-flex items-center gap-2 rounded-xl border border-glass-border bg-glass px-5 py-3 text-sm font-medium transition hover:bg-white/5"
          >
            <ImageIcon className="h-4 w-4" />
            Generate an image
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Powered by GPT-5 · Gemini · Claude · DeepSeek · Llama · Mistral
        </p>
      </motion.div>

      {/* Floating preview card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative mx-auto mt-20 max-w-5xl"
      >
        <div className="glass-strong rounded-3xl p-3 shadow-glow-lg">
          <div className="rounded-2xl bg-surface/60 p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: MessageSquare, title: "Multi-model chat", desc: "Talk to GPT, Gemini, Claude side-by-side.", to: "/app/chat" as const },
                { icon: ImageIcon, title: "Image generator", desc: "Render in any style or aspect ratio.", to: "/app/image" as const },
                { icon: GitCompare, title: "Compare models", desc: "Send one prompt to many models.", to: "/app/compare" as const },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  <Link
                    to={f.to}
                    className="glass block rounded-xl p-5 transition hover:bg-white/5 hover:shadow-glow focus:outline-none focus:ring-1 focus:ring-primary/40"
                  >
                    <f.icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-semibold">{f.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- Trending ---------- */

function TrendingTools() {
  const trending = TOOLS.slice(0, 12);
  return (
    <section id="tools" className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Trending AI tools
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hand-picked tools loved by creators this week.
          </p>
        </div>
        <Link
          to="/app/tools"
          className="hidden text-sm font-medium text-primary hover:underline sm:inline"
        >
          See all 100+ →
        </Link>
      </div>

      <div className="mt-8 overflow-hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trending.map((t, i) => (
            <motion.a
              key={t.id}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="glass glow-hover block w-64 shrink-0 rounded-2xl p-5 transition hover:bg-white/5 focus:outline-none focus:ring-1 focus:ring-primary/40"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.55 0.18 ${t.hue}), oklch(0.40 0.20 ${(t.hue + 50) % 360}))`,
                  }}
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.category}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{t.description}</p>
              <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" /> {t.rating}
                </span>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">
                  {t.pricing}
                </span>
              </div>
            </motion.a>
          ))}

        </div>
      </div>
    </section>
  );
}

/* ---------- Categories ---------- */

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Browse by category
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every kind of AI, sorted and searchable.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <Link
              to="/app/tools"
              className="glass glow-hover inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {c}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Features ---------- */

const FEATURES = [
  { icon: MessageSquare, title: "Multi-Model AI Chat", desc: "Switch between GPT-5, Gemini, Claude and Llama in one streaming conversation.", to: "/app/chat" as const },
  { icon: GitCompare, title: "Compare Side-by-Side", desc: "Send one prompt to many models and pick the best answer.", to: "/app/compare" as const },
  { icon: ImageIcon, title: "AI Image Generator", desc: "Beautiful images from a single prompt, any aspect ratio.", to: "/app/image" as const },
  { icon: Video, title: "AI Video Generator", desc: "Turn ideas into short cinematic videos.", to: "/app/video" as const },
  { icon: Wand2, title: "100+ AI Tools Directory", desc: "Browse the best AI tools by category, rating and price.", to: "/app/tools" as const },
  { icon: Brain, title: "Prompt Library", desc: "Save, organize and reuse your best prompts forever.", to: "/app/prompts" as const },
  { icon: Layers, title: "Saved Projects", desc: "Everything you make lives in one tidy dashboard.", to: "/app/saved" as const },
  { icon: Shield, title: "Private & Secure", desc: "Encrypted database, protected routes, no model lock-in." },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          Everything you need.
          <br />
          <span className="text-gradient">Nothing you don’t.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Taara replaces a dozen subscriptions with one fast, beautiful workspace.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => {
          const card = (
            <MotionGlassCard
              delay={i * 0.04}
              className={`p-6 ${f.to ? "transition hover:bg-white/5 hover:shadow-glow focus:outline-none focus:ring-1 focus:ring-primary/40" : ""}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary-glow/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </MotionGlassCard>
          );
          return f.to ? (
            <Link key={f.title} to={f.to} className="block">
              {card}
            </Link>
          ) : (
            <div key={f.title}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

const TESTIMONIALS = [
  { name: "Maya R.", role: "Indie founder", quote: "Taara replaced four subscriptions for me. The multi-model chat alone is worth it." },
  { name: "Devon K.", role: "YouTuber", quote: "Going from script idea to thumbnail to b-roll prompt in one tab is wild." },
  { name: "Sara L.", role: "Product designer", quote: "The cleanest AI interface I’ve used. It just gets out of the way." },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Loved by builders and creators
      </h2>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <MotionGlassCard key={t.name} delay={i * 0.06} className="p-6">
            <div className="flex gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="h-3.5 w-3.5 fill-primary" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-xs font-bold text-primary-foreground">
                {t.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </MotionGlassCard>
        ))}
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */

const PLANS = [
  {
    name: "Free",
    price: "$0",
    blurb: "Everything to get started.",
    features: ["100 chat messages / mo", "20 image generations", "Access to AI tools directory", "Save up to 5 projects"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    blurb: "For creators going pro.",
    features: ["Unlimited multi-model chat", "Unlimited image gen", "Compare up to 4 models", "Prompt library", "Priority speed"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$49",
    blurb: "For small teams shipping fast.",
    features: ["Everything in Pro", "Up to 5 seats", "Shared prompt library", "Team workspaces", "Priority support"],
    cta: "Start team",
    highlight: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          Simple, scalable <span className="text-gradient">pricing</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Start free. Upgrade only when you outgrow it.
        </p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <MotionGlassCard
            key={p.name}
            delay={i * 0.06}
            className={`p-7 ${p.highlight ? "border-primary/40 ring-1 ring-primary/30" : ""}`}
          >
            {p.highlight && (
              <span className="absolute right-5 top-5 rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Most Popular
              </span>
            )}
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.name}</p>
            <p className="mt-3 font-display text-4xl font-bold">
              {p.price}
              <span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
            <ul className="mt-6 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/app/dashboard"
              className={`mt-7 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                p.highlight
                  ? "bg-primary text-primary-foreground shadow-glow hover:brightness-110"
                  : "border border-glass-border bg-glass hover:bg-white/5"
              }`}
            >
              {p.cta}
            </Link>
          </MotionGlassCard>
        ))}
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const FAQS = [
  { q: "Which AI models can I use?", a: "GPT-5, Gemini 2.5 Pro & Flash, Claude, DeepSeek, Llama, Mistral and more — all from one interface." },
  { q: "Is Taara free to try?", a: "Yes. The Free plan includes 100 chat messages and 20 image generations per month, no credit card required." },
  { q: "Can I compare model answers?", a: "Yes — the Compare page sends one prompt to multiple models and shows answers side-by-side." },
  { q: "Do you store my conversations?", a: "Chats are saved privately to your account so you can resume them. You can delete any chat at any time." },
  { q: "What about image and video generation?", a: "Image generation is included today. Video generation is rolling out in v1.1." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <h2 className="text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Frequently asked questions
      </h2>
      <div className="mt-10 space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <MotionGlassCard key={f.q} delay={i * 0.03} className="overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-medium sm:text-base">{f.q}</span>
                {isOpen ? (
                  <Minus className="h-4 w-4 text-primary" />
                ) : (
                  <Plus className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
              </motion.div>
            </MotionGlassCard>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="border-t border-glass-border bg-glass">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              One platform for every AI tool. Built for creators, founders and tinkerers.
            </p>
            <div className="mt-5 flex gap-3 text-muted-foreground">
              <a href="#" aria-label="Twitter" className="rounded-lg p-2 transition hover:bg-white/5 hover:text-primary">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="GitHub" className="rounded-lg p-2 transition hover:bg-white/5 hover:text-primary">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="rounded-lg p-2 transition hover:bg-white/5 hover:text-primary">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          <FooterCol title="Product" items={[
            { label: "AI Chat", to: "/app/chat" },
            { label: "Image Generator", to: "/app/image" },
            { label: "Compare Models", to: "/app/compare" },
            { label: "AI Tools", to: "/app/tools" },
          ]} />
          <FooterCol title="Resources" items={[
            { label: "Blog", to: "/app/blog" },
            { label: "Prompt Library", to: "/app/prompts" },
            { label: "Dashboard", to: "/app/dashboard" },
          ]} />
          <FooterCol title="Company" items={[
            { label: "About", to: "/" },
            { label: "Pricing", to: "/" },
            { label: "Contact", to: "/" },
          ]} />
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-glass-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Taara. All rights reserved.</p>
          <p className="inline-flex items-center gap-1">
            <Zap className="h-3 w-3 text-primary" /> Built with Lovable
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="transition hover:text-foreground">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
