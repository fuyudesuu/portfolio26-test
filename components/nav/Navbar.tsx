"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sun, Moon, CornerDownLeft } from "lucide-react";
import { NAV_ITEMS } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks";
import { useTheme } from "@/lib/theme";
import type { SearchEntry } from "@/lib/constants";

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

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Box = { left: number; top: number; width: number; height: number; ready: boolean };
const EMPTY_BOX: Box = { left: 0, top: 0, width: 0, height: 0, ready: false };

/**
 * A single persistent sliding-highlight indicator.
 *
 * Instead of mounting a Framer `layoutId` pill inside whichever button is
 * active (which pops across Next.js route changes because the unmount/mount
 * handshake is fragile), we keep one element mounted and animate it to the
 * measured box of the active button. It can never "appear from nowhere" — it
 * just springs from where it is to the new target.
 *
 * A short rAF loop re-measures for ~380ms after each change so the indicator
 * also tracks layout that animates in (e.g. the mobile label reveal / reflow).
 */
function useSlidingIndicator(activeKey: string, dep: unknown) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const items = useRef<Record<string, HTMLElement | null>>({});
  const refCbs = useRef<Record<string, (el: HTMLElement | null) => void>>({});
  const [box, setBox] = useState<Box>(EMPTY_BOX);
  const instant = useRef(true); // first placement should not animate in

  function measureInto(key: string) {
    const el = items.current[key];
    if (!el || !containerRef.current) {
      setBox((p) => (p.ready ? { ...p, ready: false } : p));
      return;
    }
    const next: Box = {
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight,
      ready: true,
    };
    setBox((p) =>
      p.ready && p.left === next.left && p.top === next.top && p.width === next.width && p.height === next.height
        ? p
        : next
    );
  }

  useIsoLayoutEffect(() => {
    let raf = 0;
    let start = 0;
    const tick = (ts: number) => {
      measureInto(activeKey);
      if (!start) start = ts;
      if (ts - start < 380) raf = requestAnimationFrame(tick);
      else instant.current = false;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, dep]);

  useEffect(() => {
    const onResize = () => measureInto(activeKey);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  function itemRef(key: string) {
    if (!refCbs.current[key]) {
      refCbs.current[key] = (el: HTMLElement | null) => {
        items.current[key] = el;
      };
    }
    return refCbs.current[key];
  }

  return { containerRef, itemRef, box, instant };
}

function Indicator({ box, instant, className }: { box: Box; instant: React.MutableRefObject<boolean>; className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={`absolute rounded-full bg-[rgba(232,148,58,0.14)] pointer-events-none ${className ?? ""}`}
      style={{ zIndex: 0 }}
      initial={false}
      animate={{ left: box.left, top: box.top, width: box.width, height: box.height, opacity: box.ready ? 1 : 0 }}
      transition={instant.current ? { duration: 0 } : HIGHLIGHT_SPRING}
    />
  );
}

export default function Navbar({ searchIndex = [] }: { searchIndex?: SearchEntry[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggle, isDark } = useTheme();

  const isHome = pathname === "/" || pathname === "";
  const active = useActiveSection(
    isHome ? ["hero", "about", "hobbies-preview", "events-preview", "contact"] : []
  );

  // The currently highlighted nav id: derived from the scrolled section on
  // home, or from the current route on sub-pages. Falls back to the first nav
  // item so there is always exactly one highlighted item.
  let activeNavId = isHome
    ? SECTION_TO_NAV[active] ?? ""
    : pathname.replace(/^\//, "");
  if (!activeNavId) activeNavId = NAV_ITEMS[0].id;

  const deskInd = useSlidingIndicator(activeNavId, pathname);
  const mobInd = useSlidingIndicator(activeNavId, pathname);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [selected, setSelected] = useState(0);

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
    setSearchQ("");
  }, [pathname]);

  // Reset the highlighted result whenever the query or open state changes
  useEffect(() => {
    setSelected(0);
  }, [searchQ, searchOpen]);

  // ⌘K / Ctrl+K toggles search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The site navbar has no place in the admin area — that section renders its
  // own header and tab bar. Bail out after hooks (React requires unconditional
  // hook calls) so the component mounts but renders nothing on /admin/*.
  if (pathname.startsWith("/admin")) return null;

  function navigate(id: string) {
    setSearchOpen(false);
    setSearchQ("");

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

  // Search results: matches on non-empty query, otherwise a few section shortcuts
  const q = searchQ.trim().toLowerCase();
  const results = q
    ? searchIndex.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 8)
    : searchIndex.filter((e) => e.category === "Section");

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selected]) navigate(results[selected].navId);
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQ("");
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

          <div ref={deskInd.containerRef} className="relative flex-1 flex justify-center gap-1">
            <Indicator box={deskInd.box} instant={deskInd.instant} />
            {NAV_ITEMS.map((n) => {
              const isActive = activeNavId === n.id;
              return (
                <button
                  key={n.id}
                  ref={deskInd.itemRef(n.id)}
                  className={`
                    relative z-10 px-3.5 py-1.5 rounded-full text-[13px] font-medium
                    whitespace-nowrap transition-colors duration-200 outline-none border-none
                    bg-transparent cursor-pointer font-[inherit]
                    ${isActive
                      ? "text-[var(--accent-1)]"
                      : "text-[var(--fg-2)] hover:text-[var(--fg)]"
                    }
                  `}
                  onClick={() => navigate(n.id)}
                >
                  {n.label}
                </button>
              );
            })}
          </div>

          <button
            className="w-[34px] h-[34px] rounded-full flex-shrink-0 bg-transparent border-none flex items-center justify-center cursor-pointer text-[var(--fg-2)] hover:bg-[var(--border)] hover:text-[var(--fg)] transition-all duration-200 outline-none"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={15} />
          </button>

          <button
            className="w-[34px] h-[34px] rounded-full flex-shrink-0 bg-transparent border-none flex items-center justify-center cursor-pointer text-[var(--fg-2)] hover:bg-[var(--border)] hover:text-[var(--fg)] transition-all duration-200 outline-none mr-1.5"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>

      {/* ═══════════ Mobile — floating bottom dock ═══════════ */}
      <nav className="sm:hidden fixed bottom-4 left-0 right-0 mx-auto z-[100] w-fit max-w-[calc(100vw-12px)]">
        <div className="nav-dock" ref={mobInd.containerRef}>
          <Indicator box={mobInd.box} instant={mobInd.instant} />
          {NAV_ITEMS.map((n) => {
            const Icon = n.icon;
            const isActive = activeNavId === n.id;
            return (
              <button
                key={n.id}
                ref={mobInd.itemRef(n.id)}
                onClick={() => navigate(n.id)}
                className={`
                  relative z-10 flex items-center justify-center rounded-full px-2 py-2.5
                  bg-transparent border-none cursor-pointer outline-none font-[inherit]
                  ${isActive ? "text-[var(--accent-1)]" : "text-[var(--fg-2)]"}
                `}
                aria-label={n.label}
              >
                <span className="flex items-center gap-1.5">
                  <Icon size={19} className="flex-shrink-0" />
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        key="label"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden whitespace-nowrap text-[13px] font-semibold flex-shrink-0"
                      >
                        {n.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            );
          })}

          <div className="relative z-10 w-px h-6 bg-[var(--border)] mx-0.5 flex-shrink-0" />

          <button
            className="relative z-10 flex items-center justify-center w-[36px] h-[36px] rounded-full flex-shrink-0 bg-transparent border-none cursor-pointer text-[var(--fg-2)] active:text-[var(--accent-1)] outline-none transition-colors"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <button
            className="relative z-10 flex items-center justify-center w-[36px] h-[36px] rounded-full flex-shrink-0 bg-transparent border-none cursor-pointer text-[var(--fg-2)] active:text-[var(--accent-1)] outline-none transition-colors"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* ═══════════ Search command palette (desktop + mobile) ═══════════ */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[105] bg-black/30 backdrop-blur-sm"
              onClick={() => { setSearchOpen(false); setSearchQ(""); }}
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              role="dialog"
              aria-modal="true"
              /* Center via auto-margins, not translate-x: Framer sets an inline
                 transform for the y/scale animation, which would override it. */
              className="fixed z-[110] top-[12vh] left-0 right-0 mx-auto w-[calc(100vw-32px)] max-w-[520px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-[0_16px_48px_var(--shadow)]"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                <Search size={17} className="text-[var(--fg-3)] flex-shrink-0" />
                <input
                  autoFocus
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder="Search sections, skills, hobbies, events..."
                  className="flex-1 bg-transparent border-none outline-none text-[var(--fg)] text-[15px] font-[inherit] placeholder:text-[var(--fg-3)]"
                />
                {searchQ && (
                  <button
                    className="bg-transparent border-none text-[var(--fg-3)] cursor-pointer text-xs outline-none hover:text-[var(--fg)]"
                    onClick={() => setSearchQ("")}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="max-h-[46vh] overflow-y-auto p-2">
                {results.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-[var(--fg-3)]">
                    No results for &ldquo;{searchQ}&rdquo;
                  </p>
                ) : (
                  results.map((r, i) => (
                    <button
                      key={`${r.category}-${r.label}-${i}`}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => navigate(r.navId)}
                      className={`
                        w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl
                        text-left border-none cursor-pointer outline-none font-[inherit] transition-colors
                        ${i === selected ? "bg-[var(--border)]" : "bg-transparent"}
                      `}
                    >
                      <span className="text-[15px] font-medium text-[var(--fg)] truncate">
                        {r.label}
                      </span>
                      <span className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] uppercase tracking-wide text-[var(--fg-3)]">
                          {r.category}
                        </span>
                        {i === selected && (
                          <CornerDownLeft size={13} className="text-[var(--fg-3)]" />
                        )}
                      </span>
                    </button>
                  ))
                )}
              </div>
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
          position: relative;
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
