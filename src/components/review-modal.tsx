import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export function ReviewModal({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) {
      toast.error("Sign in to write a review");
      return;
    }
    if (body.trim().length < 4) {
      toast.error("Tell us a bit more");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      rating,
      body: body.trim(),
      display_name: name.trim() || user.email?.split("@")[0] || "Anonymous",
      avatar_url: user.user_metadata?.avatar_url ?? null,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn’t post review");
      return;
    }
    toast.success("Thanks for your review!");
    setBody("");
    onSubmitted();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="glass-strong relative w-full max-w-md rounded-3xl border border-glass-border p-7 shadow-glass"
            >
              <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/5">
                <X className="h-4 w-4" />
              </button>
              <h2 className="font-display text-xl font-semibold">Write a review</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tell other builders what you think of Taara.</p>

              <div className="mt-5 flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                    <Star className={`h-7 w-7 transition ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
                  </button>
                ))}
              </div>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Display name (optional)"
                maxLength={60}
                className="mt-4 w-full rounded-xl border border-glass-border bg-surface/40 px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                maxLength={600}
                placeholder="What do you love about Taara?"
                className="mt-3 w-full resize-none rounded-xl border border-glass-border bg-surface/40 px-4 py-2.5 text-sm focus:border-primary/40 focus:outline-none"
              />
              <button
                onClick={submit}
                disabled={loading}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:brightness-110 disabled:opacity-40"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Post review
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
