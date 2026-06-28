"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FadeIn, TiltCard, SectionHeader } from "@/components/ui";
import { HOBBIES, ACCENT_COLORS } from "@/lib/data";

export default function HobbiesPreview() {
  return (
    <section id="hobbies-preview" className="py-20 px-5">
      <SectionHeader title="Hobbies" subtitle="Things I do for fun" />

      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 max-w-[700px] mx-auto w-full">
        {HOBBIES.slice(0, 2).map((h, i) => {
          const Icon = h.icon;
          const color = ACCENT_COLORS[h.accentIndex];
          return (
            <FadeIn key={h.title} delay={i}>
              <TiltCard>
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card pt-8 pb-7 px-7 relative overflow-hidden transition-colors duration-400">
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-card" style={{ background: color }} />
                  <div
                    className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-4 bg-[var(--bg-2)] transition-colors duration-400"
                    style={{ color }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--fg)] mb-2">{h.title}</h3>
                  <p className="text-[13px] leading-relaxed text-[var(--fg-3)]">{h.desc}</p>
                </div>
              </TiltCard>
            </FadeIn>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/hobbies"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill text-sm font-semibold bg-transparent text-[var(--fg)] border-[1.5px] border-[var(--border)] hover:border-[var(--fg-3)] hover:-translate-y-0.5 transition-all duration-250 no-underline"
        >
          View all hobbies <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}
