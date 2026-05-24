import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

type Mode = "login" | "signup";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Reset link sent. Check your email.");
        setForgot(false);
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check email to confirm.");
        onClose();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        onClose();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Google sign-in failed");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      onClose();
    } catch {
      toast.error("Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="glass-strong relative w-full max-w-md rounded-3xl border border-glass-border p-7 shadow-glass"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    {forgot ? "Reset password" : mode === "login" ? "Welcome back" : "Create account"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {forgot ? "We'll email you a reset link." : "Continue to Taara"}
                  </p>
                </div>
              </div>

              {!forgot && (
                <>
                  <button
                    onClick={google}
                    disabled={loading}
                    className="glass mb-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium glow-hover disabled:opacity-50"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>
                  <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <div className="h-px flex-1 bg-glass-border" /> or <div className="h-px flex-1 bg-glass-border" />
                  </div>
                </>
              )}

              <form onSubmit={submit} className="space-y-3">
                {mode === "signup" && !forgot && (
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                )}
                <div className="glass flex items-center gap-2 rounded-xl px-3 py-0.5 focus-within:ring-1 focus-within:ring-primary">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none"
                  />
                </div>
                {!forgot && (
                  <div className="glass flex items-center gap-2 rounded-xl px-3 py-0.5 focus-within:ring-1 focus-within:ring-primary">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {forgot ? "Send reset link" : mode === "login" ? "Sign in" : "Create account"}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-between text-xs">
                <button
                  onClick={() => { setMode(mode === "login" ? "signup" : "login"); setForgot(false); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {mode === "login" ? "Need an account? Sign up" : "Have an account? Sign in"}
                </button>
                {!forgot && mode === "login" && (
                  <button onClick={() => setForgot(true)} className="text-primary hover:underline">
                    Forgot password?
                  </button>
                )}
                {forgot && (
                  <button onClick={() => setForgot(false)} className="text-primary hover:underline">
                    Back to sign in
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.1 4 9.2 8.5 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.2 35.4 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.1 39.5 16 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.2 5.2C41 35 44 30 44 24c0-1.3-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
