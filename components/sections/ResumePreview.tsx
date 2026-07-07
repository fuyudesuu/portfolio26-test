"use client";

import Link from "next/link";
import { Briefcase, GraduationCap, ArrowUpRight } from "lucide-react";
import { FadeIn, SectionHeader } from "@/components/ui";
import type { Resume } from "@/lib/content";

export default function ResumePreview({ resume }: { resume: Resume }) {
  const job = resume.experience[0];
  const edu = resume.education[0];
  const skillCount = resume.skills.reduce((n, c) => n + c.items.length, 0);

  return (
    <section id="resume-preview" className="py-20 px-5">
      <SectionHeader title="Résumé" subtitle="Experience & background" />
      <div className="max-w-[680px] mx-auto w-full">
        <FadeIn>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-7 shadow-[0_4px_24px_var(--shadow)] transition-colors duration-400 flex flex-col gap-5">
            {job && (
              <Row icon={<Briefcase size={16} />} label="Currently">
                <span className="font-semibold text-[var(--fg)]">{job.role}</span>
                <span className="text-[var(--fg-3)]"> · {job.company}</span>
              </Row>
            )}
            {edu && (
              <Row icon={<GraduationCap size={16} />} label="Studied">
                <span className="font-semibold text-[var(--fg)]">{edu.degree}</span>
                <span className="text-[var(--fg-3)]"> · {edu.school}</span>
              </Row>
            )}

            <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
              <p className="text-[13px] text-[var(--fg-3)]">
                {resume.experience.length} roles · {skillCount} skills · {resume.projects.length} projects
              </p>
              <Link
                href="/resume"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-pill text-sm font-semibold bg-[var(--fg)] text-[var(--bg)] no-underline hover:-translate-y-0.5 transition-transform duration-200"
              >
                View full résumé <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="flex items-center justify-center w-9 h-9 rounded-[11px] bg-[rgba(232,148,58,0.12)] text-[var(--accent-1)] flex-shrink-0">{icon}</span>
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--fg-3)]">{label}</span>
        <span className="text-[14.5px] leading-snug mt-0.5">{children}</span>
      </div>
    </div>
  );
}
