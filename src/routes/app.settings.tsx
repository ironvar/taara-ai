import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { MotionGlassCard } from "@/components/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Taara" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("profiles")
      .select("display_name, bio, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name ?? "");
          setBio(data.bio ?? "");
          setAvatarUrl(data.avatar_url ?? "");
        }
        setLoading(false);
      });
    setNotifications(localStorage.getItem("taara:notifications") !== "false");
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert(
        { user_id: user.id, display_name: displayName || null, bio: bio || null, avatar_url: avatarUrl || null },
        { onConflict: "user_id" },
      );
    localStorage.setItem("taara:notifications", String(notifications));
    setSaving(false);
    if (error) toast.error("Couldn’t save settings");
    else toast.success("Settings saved");
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground sm:px-8">
        Sign in to manage your settings.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Settings
      </motion.h1>

      <MotionGlassCard className="mt-6 p-6">
        <h2 className="font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Edit how you appear across Taara.</p>

        <div className="mt-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : <UserIcon className="h-6 w-6" />}
          </div>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Avatar image URL (https://…)"
            className="flex-1 rounded-xl border border-glass-border bg-surface/40 px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none"
          />
        </div>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Display name</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={60}
              className="w-full rounded-xl border border-glass-border bg-surface/40 px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Email</span>
            <input
              value={user.email ?? ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-glass-border bg-surface/20 px-4 py-2.5 text-sm text-muted-foreground"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={280}
              placeholder="What are you building with AI?"
              className="w-full resize-none rounded-xl border border-glass-border bg-surface/40 px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none"
            />
          </label>
        </div>
      </MotionGlassCard>

      <MotionGlassCard className="mt-4 p-6">
        <h2 className="font-semibold">Preferences</h2>
        <label className="mt-4 flex items-center justify-between text-sm">
          <span>Email notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
        </label>
        <p className="mt-4 text-xs text-muted-foreground">Taara uses a dark futuristic theme by default for the best contrast on neon visuals.</p>
      </MotionGlassCard>

      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-40"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>
    </div>
  );
}
