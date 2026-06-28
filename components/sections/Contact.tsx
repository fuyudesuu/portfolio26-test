"use client";

import { Mail, ExternalLink, Link } from "lucide-react";
import { FadeIn, SectionHeader } from "@/components/ui";

const SOCIALS = [
  { icon: Mail, label: "Email", href: "mailto:hello@alexnguyen.dev" },
  { icon: ExternalLink, label: "GitHub", href: "#" },
  { icon: Link, label: "LinkedIn", href: "#" },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-5">
      <SectionHeader title="Get in Touch" subtitle="Let's build something together" />

      <FadeIn>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-9 max-w-[520px] mx-auto w-full shadow-[0_4px_24px_var(--shadow)] text-center transition-colors duration-400">
          <p className="text-sm leading-relaxed text-[var(--fg-2)] mb-6">
            Whether it&apos;s a collaboration, a speaking invite, or just a friendly
            hello — I&apos;d love to hear from you.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-pill bg-[var(--bg-2)] border border-[var(--border)] text-[var(--fg-2)] text-[13px] font-medium no-underline hover:text-[var(--accent-1)] hover:border-[var(--accent-1)] transition-all duration-250"
                >
                  <Icon size={16} /> {s.label}
                </a>
              );
            })}
          </div>
        </div>
      </FadeIn>

      <p className="text-center text-xs text-[var(--fg-3)] mt-16">
        Built with care · 2026
      </p>
    </section>
  );
}
