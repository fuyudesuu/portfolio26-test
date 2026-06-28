"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import { FadeIn, PageHeader } from "@/components/ui";
import { EVENTS, EVENT_BADGE_CONFIG, ACCENT_COLORS } from "@/lib/data";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "speaker", label: "Speaking" },
  { key: "organizer", label: "Organizing" },
  { key: "attendee", label: "Attending" },
];

export default function EventsPage() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? EVENTS
      : EVENTS.filter((ev) => ev.type === filter);

  return (
    <div className="pt-20 min-h-screen">
      <PageHeader
        title="Events"
        subtitle="Speaking, organizing & attending"
        description="A timeline of conferences, meetups, and hackathons I've been part of."
        onBack={() => router.push("/")}
      />

      <div className="max-w-[720px] mx-auto px-5 pb-24">
        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setExpanded(null); }}
              className={`
                px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer outline-none
                border-[1.5px] transition-all duration-200 font-[inherit]
                ${filter === f.key
                  ? "bg-[var(--accent-1)] text-white border-[var(--accent-1)]"
                  : "bg-transparent text-[var(--fg-2)] border-[var(--border)] hover:border-[var(--fg-3)]"
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[var(--border)] rounded-sm" />

          <div className="flex flex-col gap-5">
            {filtered.map((ev, i) => {
              const badge = EVENT_BADGE_CONFIG[ev.type];
              const color = ACCENT_COLORS[badge.accentIndex];
              const isOpen = expanded === ev.id;

              return (
                <FadeIn key={ev.id} delay={i} direction="left">
                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="w-7 min-w-[28px] flex flex-col items-center pt-8 relative z-10">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: color,
                          boxShadow: `0 0 12px ${color}44`,
                        }}
                      />
                    </div>

                    {/* Card */}
                    <div
                      className={`
                        flex-1 min-w-0 bg-[var(--bg-card)] border border-[var(--border)] rounded-card
                        p-7 pl-8 cursor-pointer transition-all duration-300
                        ${isOpen
                          ? "shadow-[0_8px_32px_var(--shadow)]"
                          : "hover:shadow-[0_6px_24px_var(--shadow)]"
                        }
                      `}
                      onClick={() => setExpanded(isOpen ? null : ev.id)}
                    >
                      {/* Meta */}
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

                      {/* Expanded details */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="h-px bg-[var(--border)] my-4" />
                            <p className="text-sm leading-relaxed text-[var(--fg-2)]">{ev.long}</p>
                            {ev.tags.length > 0 && (
                              <div className="flex gap-2 flex-wrap mt-3.5">
                                {ev.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-2)] text-[var(--fg-2)] border border-[var(--border)]"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Expand hint */}
                      <div className="flex items-center justify-between mt-3.5 pt-2">
                        <span className="text-[13px] text-[var(--fg-3)]">
                          {isOpen ? "Click to collapse" : "Click to expand"}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown size={14} className="text-[var(--fg-3)]" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
