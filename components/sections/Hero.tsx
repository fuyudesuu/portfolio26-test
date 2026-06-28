"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, 125]);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
    >
      <motion.div className="relative z-10" style={{ opacity, y }}>
        <p className="text-[13px] font-semibold tracking-[0.12em] uppercase text-[var(--accent-1)] mb-5">
          designer · developer · creator
        </p>

        <h1 className="text-[clamp(52px,12vw,96px)] font-black tracking-[-0.05em] leading-[0.95] text-[var(--fg)] mb-5">
          Alex<br />Nguyen
        </h1>

        <p className="text-[clamp(16px,2.5vw,20px)] font-normal text-[var(--fg-2)] max-w-[440px] mx-auto mb-10 leading-relaxed">
          Crafting expressive digital experiences from Saigon
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="#about"
            className="flex items-center gap-2 px-7 py-3.5 rounded-pill text-sm font-semibold bg-[var(--accent-1)] text-white border-none shadow-[0_4px_16px_rgba(232,148,58,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(232,148,58,0.4)] transition-all duration-250 outline-none"
          >
            Explore my work <ArrowUpRight size={16} />
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 px-7 py-3.5 rounded-pill text-sm font-semibold bg-transparent text-[var(--fg)] border-[1.5px] border-[var(--border)] hover:border-[var(--fg-3)] hover:-translate-y-0.5 transition-all duration-250 outline-none"
          >
            Get in touch
          </a>
        </div>
      </motion.div>

      <div className="absolute bottom-10 text-[var(--fg-3)] animate-bounce-slow">
        <ChevronDown size={22} />
      </div>
    </section>
  );
}
