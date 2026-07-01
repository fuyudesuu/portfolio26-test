"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, CalendarDays, Heart, User, ExternalLink } from "lucide-react";
import { Toast, type ToastData } from "@/components/admin/ui";
import EventsManager from "./EventsManager";
import HobbiesManager from "./HobbiesManager";
import AboutManager from "./AboutManager";

type Tab = "events" | "hobbies" | "about";

const TABS: { key: Tab; label: string; icon: typeof CalendarDays }[] = [
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "hobbies", label: "Hobbies", icon: Heart },
  { key: "about", label: "About", icon: User },
];

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("events");
  const [checking, setChecking] = useState(true);
  const [toast, setToast] = useState<ToastData>(null);

  // Auth guard
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) router.replace("/admin");
        else setChecking(false);
      })
      .catch(() => router.replace("/admin"));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin");
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--fg-3)] text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] sticky top-0 bg-[var(--bg)] z-10">
        <div className="max-w-[900px] mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-[var(--fg)]">
              portfolio<span className="text-[var(--accent-1)]">.</span>
            </span>
            <span className="text-[var(--fg-3)] text-sm ml-2">admin</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--fg-2)] hover:text-[var(--accent-1)] transition-colors no-underline"
            >
              View site <ExternalLink size={14} />
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--fg-2)] hover:text-[var(--accent-2)] transition-colors bg-transparent border-none cursor-pointer font-[inherit]"
            >
              Logout <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-[900px] mx-auto px-5 pt-6">
        <div className="flex gap-1 border-b border-[var(--border)]">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors bg-transparent cursor-pointer font-[inherit] outline-none ${
                  isActive
                    ? "border-[var(--accent-1)] text-[var(--accent-1)]"
                    : "border-transparent text-[var(--fg-2)] hover:text-[var(--fg)]"
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-[900px] mx-auto px-5 py-8">
        {tab === "events" && <EventsManager setToast={setToast} />}
        {tab === "hobbies" && <HobbiesManager setToast={setToast} />}
        {tab === "about" && <AboutManager setToast={setToast} />}
      </div>

      <Toast data={toast} onClose={() => setToast(null)} />
    </div>
  );
}
