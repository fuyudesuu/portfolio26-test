"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";

type HeroProps = {
  profile: {
    name: string;
    eyebrow: string;
    tagline: string;
  };
};

const SHAPES = [
  { size: 180, x: "8%",  y: "15%", color: "var(--accent-1)", radius: "38%",  speed: 0.08, rotate: 12,  delay: 0 },
  { size: 120, x: "78%", y: "12%", color: "var(--accent-2)", radius: "30%",  speed: 0.12, rotate: -8,  delay: 1 },
  { size: 90,  x: "85%", y: "65%", color: "var(--accent-3)", radius: "50%",  speed: 0.06, rotate: 20,  delay: 2 },
  { size: 140, x: "5%",  y: "70%", color: "var(--accent-2)", radius: "44%",  speed: 0.1,  rotate: -15, delay: 0.5 },
  { size: 60,  x: "35%", y: "8%",  color: "var(--accent-3)", radius: "50%",  speed: 0.14, rotate: 30,  delay: 1.5 },
  { size: 50,  x: "60%", y: "80%", color: "var(--accent-1)", radius: "50%",  speed: 0.09, rotate: -25, delay: 0.8 },
];

export default function Hero({ profile }: HeroProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, 125]);

  const s0y = useTransform(scrollY, [0, 600], [0, SHAPES[0].speed * 600]);
  const s0r = useTransform(scrollY, [0, 600], [SHAPES[0].rotate, SHAPES[0].rotate + 30]);
  const s1y = useTransform(scrollY, [0, 600], [0, SHAPES[1].speed * 600]);
  const s1r = useTransform(scrollY, [0, 600], [SHAPES[1].rotate, SHAPES[1].rotate + 30]);
  const s2y = useTransform(scrollY, [0, 600], [0, SHAPES[2].speed * 600]);
  const s2r = useTransform(scrollY, [0, 600], [SHAPES[2].rotate, SHAPES[2].rotate + 30]);
  const s3y = useTransform(scrollY, [0, 600], [0, SHAPES[3].speed * 600]);
  const s3r = useTransform(scrollY, [0, 600], [SHAPES[3].rotate, SHAPES[3].rotate + 30]);
  const s4y = useTransform(scrollY, [0, 600], [0, SHAPES[4].speed * 600]);
  const s4r = useTransform(scrollY, [0, 600], [SHAPES[4].rotate, SHAPES[4].rotate + 30]);
  const s5y = useTransform(scrollY, [0, 600], [0, SHAPES[5].speed * 600]);
  const s5r = useTransform(scrollY, [0, 600], [SHAPES[5].rotate, SHAPES[5].rotate + 30]);

  const shapeTransforms = [
    { y: s0y, rotate: s0r }, { y: s1y, rotate: s1r },
    { y: s2y, rotate: s2r }, { y: s3y, rotate: s3r },
    { y: s4y, rotate: s4r }, { y: s5y, rotate: s5r },
  ];

  const nameParts = profile.name.split(" ");

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,var(--accent-1)_0%,transparent_70%)] opacity-[0.07] pointer-events-none dark:opacity-[0.05]" />

      {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ width: s.size, height: s.size, left: s.x, top: s.y, borderRadius: s.radius, background: s.color, opacity: 0.08, y: shapeTransforms[i].y, rotate: shapeTransforms[i].rotate }}
          animate={{ x: [0, 12, -8, 0], y: [0, -15, 10, 0], scale: [1, 1.05, 0.97, 1] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}

      <motion.div className="relative z-10" style={{ opacity, y }}>
        <motion.p className="text-[13px] font-semibold tracking-[0.12em] uppercase text-[var(--accent-1)] mb-5"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {profile.eyebrow}
        </motion.p>
        <motion.h1 className="text-[clamp(52px,12vw,96px)] font-black tracking-[-0.05em] leading-[0.95] text-[var(--fg)] mb-5"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          {nameParts.map((part, i) => (<span key={i}>{part}{i < nameParts.length - 1 && <br />}</span>))}
        </motion.h1>
        <motion.p className="text-[clamp(16px,2.5vw,20px)] font-normal text-[var(--fg-2)] max-w-[440px] mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          {profile.tagline}
        </motion.p>
        <motion.div className="flex gap-3 justify-center flex-wrap"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <a href="#about" className="flex items-center gap-2 px-7 py-3.5 rounded-pill text-sm font-semibold bg-[var(--accent-1)] text-white border-none shadow-[0_4px_16px_rgba(232,148,58,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(232,148,58,0.4)] transition-all duration-250 outline-none">
            Explore my work <ArrowUpRight size={16} />
          </a>
          <a href="#contact" className="flex items-center gap-2 px-7 py-3.5 rounded-pill text-sm font-semibold bg-transparent text-[var(--fg)] border-[1.5px] border-[var(--border)] hover:border-[var(--fg-3)] hover:-translate-y-0.5 transition-all duration-250 outline-none">
            Get in touch
          </a>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-10 text-[var(--fg-3)]"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
