"use client";

import { FadeIn, Kicker, Typewriter, Corners } from "@/components/ui";
import type { AboutFact } from "@/lib/content";

type AboutProps = {
  profile: {
    name: string;
    title: string;
    bio: string;
    statement: string;
    location: string;
    facts: AboutFact[];
  };
  note: {
    content: string;
  };
};

export default function About({ profile, note }: AboutProps) {
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <section id="about" className="px-5 pb-[104px] pt-[120px]">
      <div className="mx-auto w-full max-w-[1080px] px-0 sm:px-2">
        <Kicker index="01" label="About" jp="紹介" regs={["a", "h"]} title="Who I am" />

        {/* big statement typed out, framed by corner brackets; width hugs the
            text so the closing bracket sits on the last line */}
        {profile.statement && (
          <div className="relative mb-14 mt-3 w-fit">
            <Corners brBottom="0.375rem" />
            <Typewriter
              text={profile.statement}
              className="max-w-[26ch] text-[clamp(24px,4.4vw,40px)] font-extrabold leading-[1.3] tracking-[-0.03em] text-[var(--fg)]"
            />
          </div>
        )}

        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
          {/* bio */}
          <FadeIn>
            <div className="h-full rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-[30px] shadow-[0_4px_24px_var(--shadow)] transition-colors duration-400 max-lg:sm:col-span-2">
              <div className="mb-5 flex items-center gap-4">
                <div className="grid h-[60px] w-[60px] flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-2)] text-[22px] font-black tracking-[-0.02em] text-white">
                  {initials}
                </div>
                <div>
                  <b className="block text-lg font-extrabold tracking-[-0.02em] text-[var(--fg)]">{profile.name}</b>
                  <span className="text-[13px] text-[var(--fg-3)]">
                    {profile.title}
                    {profile.location && ` · ${profile.location.split(",")[0]}`}
                  </span>
                </div>
              </div>
              <p className="max-w-[56ch] text-[15px] leading-relaxed text-[var(--fg-2)]">{profile.bio}</p>
            </div>
          </FadeIn>

          {/* right now */}
          {note.content && (
            <FadeIn delay={1}>
              <div className="relative h-full overflow-hidden rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-[26px] pl-[30px] shadow-[0_4px_24px_var(--shadow)] transition-colors duration-400">
                <span aria-hidden className="slash-strip-accent absolute bottom-0 left-0 top-0 w-[5px] opacity-60" />
                <span className="mb-2.5 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent-1)]">
                  <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[var(--accent-1)]" />
                  Right now
                </span>
                <p className="text-[14.5px] leading-relaxed text-[var(--fg-2)]">{note.content}</p>
              </div>
            </FadeIn>
          )}

          {/* facts */}
          {profile.facts.length > 0 && (
            <FadeIn delay={2}>
              <div className="flex h-full flex-col justify-center rounded-card border border-[var(--border)] bg-[var(--bg-card)] px-[26px] py-2 shadow-[0_4px_24px_var(--shadow)] transition-colors duration-400">
                {profile.facts.map((f, i) => (
                  <div
                    key={f.label}
                    className={`flex items-baseline justify-between gap-3.5 py-3.5 text-sm ${i > 0 ? "border-t border-[var(--border)]" : ""}`}
                  >
                    <span className="whitespace-nowrap text-[11.5px] font-bold uppercase tracking-[0.1em] text-[var(--fg-3)]">
                      {f.label}
                    </span>
                    <span className="text-right font-bold text-[var(--fg)]">{f.value}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
