import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the multiverse</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110"
        >
          Take me home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We hit a snag rendering this page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-xl border border-glass-border bg-glass px-4 py-2 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Taara — One Platform For Every AI Tool" },
      {
        name: "description",
        content:
          "Chat, create, generate, compare and discover the world’s most powerful AI tools. 100+ tools, multi-model chat, image & video generation in one futuristic platform.",
      },
      { name: "theme-color", content: "#0d1b2a" },
      { property: "og:title", content: "Taara — One Platform For Every AI Tool" },
      {
        property: "og:description",
        content:
          "Chat with GPT, Gemini, Claude and more. Generate images and videos. Discover 100+ AI tools in one premium dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Taara — One Platform For Every AI Tool" },
      { name: "description", content: "Taara is an all-in-one AI hub to chat, create, compare AI models, generate content, and explore 100+ powerful AI tools in one place." },
      { property: "og:description", content: "Taara is an all-in-one AI hub to chat, create, compare AI models, generate content, and explore 100+ powerful AI tools in one place." },
      { name: "twitter:description", content: "Taara is an all-in-one AI hub to chat, create, compare AI models, generate content, and explore 100+ powerful AI tools in one place." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/tuQB2xzjOAZrnnRDKx05vJFjpHq1/social-images/social-1779510017052-taara_ai.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/tuQB2xzjOAZrnnRDKx05vJFjpHq1/social-images/social-1779510017052-taara_ai.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthInvalidator />
        <Outlet />
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "oklch(0.20 0.035 225 / 0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid oklch(0.85 0.08 170 / 0.15)",
              color: "oklch(0.97 0.01 180)",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AuthInvalidator() {
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);
  return null;
}
