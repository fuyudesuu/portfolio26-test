"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Accent } from "@/components/ui";
import { TICKER_ITEMS, HERO_COORDS } from "@/lib/data";

type HeroProps = {
  profile: {
    name: string;
    eyebrow: string;
    tagline: string;
    kana: string;
  };
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export default function Hero({ profile }: HeroProps) {
  const [first, ...rest] = profile.name.split(" ");
  const surname = rest.join(" ");

  return (
    <section
      id="hero"
      className="relative flex h-[100svh] min-h-[680px] flex-col justify-center overflow-hidden pb-10 pt-[84px] sm:pb-24"
    >
      {/* soft radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-[44%] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--accent-1)_0%,transparent_70%)] opacity-[0.07]" />

      {/* left-margin measuring rail — ticks on a hairline in the page margin */}
      <div aria-hidden className="pointer-events-none absolute bottom-[28%] left-[26px] top-[24%] hidden w-3.5 min-[1000px]:block">
        <span className="absolute bottom-0 left-0 top-0 w-px bg-[var(--fg-3)] opacity-30" />
        <span className="absolute left-0 top-0 h-[1.5px] w-2 bg-[var(--fg-3)] opacity-50" />
        <span className="absolute left-0 top-[36%] h-[1.5px] w-2 bg-[var(--fg-3)] opacity-50" />
        <span className="absolute -left-[3px] top-[60%] h-[7px] w-[7px] bg-[var(--accent-1)] opacity-90" />
        <span className="absolute bottom-0 left-0 h-[1.5px] w-2 bg-[var(--fg-3)] opacity-50" />
      </div>

      {/* right-margin instrument column — the tategaki text is the anchor:
          a hairline drops from above, meets a node, the text, a closing tick */}
      {profile.kana && (
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-[34px] top-0 z-[1] hidden flex-col items-center justify-center gap-3.5 sm:flex">
          <span className="h-[88px] w-px bg-gradient-to-b from-transparent to-[var(--fg-3)] opacity-45" />
          <span className="h-[7px] w-[7px] bg-[var(--accent-1)] opacity-90" />
          <span className="jp select-none text-[12.5px] tracking-[0.34em] text-[var(--fg-3)] [text-orientation:mixed] [writing-mode:vertical-rl]">
            ものづくりが好きな開発者
          </span>
          <span className="h-[1.5px] w-3.5 bg-[var(--fg-3)] opacity-50" />
        </div>
      )}

      {/* engineered micro-caption, bottom-left */}
      <div aria-hidden className="pointer-events-none absolute bottom-[66px] left-[30px] z-[1] hidden select-none items-center gap-2.5 sm:flex">
        <span className="h-[9px] w-[34px] opacity-55 [background:repeating-linear-gradient(90deg,var(--fg-3)_0_2px,transparent_2px_5px)]" />
        <b className="whitespace-nowrap text-[10px] font-extrabold tracking-[0.2em] text-[var(--fg-3)]">{HERO_COORDS}</b>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1080px] px-7">
        <motion.p
          className="mb-[30px] text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--accent-1)]"
          {...fadeUp(0.1)}
        >
          <span className="mr-2 tracking-[0.02em]">{"//"}</span>
          {profile.eyebrow}
        </motion.p>

        {/* name block framed by HUD corner brackets */}
        <motion.div className="relative inline-block" {...fadeUp(0.2)}>
          <span aria-hidden className="absolute -left-4 -top-3 h-5 w-5 border-l-[1.5px] border-t-[1.5px] border-[var(--accent-1)] opacity-85" />
          <span aria-hidden className="absolute -right-6 bottom-5 h-5 w-5 border-b-[1.5px] border-r-[1.5px] border-[var(--fg-3)] opacity-50" />
          <h1 className="text-[clamp(52px,11vw,104px)] font-black leading-[0.95] tracking-[-0.05em] text-[var(--fg)]">
            {first}
            {surname && (
              <>
                <br />
                <Accent>{surname}</Accent>
              </>
            )}
          </h1>
        </motion.div>

        {profile.kana && (
          <motion.p aria-hidden className="jp mt-[18px] text-[13.5px] tracking-[0.42em] text-[var(--fg-3)]" {...fadeUp(0.3)}>
            {profile.kana}
          </motion.p>
        )}

        <motion.p
          className="mb-[34px] mt-[26px] max-w-[460px] text-[clamp(16px,2.4vw,20px)] leading-relaxed text-[var(--fg-2)]"
          {...fadeUp(0.4)}
        >
          {profile.tagline}
        </motion.p>

        <motion.div className="flex flex-wrap gap-3" {...fadeUp(0.55)}>
          <a
            href="#about"
            className="flex items-center gap-2 rounded-pill border-[1.5px] border-transparent bg-[var(--accent-1)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(232,148,58,0.3)] outline-none transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(232,148,58,0.4)]"
          >
            Explore my world <ArrowUpRight size={16} />
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-pill border-[1.5px] border-[var(--border)] bg-transparent px-7 py-3.5 text-sm font-semibold text-[var(--fg)] outline-none transition-all duration-250 hover:-translate-y-0.5 hover:border-[var(--fg-3)]"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* baseline ticker — hidden on phones where the bottom dock lives */}
      <div
        aria-hidden
        className="group absolute bottom-0 left-0 right-0 hidden overflow-hidden border-t border-[var(--border)] py-[15px] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] sm:block"
      >
        <div className="animate-ticker flex w-max group-hover:[animation-play-state:paused]">
          {[0, 1].map((lane) => (
            <span
              key={lane}
              className="inline-flex items-center gap-[26px] pr-[26px] text-[13px] font-semibold uppercase tracking-[0.10em] text-[var(--fg-3)]"
            >
              {TICKER_ITEMS.map((item, i) => (
                <span key={i} className="inline-flex items-center gap-[26px] whitespace-nowrap">
                  <span className={item.jp ? "jp normal-case tracking-[0.22em] text-[13.5px]" : undefined}>
                    {item.label}
                  </span>
                  <i className="not-italic text-[11px] font-extrabold tracking-[0.02em] text-[var(--accent-1)] opacity-80">
                    {"//"}
                  </i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
