"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

/* ─── Fade-in on scroll ─── */
export function FadeIn({
  children,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "down";
}) {
  const initial =
    direction === "left"
      ? { opacity: 0, x: -20 }
      : direction === "down"
        ? { opacity: 0, y: -22 }
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
      `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`
    );
  }

  function onLeave() {
    setTransform("");
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform,
        // fast follow while tracking the pointer, slow settle on leave —
        // the two phases never fight each other
        transition: transform
          ? "transform 0.15s ease-out"
          : "transform 0.5s cubic-bezier(0.22,0.61,0.36,1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Letter-by-letter heading reveal ───
   Splits text into per-character spans that rise in sequence when scrolled
   into view. Words stay unbreakable so wrapping is natural mid-animation. */
export function LetterReveal({
  text,
  as: Tag = "h2",
  className = "",
  charDelay = 0.05,
  baseDelay = 0.15,
  y = 14,
  duration = 0.45,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  charDelay?: number;
  baseDelay?: number;
  /** Vertical rise distance per letter; 0 = pure fade. */
  y?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  if (reduce) return <Tag className={className}>{text}</Tag>;

  const MotionTag = motion[Tag];
  let idx = 0;
  return (
    <MotionTag
      className={className}
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.4 }}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => {
            const d = baseDelay + idx++ * charDelay;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ opacity: 0, y }}
                animate={started ? { opacity: 1, y: 0 } : {}}
                transition={{ duration, delay: d, ease: EASE_OUT }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}

/* ─── Typewriter statement ───
   Characters appear one by one with a blinking caret that lingers briefly
   after the sentence completes. Wrap one word in *asterisks* to render it
   in the accent gradient; trailing punctuation stays glued to its word. */
export function Typewriter({
  text,
  className = "",
  charDelay = 0.014,
  baseDelay = 0.1,
}: {
  text: string;
  className?: string;
  charDelay?: number;
  baseDelay?: number;
}) {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  // parse *accent* markers into flagged segments, then group into words —
  // adjacent segments with no whitespace between them share a word so
  // punctuation after the accent can never orphan onto its own line
  const words = useMemo(() => {
    const segs: { text: string; accent: boolean }[] = [];
    text.split(/\*([^*]+)\*/).forEach((part, i) => {
      if (part) segs.push({ text: part, accent: i % 2 === 1 });
    });
    const out: { ch: string; accent: boolean }[][] = [];
    let cur: { ch: string; accent: boolean }[] | null = null;
    for (const seg of segs) {
      for (const ch of seg.text.split("")) {
        if (/\s/.test(ch)) { cur = null; continue; }
        if (!cur) { cur = []; out.push(cur); }
        cur.push({ ch, accent: seg.accent });
      }
    }
    return out;
  }, [text]);

  const total = words.reduce((n, w) => n + w.length, 0);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setDone(true), (baseDelay + total * charDelay + 1.2) * 1000);
    return () => clearTimeout(t);
  }, [started, total, charDelay, baseDelay]);

  if (reduce) {
    return (
      <p className={className}>
        {words.map((w, wi) => (
          <span key={wi}>
            {w.some((c) => c.accent) ? <Accent>{w.map((c) => c.ch).join("")}</Accent> : w.map((c) => c.ch).join("")}
            {wi < words.length - 1 && " "}
          </span>
        ))}
      </p>
    );
  }

  let idx = 0;
  return (
    <motion.p
      className={className}
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.5 }}
      aria-label={text.replace(/\*/g, "")}
    >
      {words.map((w, wi) => {
        const accent = w.some((c) => c.accent);
        const chars = w.map((c, ci) => {
          const d = baseDelay + idx++ * charDelay;
          return (
            <motion.span
              key={ci}
              initial={{ opacity: 0 }}
              animate={started ? { opacity: 1 } : {}}
              transition={{ duration: 0.05, delay: d }}
            >
              {c.ch}
            </motion.span>
          );
        });
        return (
          <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
            {accent ? <Accent>{chars}</Accent> : chars}
            {wi < words.length - 1 && <span>&nbsp;</span>}
          </span>
        );
      })}
      {started && !done && (
        <span
          aria-hidden
          className="animate-caret ml-1.5 inline-block h-[0.85em] w-[3px] translate-y-[0.1em] bg-[var(--accent-1)]"
        />
      )}
    </motion.p>
  );
}

/** Accent-gradient text span (amber → coral). */
export function Accent({ children }: { children: ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent">
      {children}
    </span>
  );
}

/* ─── Slash rule ───
   The "////" divider line: an amber lead-in dissolving into the muted strip,
   one continuous texture whose pattern crawls with scroll position. */
export function SlashRule({ className = "", delay = 0.55 }: { className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      ref.current?.style.setProperty("--sp", `${(window.scrollY * 0.3).toFixed(1)}px 0`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [reduce]);

  return (
    <span ref={ref} aria-hidden className={`relative h-[9px] min-w-[40px] flex-1 ${className}`}>
      <motion.span
        className="slash-strip absolute inset-0 [background-position:var(--sp,0_0)]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.22 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay }}
      />
      <motion.span
        className="slash-strip-accent absolute left-0 top-0 h-full w-[72px] [background-position:var(--sp,0_0)] [-webkit-mask-image:linear-gradient(90deg,#000_25%,transparent)] [mask-image:linear-gradient(90deg,#000_25%,transparent)]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.9 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.5 }}
      />
    </span>
  );
}

/* ─── Register squares ───
   Tiny "status LED" chips: a = amber (blinking), c = coral, h = hatched,
   m = muted. The Endfield accent punctuation for eyebrows and labels. */
export type RegItem = "a" | "c" | "h" | "m";
export function Regs({ items = ["a", "h"], className = "" }: { items?: RegItem[]; className?: string }) {
  const cls: Record<RegItem, string> = {
    a: "bg-[var(--accent-1)] opacity-90 animate-regblink",
    c: "bg-[var(--accent-2)] opacity-55",
    h: "opacity-50 [background:repeating-linear-gradient(-45deg,var(--fg-3)_0_1.5px,transparent_1.5px_3.5px)]",
    m: "bg-[var(--fg-3)] opacity-30",
  };
  return (
    <span aria-hidden className={`inline-flex gap-1 ${className}`}>
      {items.map((t, i) => (
        <i key={i} className={`h-[7px] w-[7px] ${cls[t]}`} />
      ))}
    </span>
  );
}

/* ─── Eyebrow ───
   The `// 01 Label 漢字` line, staged: the `//` slides in from the left
   first, then the text follows letter by letter, the kanji last. */
export function Eyebrow({
  index,
  label,
  jp,
  regs,
  className = "",
}: {
  index?: string;
  label: string;
  jp?: string;
  regs?: RegItem[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const jpDelay = 0.32 + label.replace(/\s/g, "").length * 0.03 + 0.05;

  const base =
    "flex items-baseline gap-2.5 text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--accent-1)]";
  const idxCls = "tabular-nums tracking-[0.08em] text-[var(--fg-3)]";
  const jpCls = "jp text-[13px] font-medium normal-case tracking-[0.3em] text-[var(--fg-3)]";

  if (reduce) {
    return (
      <div className={`${base} ${className}`}>
        <span className="tracking-[0.02em]">{"//"}</span>
        {index && <span className={idxCls}>{index}</span>}
        <span>{label}</span>
        {jp && <span className={jpCls}>{jp}</span>}
        {regs && <Regs items={regs} className="self-center" />}
      </div>
    );
  }

  return (
    <motion.div
      className={`${base} ${className}`}
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.span
        className="tracking-[0.02em]"
        initial={{ opacity: 0, x: -18 }}
        animate={started ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        {"//"}
      </motion.span>
      {index && (
        <motion.span
          className={idxCls}
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ duration: 0.16, delay: 0.3 }}
        >
          {index}
        </motion.span>
      )}
      <LetterReveal as="span" text={label} y={0} duration={0.16} charDelay={0.03} baseDelay={0.32} />
      {jp && (
        <motion.span
          className={jpCls}
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: jpDelay }}
        >
          {jp}
        </motion.span>
      )}
      {regs && (
        <motion.span
          className="self-center"
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: jpDelay + 0.15 }}
        >
          <Regs items={regs} />
        </motion.span>
      )}
    </motion.div>
  );
}

/* ─── HUD corner brackets ───
   Amber top-left / muted bottom-right, framing a block of display text.
   The parent must be `relative`. */
export function Corners({ brBottom = "-0.5rem" }: { brBottom?: string }) {
  return (
    <>
      <span
        aria-hidden
        className="absolute -left-4 -top-3 h-5 w-5 border-l-[1.5px] border-t-[1.5px] border-[var(--accent-1)] opacity-85 max-sm:-left-2.5 max-sm:-top-2 max-sm:h-3.5 max-sm:w-3.5"
      />
      <span
        aria-hidden
        className="absolute -right-6 h-5 w-5 border-b-[1.5px] border-r-[1.5px] border-[var(--fg-3)] opacity-50 max-sm:-right-2.5 max-sm:h-3.5 max-sm:w-3.5"
        style={{ bottom: brBottom }}
      />
    </>
  );
}

/* ─── Registration plus mark (band corners) ─── */
export function PlusMark({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute h-3.5 w-3.5 opacity-30 ${className}`}>
      <span className="absolute bottom-0 left-1/2 top-0 w-[1.5px] -translate-x-1/2 bg-[var(--fg-3)]" />
      <span className="absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-[var(--fg-3)]" />
    </span>
  );
}

/* ─── Section kicker ───
   `// 01 About 紹介` eyebrow (slides in from the left), then the title
   revealing letter by letter beside a slash rule. Replaces SectionHeader. */
export function Kicker({
  index,
  label,
  jp,
  regs,
  title,
  className = "",
}: {
  index?: string;
  label: string;
  jp?: string;
  regs?: RegItem[];
  title: string;
  className?: string;
}) {
  return (
    <div className={`mb-11 ${className}`}>
      <Eyebrow index={index} label={label} jp={jp} regs={regs} className="mb-2" />
      <div className="flex items-center gap-6">
        <LetterReveal
          as="h2"
          text={title}
          baseDelay={0.55}
          className="text-[clamp(30px,5vw,44px)] font-black leading-[1.05] tracking-[-0.04em] text-[var(--fg)]"
        />
        <SlashRule delay={1} />
      </div>
    </div>
  );
}

/* ─── Page header (for sub-pages) ───
   Built on the same kicker language: back link, `// label 漢字` eyebrow,
   letter-revealed title beside a slash rule, then the description. */
export function PageHeader({
  title,
  subtitle,
  jp,
  description,
  onBack,
}: {
  title: string;
  subtitle: string;
  jp?: string;
  description: string;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto max-w-[720px] px-5 pb-12">
      <button
        onClick={onBack}
        className="mb-8 inline-flex cursor-pointer items-center gap-1.5 border-none bg-transparent font-[inherit] text-[13px] font-semibold text-[var(--fg-3)] outline-none transition-colors hover:text-[var(--accent-1)]"
      >
        ← Back
      </button>
      <Eyebrow label={subtitle} jp={jp} className="mb-2" />
      <div className="flex items-center gap-6">
        <LetterReveal
          as="h1"
          text={title}
          baseDelay={0.55}
          className="text-[clamp(36px,8vw,56px)] font-black leading-[1.05] tracking-display text-[var(--fg)]"
        />
        <SlashRule delay={1} />
      </div>
      <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-[var(--fg-2)]">
        {description}
      </p>
    </div>
  );
}
