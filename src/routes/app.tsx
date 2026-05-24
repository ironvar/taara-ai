import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { AmbientBackground } from "@/components/ambient-background";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen">
      <AmbientBackground />
      <AppSidebar onRequestAuth={() => setAuthOpen(true)} />
      <main className="min-w-0 flex-1">
        {loading ? (
          <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>
        ) : user ? (
          <Outlet />
        ) : (
          <SignedOut onSignIn={() => setAuthOpen(true)} />
        )}
      </main>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

function SignedOut({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong max-w-md rounded-3xl p-8 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold">Sign in to Taara</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Save your chats, bookmark tools, generate images — all synced to your account.
        </p>
        <button
          onClick={onSignIn}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:brightness-110"
        >
          Sign in or create account
        </button>
      </motion.div>
    </div>
  );
}
