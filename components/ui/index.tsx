"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

/* ─── Fade-in on scroll ─── */
export function FadeIn({
  children,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left";
}) {
  const initial =
    direction === "left"
      ? { opacity: 0, x: -20 }
      : { opacity: 0, y: 20 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: delay * 0.1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── 3D tilt on hover ─── */
export function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`
    );
  }

  function onLeave() {
    setTransform("perspective(600px) rotateY(0) rotateX(0) scale(1)");
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform,
        transition: transform.includes("scale(1.03)")
          ? "transform 0.1s ease"
          : "transform 0.4s ease",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Section header ─── */
export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-12">
      <span className="block text-xs font-semibold tracking-[0.1em] uppercase text-[var(--accent-1)] mb-2.5">
        {subtitle}
      </span>
      <h2 className="text-[clamp(32px,6vw,48px)] font-black tracking-display text-[var(--fg)] m-0">
        {title}
      </h2>
    </div>
  );
}

/* ─── Page header (for sub-pages) ─── */
export function PageHeader({
  title,
  subtitle,
  description,
  onBack,
}: {
  title: string;
  subtitle: string;
  description: string;
  onBack: () => void;
}) {
  return (
    <div className="max-w-[720px] mx-auto px-5 pb-12 text-center">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--fg-3)] bg-transparent border-none cursor-pointer outline-none mb-6 font-[inherit] hover:text-[var(--accent-1)] transition-colors"
      >
        ← Back
      </button>
      <span className="block text-xs font-semibold tracking-[0.1em] uppercase text-[var(--accent-1)] mb-2.5">
        {subtitle}
      </span>
      <h1 className="text-[clamp(36px,8vw,56px)] font-black tracking-display text-[var(--fg)] my-3">
        {title}
      </h1>
      <p className="text-[15px] text-[var(--fg-2)] leading-relaxed max-w-[500px] mx-auto">
        {description}
      </p>
    </div>
  );
}
