"use client";

import Link from "next/link";
import { ChevronRight, MapPin, Clock } from "lucide-react";
import { FadeIn, SectionHeader } from "@/components/ui";
import { EVENTS, EVENT_BADGE_CONFIG, ACCENT_COLORS } from "@/lib/data";

export default function EventsPreview() {
  return (
    <section id="events-preview" className="py-20 px-5">
      <SectionHeader title="Events" subtitle="Speaking, organizing & attending" />

      <div className="max-w-[640px] mx-auto w-full flex flex-col gap-3.5">
        {EVENTS.slice(0, 3).map((ev, i) => {
          const badge = EVENT_BADGE_CONFIG[ev.type];
          const color = ACCENT_COLORS[badge.accentIndex];
          return (
            <FadeIn key={ev.id} delay={i} direction="left">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-7 pl-10 relative overflow-hidden transition-colors duration-400">
                <div
                  className="absolute left-0 top-7 w-1 rounded-sm"
                  style={{ background: "var(--border)", height: "calc(100% - 56px)" }}
                />
                <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full border-[1.5px] bg-transparent"
                    style={{ color, borderColor: color }}
                  >
                    {badge.label}
                  </span>
                  <span className="text-xs text-[var(--fg-3)] flex items-center gap-1">
                    <Clock size={12} /> {ev.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--fg)] mb-1.5">{ev.title}</h3>
                <p className="text-[13px] text-[var(--fg-3)] mb-1.5 flex items-center gap-1.5">
                  <MapPin size={13} /> {ev.location}
                </p>
                <p className="text-[13px] leading-relaxed text-[var(--fg-3)]">{ev.desc}</p>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill text-sm font-semibold bg-transparent text-[var(--fg)] border-[1.5px] border-[var(--border)] hover:border-[var(--fg-3)] hover:-translate-y-0.5 transition-all duration-250 no-underline"
        >
          View all events <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}
