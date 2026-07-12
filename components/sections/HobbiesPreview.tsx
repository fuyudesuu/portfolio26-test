"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { FadeIn, TiltCard } from "@/components/ui";
import { resolveIcon } from "@/lib/icons";
import { ACCENT_COLORS } from "@/lib/constants";

type HobbyData = {
  slug: string;
  title: string;
  iconName: string;
  accentIndex: number;
  summary: string;
  image: string;
  kanjiTag: string;
};

export default function HobbiesPreview({ hobbies }: { hobbies: HobbyData[] }) {
  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className="text-[19px] font-extrabold tracking-[-0.02em] text-[var(--fg)]">Hobbies</h3>
        <Link href="/hobbies" className="inline-flex items-center gap-1 text-[13.5px] font-bold text-[var(--accent-1)] no-underline transition-all hover:gap-2">
          View all <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
        {hobbies.map((h, i) => {
          const Icon = resolveIcon(h.iconName);
          const color = ACCENT_COLORS[h.accentIndex];
          const offset = i % 2 === 1;
          return (
            <FadeIn key={h.slug} delay={i}>
              <TiltCard>
                {/* collage offset: odd tiles sit lower and slightly shorter.
                    The rounded clip lives on its own compositing layer so the
                    zoomed image can't leak past the radius while tilted. */}
                <div
                  className={`group relative cursor-pointer overflow-hidden rounded-card isolate [transform:translateZ(0)] ${
                    offset ? "h-[300px] min-[561px]:mt-11" : "h-[330px]"
                  }`}
                >
                  <Image
                    src={h.image}
                    alt={h.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 350px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />
                  {h.kanjiTag && (
                    <span
                      aria-hidden
                      className="jp absolute left-4 top-4 z-10 text-[13px] tracking-[0.32em] text-white/85 [text-orientation:mixed] [text-shadow:0_1px_6px_rgba(0,0,0,0.4)] [writing-mode:vertical-rl]"
                    >
                      {h.kanjiTag}
                    </span>
                  )}
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-[22px]">
                    <div className="mb-3 flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-white/25 bg-white/15 backdrop-blur-md" style={{ color }}>
                      <Icon size={18} />
                    </div>
                    <h4 className="mb-1 text-lg font-extrabold tracking-[-0.02em] text-white">{h.title}</h4>
                    <p className="text-[13px] leading-relaxed text-white/70">{h.summary}</p>
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
