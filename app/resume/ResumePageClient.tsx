"use client";

import { useRouter } from "next/navigation";
import { Briefcase, GraduationCap, Wrench, FolderGit2, MapPin, ArrowUpRight } from "lucide-react";
import { FadeIn, PageHeader } from "@/components/ui";
import type { Resume } from "@/lib/content";

const CAT_COLORS = ["var(--accent-1)", "var(--accent-2)", "var(--accent-3)"];

export default function ResumePageClient({ resume }: { resume: Resume }) {
  const router = useRouter();

  return (
    <div className="pt-20 min-h-screen">
      <PageHeader
        title={resume.title || "Resume"}
        subtitle={resume.subtitle || "Curriculum vitae"}
        jp="経歴"
        description={resume.intro}
        onBack={() => router.push("/")}
      />

      <div className="max-w-[760px] mx-auto px-5 pb-24 flex flex-col gap-14">
        {/* Experience */}
        {resume.experience.length > 0 && (
          <section>
            <SectionTitle icon={<Briefcase size={15} />} label="Work Experience" />
            <div className="flex flex-col gap-4">
              {resume.experience.map((job, i) => (
                <FadeIn key={job.role + job.company} delay={i} direction="left">
                  <article className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-6 sm:p-7 transition-colors duration-400">
                    <div className="flex justify-between items-baseline gap-4 flex-wrap">
                      <div>
                        <h3 className="text-[17px] font-bold text-[var(--fg)]">{job.role}</h3>
                        <p className="text-[14.5px] font-semibold text-[var(--accent-1)] mt-0.5">
                          {job.company}
                          {job.location && <span className="text-[var(--fg-3)] font-normal"> · {job.location}</span>}
                        </p>
                      </div>
                      <span className="text-[12.5px] text-[var(--fg-3)] tabular-nums whitespace-nowrap">
                        {job.start} — {job.end}
                      </span>
                    </div>
                    {job.bullets.length > 0 && (
                      <ul className="mt-3.5 pl-4 flex flex-col gap-1.5 text-[14px] text-[var(--fg-2)] leading-relaxed list-disc marker:text-[var(--fg-3)]">
                        {job.bullets.map((b, k) => (
                          <li key={k}>{b}</li>
                        ))}
                      </ul>
                    )}
                    {job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {job.tags.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    )}
                  </article>
                </FadeIn>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <section>
            <SectionTitle icon={<GraduationCap size={16} />} label="Education" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resume.education.map((ed, i) => (
                <FadeIn key={ed.degree + ed.school} delay={i}>
                  <article className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-6 h-full transition-colors duration-400">
                    <h3 className="text-[16px] font-bold text-[var(--fg)]">{ed.degree}</h3>
                    <p className="text-[14px] font-semibold text-[var(--accent-1)] mt-0.5">{ed.school}</p>
                    <p className="text-[12.5px] text-[var(--fg-3)] mt-2 tabular-nums flex items-center gap-1.5">
                      <span>{ed.start} — {ed.end}</span>
                      {ed.location && <><span>·</span><MapPin size={12} /> {ed.location}</>}
                    </p>
                    {ed.note && <p className="text-[13px] text-[var(--fg-2)] leading-relaxed mt-3">{ed.note}</p>}
                  </article>
                </FadeIn>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <section>
            <SectionTitle icon={<Wrench size={15} />} label="Skills" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {resume.skills.map((cat, i) => (
                <FadeIn key={cat.category} delay={i}>
                  <article className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-5 h-full transition-colors duration-400">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                      <h3 className="text-[13px] font-bold text-[var(--fg)]">{cat.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((s) => (
                        <Tag key={s}>{s}</Tag>
                      ))}
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section>
            <SectionTitle icon={<FolderGit2 size={15} />} label="Projects" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resume.projects.map((p, i) => {
                const isLink = p.link && p.link !== "#";
                const Wrapper = (isLink ? "a" : "div") as "a" | "div";
                return (
                  <FadeIn key={p.name} delay={i}>
                    <Wrapper
                      {...(isLink ? { href: p.link, target: "_blank", rel: "noreferrer" } : {})}
                      className="group block bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-6 h-full no-underline transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_10px_30px_var(--shadow)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[16px] font-bold text-[var(--fg)]">{p.name}</h3>
                        {isLink && <ArrowUpRight size={17} className="text-[var(--fg-3)] group-hover:text-[var(--accent-1)] transition-colors flex-shrink-0" />}
                      </div>
                      <p className="text-[13.5px] text-[var(--fg-2)] leading-relaxed mt-2">{p.description}</p>
                      {p.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {p.tags.map((t) => (
                            <Tag key={t}>{t}</Tag>
                          ))}
                        </div>
                      )}
                    </Wrapper>
                  </FadeIn>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[12px] font-extrabold tracking-[0.02em] text-[var(--accent-1)] flex-shrink-0">{"//"}</span>
      <span className="text-[var(--accent-1)] flex-shrink-0">{icon}</span>
      <h2 className="text-[13px] font-bold tracking-[0.08em] uppercase text-[var(--fg-3)] whitespace-nowrap">{label}</h2>
      <span aria-hidden className="slash-strip flex-1 h-[7px] opacity-20" />
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-2)] text-[var(--fg-2)] border border-[var(--border)]">
      {children}
    </span>
  );
}
