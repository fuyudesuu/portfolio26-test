"use client";

import { FadeIn, SectionHeader } from "@/components/ui";

type AboutProps = {
  profile: {
    bio: string;
    skills: string[];
  };
  note: {
    content: string;
  };
};

export default function About({ profile, note }: AboutProps) {
  return (
    <section id="about" className="py-24 px-5">
      <SectionHeader title="About Me" subtitle="A little context" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[880px] mx-auto w-full">
        <FadeIn delay={0}>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-7 shadow-[0_4px_24px_var(--shadow)] transition-colors duration-400">
            <div className="w-[72px] h-[72px] rounded-[20px] bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-2)] flex items-center justify-center text-[32px] mb-5">🧑‍💻</div>
            <h3 className="text-lg font-bold text-[var(--fg)] mb-2.5">Who I am</h3>
            <p className="text-sm leading-relaxed text-[var(--fg-2)]">{profile.bio}</p>
          </div>
        </FadeIn>
        <FadeIn delay={1}>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-7 shadow-[0_4px_24px_var(--shadow)] transition-colors duration-400">
            <h3 className="text-lg font-bold text-[var(--fg)] mb-4">Skills &amp; tools</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((s) => (
                <span key={s} className="px-3.5 py-1.5 rounded-full text-[13px] font-medium bg-[rgba(232,148,58,0.08)] text-[var(--accent-1)] border border-[rgba(232,148,58,0.15)] transition-colors duration-400">{s}</span>
              ))}
            </div>
            {note.content && (
              <div className="p-3.5 rounded-[14px] bg-[var(--bg-2)] border border-[var(--border)] mt-4">
                <p className="text-[13px] text-[var(--fg-3)] leading-relaxed">{note.content}</p>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
