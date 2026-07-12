"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn, Kicker, PlusMark } from "@/components/ui";
import type { Resume } from "@/lib/content";

const MAX_STOPS = 3;
const MAX_CHIPS = 5;

export default function ResumePreview({ resume }: { resume: Resume }) {
  // resume.md lists newest-first; the career line reads oldest → newest
  const stops = resume.experience.slice(0, MAX_STOPS).reverse();
  const skills = resume.skills.flatMap((c) => c.items);
  const chips = skills.slice(0, MAX_CHIPS);
  const moreSkills = skills.length - chips.length;

  return (
    <section
      id="resume-preview"
      className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--bg-2)] px-5 py-[104px]"
    >
      <div aria-hidden className="hatch pointer-events-none absolute inset-0" />
      <PlusMark className="left-[22px] top-[22px]" />
      <PlusMark className="right-[22px] top-[22px]" />

      <div className="relative mx-auto w-full max-w-[1080px] px-0 sm:px-2">
        <Kicker index="02" label="Résumé" jp="経歴" title="The road so far" />

        {/* career line — horizontal on desktop, vertical rail on mobile */}
        <FadeIn>
          <div className="relative mb-11 mt-14">
            <div aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-0.5 bg-[var(--border)] md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--accent-1)] opacity-55" />
            </div>
            <div aria-hidden className="absolute bottom-0 left-[7px] top-0 w-0.5 bg-[var(--border)] md:hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent-1)] opacity-55" />
            </div>

            <div className="relative grid grid-cols-1 gap-[30px] md:grid-cols-3 md:gap-6">
              {stops.map((job, i) => {
                const current = i === stops.length - 1;
                return (
                  <div key={job.role + job.company} className="grid grid-cols-[15px_1fr] gap-x-[18px] md:block">
                    <div
                      className={`relative mt-[3px] h-[15px] w-[15px] md:mb-[18px] md:mt-0 ${
                        current
                          ? "border-[3px] border-[var(--accent-1)] bg-[var(--accent-1)]"
                          : "border-[3px] border-[var(--fg-3)] bg-[var(--bg)]"
                      }`}
                    >
                      {current && (
                        <span aria-hidden className="absolute -inset-[7px] animate-ping border-2 border-[var(--accent-1)] opacity-30" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`mb-1.5 text-[11.5px] font-extrabold uppercase tabular-nums tracking-[0.12em] ${
                          current ? "text-[var(--accent-1)]" : "text-[var(--fg-3)]"
                        }`}
                      >
                        {job.start} – {job.end}
                        {current && <span aria-hidden className="hazard-strip mt-[5px] block h-1.5 w-[42px] opacity-70" />}
                      </div>
                      <div className="text-[16.5px] font-extrabold leading-[1.3] tracking-[-0.02em] text-[var(--fg)]">
                        {job.role}
                      </div>
                      <div className="mt-0.5 text-sm text-[var(--fg-2)]">
                        {job.company}
                        {job.location && ` · ${job.location.split(",")[0]}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={1}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              {chips.map((s) => (
                <span
                  key={s}
                  className="rounded-pill border border-[var(--border)] bg-[var(--bg-card)] px-3.5 py-[7px] text-[12.5px] font-bold text-[var(--fg-2)]"
                >
                  {s}
                </span>
              ))}
              {moreSkills > 0 && (
                <span className="rounded-pill border border-[var(--border)] bg-[var(--bg-card)] px-3.5 py-[7px] text-[12.5px] font-bold text-[var(--fg-2)]">
                  + {moreSkills} more
                </span>
              )}
            </div>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-pill bg-[var(--fg)] px-[26px] py-[13px] text-sm font-bold text-[var(--bg)] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_var(--shadow)]"
            >
              View full résumé <ArrowUpRight size={15} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
