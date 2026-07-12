"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/ui";
import { EVENT_BADGE_CONFIG, ACCENT_COLORS, formatEventDate } from "@/lib/constants";
import type { EventType } from "@/lib/constants";

type EventData = {
  slug: string;
  title: string;
  date: string;
  location: string;
  type: EventType;
  tags: string[];
  summary: string;
  content: string;
};

export default function EventsPreview({ events }: { events: EventData[] }) {
  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className="text-[19px] font-extrabold tracking-[-0.02em] text-[var(--fg)]">Events</h3>
        <Link href="/events" className="inline-flex items-center gap-1 text-[13.5px] font-bold text-[var(--accent-1)] no-underline transition-all hover:gap-2">
          View all <ChevronRight size={14} />
        </Link>
      </div>
      <div className="relative">
        {/* slash rail behind the square timeline dots */}
        <div aria-hidden className="slash-strip absolute bottom-6 left-[2px] top-6 w-1.5 opacity-35" />
        <div className="flex flex-col">
          {events.map((ev, i) => {
            const badge = EVENT_BADGE_CONFIG[ev.type];
            const color = ACCENT_COLORS[badge.accentIndex];
            return (
              <FadeIn key={ev.slug} delay={i * 1.7} direction="down">
                <div className="relative py-[18px] pl-[26px]">
                  <span aria-hidden className="absolute left-0 top-6 h-2.5 w-2.5" style={{ background: color }} />
                  <div className="mb-1 flex flex-wrap items-center gap-2.5 text-xs font-bold uppercase tabular-nums tracking-[0.08em] text-[var(--fg-3)]">
                    <span className="rounded-pill border px-2.5 py-[2.5px] tracking-[0.06em]" style={{ color, borderColor: "currentcolor" }}>
                      {badge.label}
                      <span className="jp ml-1.5 text-[11.5px] normal-case tracking-[0.12em]">{badge.jp}</span>
                    </span>
                    <span>{formatEventDate(ev.date)}</span>
                  </div>
                  <h4 className="text-base font-extrabold tracking-[-0.02em] text-[var(--fg)]">{ev.title}</h4>
                  <p className="text-[13px] text-[var(--fg-2)]">{ev.location}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
