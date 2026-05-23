import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
        <Sparkles className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-gradient">
        Taara
      </span>
    </Link>
  );
}
