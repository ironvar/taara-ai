import { motion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hover?: boolean;
};

export function GlassCard({
  children,
  className = "",
  hover = false,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={`glass relative overflow-hidden rounded-2xl ${hover ? "glow-hover" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function MotionGlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`glass relative overflow-hidden rounded-2xl ${hover ? "glow-hover" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
