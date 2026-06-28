"use client";

import { useRouter } from "next/navigation";
import { FadeIn, PageHeader } from "@/components/ui";
import { HOBBIES, ACCENT_COLORS } from "@/lib/data";

export default function HobbiesPage() {
  const router = useRouter();

  return (
    <div className="pt-20 min-h-screen">
      <PageHeader
        title="Hobbies"
        subtitle="Things I do for fun"
        description="Beyond the screen, these are the things that keep me curious and energized."
        onBack={() => router.push("/")}
      />

      <div className="max-w-[720px] mx-auto px-5 pb-24 flex flex-col gap-5">
        {HOBBIES.map((h, i) => {
          const Icon = h.icon;
          const color = ACCENT_COLORS[h.accentIndex];
          return (
            <FadeIn key={h.title} delay={i}>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-7 pt-9 relative overflow-hidden transition-colors duration-400">
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-card"
                  style={{ background: color }}
                />
                <div className="flex items-center gap-5 max-sm:flex-col max-sm:items-start max-sm:gap-3">
                  <div
                    className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center flex-shrink-0 bg-[var(--bg-2)] transition-colors duration-400"
                    style={{ color }}
                  >
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--fg)] mb-1">{h.title}</h3>
                    <p className="text-[13px] leading-relaxed text-[var(--fg-3)]">{h.desc}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[var(--fg-2)] mt-4">{h.long}</p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
