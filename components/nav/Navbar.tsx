"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sun, Moon } from "lucide-react";
import { NAV_ITEMS } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks";
import { useTheme } from "@/lib/theme";

/**
 * Map the home page's scroll sections to a nav item id, so the highlight
 * can glide through every nav item as the user scrolls — including the
 * Hobbies/Events preview sections, which link out to their own pages.
 */
const SECTION_TO_NAV: Record<string, string> = {
  hero: "",
  about: "about",
  "hobbies-preview": "hobbies",
  "events-preview": "events",
  contact: "contact",
};

const HIGHLIGHT_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { toggle, isDark } = useTheme();

  const isHome = pathname === "/" || pathname === "";
  const active = useActiveSection(
    isHome ? ["hero", "about", "hobbies-preview", "events-preview", "contact"] : []
  );

  // The currently highlighted nav id: derived from the scrolled section on
  // home, or from the current route on sub-pages.
  const activeNavId = isHome
    ? SECTION_TO_NAV[active] ?? ""
    : pathname.replace(/^\//, "");

  const activeItem = NAV_ITEMS.find((n) => n.id === activeNavId);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
    setSearchQ("");
  }, [pathname]);

  function navigate(id: string) {
    setSearchOpen(false);

    const item = NAV_ITEMS.find((n) => n.id === id);

    if (!item || item.type === "scroll") {
      if (!isHome) {
        router.push("/#" + (id || ""));
      } else if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/" + id);
    }
  }

  return (
    <>
      {/* ═══════════ Desktop — static top bar ═══════════ */}
      <nav className="hidden sm:block fixed top-[14px] left-4 right-4 z-[100]">
        <div className="nav-bar">
          <span
            className="font-extrabold text-[15px] tracking-tight px-3.5 pl-4 text-[var(--fg)] cursor-pointer whitespace-nowrap select-none"
            onClick={() => navigate("home")}
          >
            portfolio<span className="text-[var(--accent-1)]">.</span>
          </span>

          <div className="flex-1 flex justify-center gap-1">
            {NAV_ITEMS.map((n) => {
              const isActive = activeNavId === n.id;
              return (
                <button
                  key={n.id}
                  className={`
                    relative px-3.5 py-1.5 rounded-full text-[13px] font-medium
                    whitespace-nowrap transition-colors duration-200 outline-none border-none
                    bg-transparent cursor-pointer font-[inherit]
                    ${isActive
                      ? "text-[var(--accent-1)]"
                      : "text-[var(--fg-2)] hover:text-[var(--fg)]"
                    }
                  `}
                  onClick={() => navigate(n.id)}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-highlight-desktop"
                      className="absolute inset-0 rounded-full bg-[rgba(232,148,58,0.14)] -z-0"
                      transition={HIGHLIGHT_SPRING}
                    />
                  )}
                  <span className="relative z-10">{n.label}</span>
                </button>
              );
            })}
          </div>

          <button
            className="w-[34px] h-[34px] rounded-full flex-shrink-0 bg-transparent border-none flex items-center justify-center cursor-pointer text-[var(--fg-2)] hover:bg-[var(--border)] hover:text-[var(--fg)] transition-all duration-200 outline-none"
            onClick={() => setSearchOpen((s) => !s)}
          >
            <Search size={15} />
          </button>

          <button
            className="w-[34px] h-[34px] rounded-full flex-shrink-0 bg-transparent border-none flex items-center justify-center cursor-pointer text-[var(--fg-2)] hover:bg-[var(--border)] hover:text-[var(--fg)] transition-all duration-200 outline-none mr-1.5"
            onClick={toggle}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>

      {/* ═══════════ Mobile — floating bottom dock ═══════════ */}
      <nav className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]">
        <div className="nav-dock">
          {NAV_ITEMS.map((n) => {
            const Icon = n.icon;
            const isActive = activeNavId === n.id;
            return (
              <motion.button
                key={n.id}
                layout
                transition={HIGHLIGHT_SPRING}
                onClick={() => navigate(n.id)}
                className={`
                  relative flex items-center justify-center rounded-full px-3 py-2.5
                  bg-transparent border-none cursor-pointer outline-none font-[inherit]
                  ${isActive ? "text-[var(--accent-1)]" : "text-[var(--fg-2)]"}
                `}
                aria-label={n.label}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-highlight-mobile"
                    className="absolute inset-0 rounded-full bg-[rgba(232,148,58,0.14)]"
                    transition={HIGHLIGHT_SPRING}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon size={19} className="flex-shrink-0" />
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        key="label"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden whitespace-nowrap text-[13px] font-semibold"
                      >
                        {n.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
            );
          })}

          <div className="w-px h-6 bg-[var(--border)] mx-0.5 flex-shrink-0" />

          <button
            className="flex items-center justify-center w-[42px] h-[42px] rounded-full flex-shrink-0 bg-transparent border-none cursor-pointer text-[var(--fg-2)] active:text-[var(--accent-1)] outline-none transition-colors"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* ═══════════ Search dropdown (desktop) ═══════════ */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <div className="fixed inset-0 z-[98]" onClick={() => { setSearchOpen(false); setSearchQ(""); }} />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="hidden sm:flex fixed z-[101] top-[74px] right-4 w-[calc(100vw-32px)] max-w-[500px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 py-3 items-center gap-3 shadow-[0_8px_32px_var(--shadow)]"
            >
              <Search size={16} className="text-[var(--fg-3)] flex-shrink-0" />
              <input
                autoFocus
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search sections, skills, events..."
                className="flex-1 bg-transparent border-none outline-none text-[var(--fg)] text-sm font-[inherit] placeholder:text-[var(--fg-3)]"
              />
              {searchQ && (
                <button className="bg-transparent border-none text-[var(--fg-3)] cursor-pointer text-xs outline-none" onClick={() => setSearchQ("")}>
                  Clear
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ Styles ═══════════ */}
      <style jsx global>{`
        .nav-bar {
          position: relative;
          display: flex;
          align-items: center;
          height: 48px;
          padding: 0 6px;
          background: var(--nav-bg);
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid var(--nav-border);
          border-radius: 50px;
          box-shadow: 0 2px 16px var(--shadow);
        }
        .nav-dock {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 5px 8px;
          background: var(--nav-bg);
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid var(--nav-border);
          border-radius: 50px;
          box-shadow: 0 4px 24px var(--shadow);
        }
      `}</style>
    </>
  );
}
