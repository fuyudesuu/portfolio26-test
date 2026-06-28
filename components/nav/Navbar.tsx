"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, Search, Sun, Moon, ChevronUp, ArrowLeft,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/data";
import { useScrollY, useActiveSection } from "@/lib/hooks";
import { useTheme } from "@/lib/theme";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const scrollY = useScrollY();
  const { toggle, isDark } = useTheme();

  const isHome = pathname === "/" || pathname === "";
  const active = useActiveSection(
    isHome ? ["hero", "about", "hobbies-preview", "events-preview", "contact"] : []
  );

  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  // Collapse logic
  useEffect(() => {
    if (!isHome) {
      setCollapsed(scrollY > 60);
      return;
    }
    const hero = document.getElementById("hero");
    if (hero) setCollapsed(scrollY > hero.offsetHeight * 0.55);
  }, [scrollY, isHome]);

  // Close search when collapsed
  useEffect(() => {
    if (collapsed) { setSearchOpen(false); setSearchQ(""); }
  }, [collapsed]);

  // Close menu when un-collapsed
  useEffect(() => {
    if (!collapsed) setMenuOpen(false);
  }, [collapsed]);

  function navigate(id: string) {
    setMenuOpen(false);
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
      {/* ═══ Main nav bar — CSS transition, no Framer layout ═══ */}
      <nav className="fixed top-[14px] right-4 z-[100]">
        <div
          className="nav-bar"
          style={{
            width: collapsed ? 52 : "calc(100vw - 32px)",
            height: collapsed ? 52 : 48,
            padding: collapsed ? 0 : "0 6px",
            cursor: collapsed ? "pointer" : "default",
          }}
          onClick={() => { if (collapsed) setMenuOpen((m) => !m); }}
        >
          {/* Orb icon — visible when collapsed */}
          <span
            className="absolute inset-0 flex items-center justify-center text-[var(--fg)] transition-opacity duration-300 pointer-events-none"
            style={{
              opacity: collapsed ? 1 : 0,
              transitionDelay: collapsed ? "0.2s" : "0s",
            }}
          >
            <Menu size={20} />
          </span>

          {/* Desktop links — visible when expanded, hidden on mobile */}
          <div
            className="hidden sm:flex items-center w-full transition-opacity duration-200"
            style={{
              opacity: collapsed ? 0 : 1,
              pointerEvents: collapsed ? "none" : "auto",
            }}
          >
            <span
              className="font-extrabold text-[15px] tracking-tight px-3.5 pl-4 text-[var(--fg)] cursor-pointer whitespace-nowrap select-none"
              onClick={(e) => { e.stopPropagation(); navigate("home"); }}
            >
              portfolio<span className="text-[var(--accent-1)]">.</span>
            </span>

            <div className="flex-1 flex justify-center gap-1">
              {NAV_ITEMS.map((n) => {
                const isActive =
                  (n.type === "page" && pathname === "/" + n.id) ||
                  (n.type === "scroll" && active === n.id && isHome);
                return (
                  <button
                    key={n.id}
                    className={`
                      px-3.5 py-1.5 rounded-full text-[13px] font-medium
                      whitespace-nowrap transition-all duration-200 outline-none border-none font-[inherit]
                      ${isActive
                        ? "bg-[rgba(232,148,58,0.12)] text-[var(--accent-1)]"
                        : "bg-transparent text-[var(--fg-2)] hover:bg-[var(--border)] hover:text-[var(--fg)]"
                      }
                    `}
                    onClick={(e) => { e.stopPropagation(); navigate(n.id); }}
                  >
                    {n.label}
                  </button>
                );
              })}
            </div>

            <button
              className="w-[34px] h-[34px] rounded-full flex-shrink-0 bg-transparent border-none flex items-center justify-center cursor-pointer text-[var(--fg-2)] hover:bg-[var(--border)] hover:text-[var(--fg)] transition-all duration-200 outline-none"
              onClick={(e) => { e.stopPropagation(); setSearchOpen((s) => !s); }}
            >
              <Search size={15} />
            </button>

            <button
              className="w-[34px] h-[34px] rounded-full flex-shrink-0 bg-transparent border-none flex items-center justify-center cursor-pointer text-[var(--fg-2)] hover:bg-[var(--border)] hover:text-[var(--fg)] transition-all duration-200 outline-none mr-1.5"
              onClick={(e) => { e.stopPropagation(); toggle(); }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Mobile hamburger — visible on small screens when expanded */}
          <button
            className="sm:hidden absolute inset-0 flex items-center justify-center bg-transparent border-none text-[var(--fg)] cursor-pointer outline-none transition-opacity duration-200"
            style={{
              opacity: collapsed ? 0 : 1,
              pointerEvents: collapsed ? "none" : "auto",
            }}
            onClick={(e) => { e.stopPropagation(); setMenuOpen((m) => !m); }}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* ═══ Floating theme toggle (when collapsed) ═══ */}
      <AnimatePresence>
        {collapsed && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-20 z-[100] w-10 h-10 rounded-full bg-[var(--nav-bg)] backdrop-blur-xl border border-[var(--nav-border)] flex items-center justify-center cursor-pointer text-[var(--fg-2)] shadow-[0_2px_12px_var(--shadow)] hover:text-[var(--accent-1)] hover:scale-110 transition-all duration-300 outline-none"
            onClick={toggle}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ Search dropdown ═══ */}
      <AnimatePresence>
        {searchOpen && !collapsed && (
          <>
            <div className="fixed inset-0 z-[98]" onClick={() => { setSearchOpen(false); setSearchQ(""); }} />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="hidden sm:flex fixed z-[101] top-[78px] right-4 w-[calc(100vw-32px)] max-w-[500px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-4 py-3 items-center gap-3 shadow-[0_8px_32px_var(--shadow)]"
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

      {/* ═══ Menu overlay ═══ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99] bg-black/30 backdrop-blur-md"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed z-[99] top-[78px] right-4 sm:left-auto left-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-card p-2 flex flex-col gap-0.5 min-w-[200px] shadow-[0_12px_40px_var(--shadow)]"
              onClick={(e) => e.stopPropagation()}
            >
              {!isHome && (
                <>
                  <button
                    className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] text-[15px] font-medium text-[var(--fg-3)] bg-transparent border-none cursor-pointer outline-none text-left transition-colors hover:bg-[var(--border)] font-[inherit]"
                    onClick={() => navigate("home")}
                  >
                    <ArrowLeft size={18} style={{ opacity: 0.6 }} /> Home
                  </button>
                  <div className="h-px bg-[var(--border)] mx-3 my-1" />
                </>
              )}

              {NAV_ITEMS.map((n) => {
                const Icon = n.icon;
                const isActive =
                  (n.type === "page" && pathname === "/" + n.id) ||
                  (n.type === "scroll" && active === n.id && isHome);
                return (
                  <button
                    key={n.id}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 rounded-[14px] text-[15px] font-medium
                      border-none cursor-pointer outline-none text-left transition-colors font-[inherit]
                      ${isActive
                        ? "bg-[rgba(232,148,58,0.1)] text-[var(--accent-1)]"
                        : "bg-transparent text-[var(--fg)] hover:bg-[var(--border)]"
                      }
                    `}
                    onClick={() => navigate(n.id)}
                  >
                    <Icon size={18} style={{ opacity: 0.6 }} /> {n.label}
                  </button>
                );
              })}

              <div className="h-px bg-[var(--border)] mx-3 my-1" />
              <button
                className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] text-[15px] font-medium text-[var(--fg-3)] bg-transparent border-none cursor-pointer outline-none text-left transition-colors hover:bg-[var(--border)] font-[inherit]"
                onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMenuOpen(false); }}
              >
                <ChevronUp size={18} style={{ opacity: 0.6 }} /> Back to top
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ Nav bar styles ═══ */}
      <style jsx global>{`
        .nav-bar {
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: var(--nav-bg);
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid var(--nav-border);
          border-radius: 50px;
          box-shadow: 0 2px 16px var(--shadow);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                      height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                      padding 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.3s ease;
        }
        .nav-bar:hover {
          ${/* Only apply hover glow when collapsed */""}
        }
        @media (max-width: 639px) {
          .nav-bar {
            width: 48px !important;
            height: 48px !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
