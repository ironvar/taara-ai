import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AmbientBackground } from "@/components/ambient-background";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Taara" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/app/chat" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <AmbientBackground />
      <form onSubmit={submit} className="glass-strong w-full max-w-md rounded-3xl p-7">
        <h1 className="font-display text-2xl font-semibold">Set new password</h1>
        <div className="glass mt-5 flex items-center gap-2 rounded-xl px-3">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <input
            type="password"
            required
            minLength={6}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none"
          />
        </div>
        <button
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Update password
        </button>
      </form>
    </div>
  );
}
