"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FadeIn, PageHeader } from "@/components/ui";
import { resolveIcon } from "@/lib/icons";
import { ACCENT_COLORS } from "@/lib/constants";

type HobbyData = {
  slug: string;
  title: string;
  iconName: string;
  accentIndex: number;
  summary: string;
  image: string;
  content: string;
};

export default function HobbiesPageClient({ hobbies }: { hobbies: HobbyData[] }) {
  const router = useRouter();

  return (
    <div className="pt-20 min-h-screen">
      <PageHeader title="Hobbies" subtitle="Things I do for fun" description="Beyond the screen, these are the things that keep me curious and energized." onBack={() => router.push("/")} />
      <div className="max-w-[720px] mx-auto px-5 pb-24 flex flex-col gap-6">
        {hobbies.map((h, i) => {
          const Icon = resolveIcon(h.iconName);
          const color = ACCENT_COLORS[h.accentIndex];
          return (
            <FadeIn key={h.slug} delay={i}>
              <div className="group relative rounded-card overflow-hidden">
                <div className="relative h-[200px] sm:h-[240px] overflow-hidden">
                  <Image src={h.image} alt={h.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 720px) 100vw, 720px" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: color }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4 z-10">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md bg-white/10 border border-white/20" style={{ color }}><Icon size={28} /></div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-0.5">{h.title}</h3>
                      <p className="text-[13px] text-white/60">{h.summary}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--bg-card)] border border-[var(--border)] border-t-0 rounded-b-card p-6 transition-colors duration-400">
                  <p className="text-sm leading-relaxed text-[var(--fg-2)]">{h.content}</p>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
