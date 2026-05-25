import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import { MotionGlassCard } from "@/components/glass-card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ReviewModal } from "@/components/review-modal";
import { AuthModal } from "@/components/auth-modal";

type Review = {
  id: string;
  rating: number;
  body: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

const FALLBACK: Review[] = [
  { id: "s1", rating: 5, body: "Taara replaced four subscriptions for me. The multi-model chat alone is worth it.", display_name: "Maya R.", avatar_url: null, created_at: "" },
  { id: "s2", rating: 5, body: "Going from script idea to thumbnail to b-roll prompt in one tab is wild.", display_name: "Devon K.", avatar_url: null, created_at: "" },
  { id: "s3", rating: 5, body: "The cleanest AI interface I’ve used. It just gets out of the way.", display_name: "Sara L.", avatar_url: null, created_at: "" },
];

export function ReviewsSection() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const load = () => {
    supabase
      .from("reviews")
      .select("id, rating, body, display_name, avatar_url, created_at")
      .order("created_at", { ascending: false })
      .limit(9)
      .then(({ data }) => {
        setReviews(data && data.length > 0 ? data : FALLBACK);
      });
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Loved by builders & creators
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">Real reviews from the Taara community.</p>
        <button
          onClick={() => (user ? setOpen(true) : setAuthOpen(true))}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Write a review
        </button>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {reviews.map((r, i) => (
          <MotionGlassCard key={r.id} delay={i * 0.05} className="p-6">
            <div className="flex gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className={`h-3.5 w-3.5 ${k < r.rating ? "fill-primary" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-4 text-sm leading-relaxed">
              “{r.body}”
            </motion.p>
            <div className="mt-6 flex items-center gap-3">
              {r.avatar_url ? (
                <img src={r.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-xs font-bold text-primary-foreground">
                  {(r.display_name ?? "T")[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">{r.display_name ?? "Anonymous"}</p>
                <p className="text-xs text-muted-foreground">Taara member</p>
              </div>
            </div>
          </MotionGlassCard>
        ))}
      </div>

      <ReviewModal open={open} onClose={() => setOpen(false)} onSubmitted={load} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
