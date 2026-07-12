"use client";

import { Mail, ExternalLink, Link as LinkIcon } from "lucide-react";
import { FadeIn, Accent, PlusMark } from "@/components/ui";

const EMAIL = "hello@alexnguyen.dev";

const SOCIALS = [
  { icon: ExternalLink, label: "GitHub", href: "#" },
  { icon: LinkIcon, label: "LinkedIn", href: "#" },
  { icon: Mail, label: "Email", href: `mailto:${EMAIL}` },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg-2)] px-5 pb-14 pt-[130px]"
    >
      <PlusMark className="left-[22px] top-[22px]" />

      {/* right-edge detail column — plus, node, slashes on one axis */}
      <div aria-hidden className="pointer-events-none absolute right-[22px] top-[22px] hidden w-3.5 sm:block">
        <PlusMark className="left-0 top-0" />
        <span className="absolute left-[2px] top-[46px] h-[9px] w-[9px] rotate-45 bg-[var(--accent-2)] opacity-50" />
        <span className="absolute left-[3px] top-[84px] h-10 w-2 opacity-35 [background:repeating-linear-gradient(25deg,var(--fg-3)_0_1.5px,transparent_1.5px_7px)]" />
      </div>

      {/* EOF micro-caption above the footer */}
      <div aria-hidden className="pointer-events-none absolute bottom-[104px] right-7 hidden select-none items-center gap-2.5 sm:flex">
        <b className="whitespace-nowrap text-[10px] font-extrabold tracking-[0.2em] text-[var(--fg-3)]">
          EOF&ensp;{"//"}&ensp;<span className="jp tracking-[0.3em]">おわり</span>
        </b>
        <span className="h-[9px] w-[34px] opacity-55 [background:repeating-linear-gradient(90deg,var(--fg-3)_0_2px,transparent_2px_5px)]" />
      </div>

      <div className="mx-auto w-full max-w-[1080px] px-0 sm:px-2">
        <FadeIn>
          <div className="mb-4 flex items-baseline gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-1)]">
            <span className="tracking-[0.02em]">{"//"}</span>
            <span className="tabular-nums tracking-[0.08em] text-[var(--fg-3)]">04</span>
            <span>Contact</span>
            <span className="jp text-[13px] font-medium normal-case tracking-[0.3em] text-[var(--fg-3)]">連絡</span>
          </div>

          <h2 className="mb-[30px] max-w-[14ch] text-[clamp(38px,7.5vw,72px)] font-black leading-[1.02] tracking-[-0.045em] text-[var(--fg)] [text-wrap:balance]">
            Let&apos;s make something <Accent>warm.</Accent>
          </h2>

          <a
            href={`mailto:${EMAIL}`}
            className="group relative mb-9 inline-block text-[clamp(18px,3.4vw,30px)] font-extrabold tracking-[-0.02em] text-[var(--fg)] no-underline"
          >
            {EMAIL}
            <span
              aria-hidden
              className="absolute -bottom-[5px] left-0 h-[3px] w-full origin-left scale-x-[0.25] bg-[var(--accent-1)] transition-transform duration-300 group-hover:scale-x-100"
            />
          </a>

          <div className="mb-[74px] flex flex-wrap gap-2.5">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-pill border border-[var(--border)] bg-[var(--bg-card)] px-5 py-[11px] text-sm font-bold text-[var(--fg-2)] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-1)] hover:text-[var(--accent-1)]"
                >
                  <Icon size={16} /> {s.label}
                </a>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[var(--border)] pt-[22px] text-[12.5px] text-[var(--fg-3)]">
            <span className="whitespace-nowrap">Built with care · 2026</span>
            <span className="whitespace-nowrap">
              Sydney, Australia <span className="jp">シドニーより</span>
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
