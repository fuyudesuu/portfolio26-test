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
};

export default function HobbiesPreview({ hobbies }: { hobbies: HobbyData[] }) {
  return (
    <div>
      <div className="flex items-end justify-between max-w-[700px] mx-auto w-full mb-5">
        <h3 className="text-xl font-bold text-[var(--fg)]">Hobbies</h3>
        <Link href="/hobbies" className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--accent-1)] no-underline hover:gap-2 transition-all">
          View all <ChevronRight size={15} />
        </Link>
      </div>
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 max-w-[700px] mx-auto w-full">
        {hobbies.map((h, i) => {
          const Icon = resolveIcon(h.iconName);
          const color = ACCENT_COLORS[h.accentIndex];
          return (
            <FadeIn key={h.slug} delay={i}>
              <TiltCard>
                <div className="group relative rounded-card overflow-hidden h-[280px] cursor-pointer">
                  <Image src={h.image} alt={h.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 350px" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-opacity duration-300" />
                  <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: color }} />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 backdrop-blur-md bg-white/10 border border-white/20" style={{ color }}>
                      <Icon size={22} />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{h.title}</h4>
                    <p className="text-[13px] leading-relaxed text-white/60">{h.summary}</p>
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
