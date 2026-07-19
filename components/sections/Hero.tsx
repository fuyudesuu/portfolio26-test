"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Regs } from "@/components/ui";
import { TICKER_ITEMS, HERO_COORDS } from "@/lib/data";

type HeroProps = {
  profile: {
    name: string;
    eyebrow: string;
    tagline: string;
    kana: string;
  };
};

const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export default function Hero({ profile }: HeroProps) {
  const reduce = useReducedMotion();
  const [first, ...rest] = profile.name.split(" ");
  const surname = rest.join(" ");
  const [coordA, coordB] = HERO_COORDS.split("//").map((s) => s.trim());

  // staged fade helper for the lockup; reduced motion renders the final state
  const st = (delay: number, from: Record<string, number | string> = { opacity: 0 }, to: Record<string, number | string> = { opacity: 1 }) =>
    reduce ? {} : { initial: from, animate: to, transition: { duration: 0.5, delay, ease: EASE } };

  return (
    <section
      id="hero"
      className="relative flex h-[100svh] min-h-[680px] flex-col justify-center overflow-hidden pb-[150px] pt-[84px] sm:pb-24"
    >
      {/* soft radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-[44%] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--accent-1)_0%,transparent_70%)] opacity-[0.07]" />

      {/* right-margin instrument column — hairline, node, tategaki text,
          closing tick, then marching chevrons as the scroll cue */}
      {profile.kana && (
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-[34px] top-0 z-[1] hidden flex-col items-center justify-center gap-3.5 sm:flex">
          <span className="h-[88px] w-px bg-gradient-to-b from-transparent to-[var(--fg-3)] opacity-45" />
          <span className="h-[7px] w-[7px] bg-[var(--accent-1)] opacity-90" />
          <span className="jp select-none text-[12.5px] tracking-[0.34em] text-[var(--fg-3)] [text-orientation:mixed] [writing-mode:vertical-rl]">
            ものづくりが好きな開発者
          </span>
          <span className="h-[1.5px] w-3.5 bg-[var(--fg-3)] opacity-50" />
          <span className="flex flex-col items-center gap-[3px]">
            {[0, 1, 2].map((i) => (
              <i
                key={i}
                className="animate-march h-[9px] w-[9px] rotate-45 border-b-[1.5px] border-r-[1.5px] border-[var(--accent-1)] opacity-20"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </span>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1080px] px-7">
        <motion.p
          className="mb-[26px] text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--accent-1)]"
          {...fadeUp(0.1)}
        >
          <span className="mr-2 tracking-[0.02em]">{"//"}</span>
          {profile.eyebrow}
          <Regs items={["a", "h", "c"]} className="ml-3 align-baseline" />
        </motion.p>

        {/* ── ID-plate name lockup: machined spine + plate header + offset
            name with ghost echo + measured baseline + integrated fields.
            The kana and coordinates are structural fields of the plate. ── */}
        <div className="grid w-max max-w-full grid-cols-[34px_auto] gap-x-5 max-[520px]:grid-cols-[22px_auto] max-[520px]:gap-x-3.5">
          {/* spine */}
          <div aria-hidden className="relative">
            <motion.span
              className="absolute bottom-0 left-1/2 top-0 w-px origin-top opacity-40"
              style={{ background: "linear-gradient(to bottom, var(--fg-3) 0%, var(--fg-3) 78%, transparent 100%)" }}
              {...st(0, { scaleY: 0 }, { scaleY: 1 })}
            />
            <motion.span
              className="absolute left-[calc(50%-3.5px)] top-1 h-[7px] w-[7px] bg-[var(--accent-1)]"
              {...st(0.15, { opacity: 0 }, { opacity: 0.9 })}
            />
            <motion.span
              className="absolute bottom-[24%] left-[calc(50%-5px)] h-[1.5px] w-2.5 bg-[var(--fg-3)]"
              {...st(0.2, { opacity: 0 }, { opacity: 0.5 })}
            />
            <motion.span
              className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap text-[10px] font-extrabold tracking-[0.28em] text-[var(--fg-3)] [text-orientation:mixed] [writing-mode:vertical-rl] max-[520px]:text-[9px] max-[520px]:tracking-[0.22em]"
              {...st(0.95)}
            >
              CLASS A <b className="font-extrabold text-[var(--accent-1)]">{"//"}</b> REV.03
            </motion.span>
          </div>

          <div>
            {/* plate header */}
            <div aria-hidden className="mb-4 flex min-h-3 flex-wrap items-center gap-2.5">
              <motion.span className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--fg-3)]" {...st(0.12, { opacity: 0, x: -8 }, { opacity: 1, x: 0 })}>
                <i className="mr-1.5 not-italic text-[var(--accent-1)]">{"//"}</i>IDENT
              </motion.span>
              <motion.span className="slash-strip h-[9px] w-[42px]" {...st(0.18, { opacity: 0, x: -8 }, { opacity: 0.6, x: 0 })} />
              <motion.span {...st(0.24, { opacity: 0, x: -8 }, { opacity: 1, x: 0 })}>
                <Regs items={["a", "c", "h"]} />
              </motion.span>
              <motion.span className="whitespace-nowrap text-[10.5px] font-extrabold tracking-[0.16em] text-[var(--fg-3)]" {...st(0.3, { opacity: 0, x: -8 }, { opacity: 1, x: 0 })}>
                № JS-2601
              </motion.span>
            </div>

            {/* the name — surname on an offset baseline with a ghost echo */}
            <h1 className="relative m-0 text-[clamp(52px,11vw,104px)] font-black leading-[0.9] tracking-[-0.05em] text-[var(--fg)]" aria-label={profile.name}>
              <motion.span
                className="block"
                {...st(0.3, { opacity: 0, y: "0.12em", clipPath: "inset(0 0 105% 0)" }, { opacity: 1, y: 0, clipPath: "inset(-15% 0 -15% 0)" })}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              >
                {first}
              </motion.span>
              {surname && (
                <motion.span
                  className="relative ml-[0.44em] block w-max bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] bg-clip-text text-transparent"
                  {...st(0.45, { opacity: 0, y: "0.12em", clipPath: "inset(0 0 105% 0)" }, { opacity: 1, y: 0, clipPath: "inset(-15% 0 -15% 0)" })}
                  transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
                >
                  {surname}
                  <motion.span
                    aria-hidden
                    className="absolute left-0 top-0 -z-10 translate-x-[-0.06em] translate-y-[0.05em] text-transparent [-webkit-text-stroke:1.2px_var(--fg-3)]"
                    {...st(0.75, { opacity: 0 }, { opacity: 0.28 })}
                  >
                    {surname}
                  </motion.span>
                </motion.span>
              )}
            </h1>

            {/* measured baseline */}
            <div aria-hidden className="relative ml-[0.44em] mt-3 h-2 w-full">
              <motion.span className="absolute left-0 top-0 h-2 w-[1.5px] bg-[var(--accent-1)]" {...st(1, { opacity: 0 }, { opacity: 0.85 })} />
              <motion.span className="absolute inset-x-0 top-[3px] h-[1.5px] origin-left bg-[var(--accent-1)] opacity-85" {...st(0.85, { scaleX: 0 }, { scaleX: 1 })} transition={{ duration: 0.6, delay: 0.85, ease: EASE }} />
              <motion.span className="absolute right-0 top-0 h-2 w-[1.5px] bg-[var(--accent-1)]" {...st(1, { opacity: 0 }, { opacity: 0.85 })} />
            </div>

            {/* integrated bilingual + coordinate fields */}
            <div className="mb-[26px] ml-[0.44em] mt-3.5 flex flex-wrap items-baseline gap-[18px] max-[520px]:gap-3">
              {profile.kana && (
                <motion.span className="inline-flex items-baseline gap-2" {...st(1.05)}>
                  <span className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--fg-3)]">読み</span>
                  <span className="jp text-sm tracking-[0.34em] text-[var(--fg-2)]">{profile.kana}</span>
                </motion.span>
              )}
              <motion.span className="whitespace-nowrap text-[10.5px] font-extrabold tracking-[0.14em] text-[var(--fg-3)]" {...st(1.05)}>
                {coordA}
                <i className="mx-1 not-italic text-[var(--accent-1)]">{"//"}</i>
                {coordB}
              </motion.span>
            </div>
          </div>
        </div>

        <motion.p
          className="mb-[34px] max-w-[460px] text-[clamp(16px,2.4vw,20px)] leading-relaxed text-[var(--fg-2)]"
          {...fadeUp(0.4)}
        >
          {profile.tagline}
        </motion.p>

        {/* matched CTA pair: identical box + min-width, content centered */}
        <motion.div className="flex flex-wrap gap-3" {...fadeUp(0.55)}>
          <a
            href="#about"
            className="flex min-w-[220px] items-center justify-center gap-2 rounded-pill border-[1.5px] border-transparent bg-[var(--accent-1)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(232,148,58,0.3)] outline-none transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(232,148,58,0.4)]"
          >
            Explore my world <ArrowUpRight size={16} />
          </a>
          <a
            href="#contact"
            className="flex min-w-[220px] items-center justify-center gap-2 rounded-pill border-[1.5px] border-[var(--border)] bg-transparent px-7 py-3.5 text-sm font-semibold text-[var(--fg)] outline-none transition-all duration-250 hover:-translate-y-0.5 hover:border-[var(--fg-3)]"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* baseline ticker — on phones it rides above the floating bottom dock
          (fixed bottom-4, ~56px tall), on larger screens it sits at the base */}
      <div
        aria-hidden
        className="group absolute bottom-[84px] left-0 right-0 overflow-hidden border-t border-[var(--border)] py-[15px] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] sm:bottom-0"
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
