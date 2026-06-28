"use client";

import Link from "next/link";
import Image from "next/image";
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
                <div className="group relative rounded-card overflow-hidden h-[280px] cursor-pointer">
                  {/* Background image */}
                  <Image
                    src={h.image}
                    alt={h.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 350px"
                    unoptimized
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-opacity duration-300" />

                  {/* Accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 z-10"
                    style={{ background: color }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 backdrop-blur-md bg-white/10 border border-white/20"
                      style={{ color }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{h.title}</h3>
                    <p className="text-[13px] leading-relaxed text-white/60">{h.desc}</p>
                  </div>
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
