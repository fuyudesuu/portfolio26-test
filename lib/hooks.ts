"use client";

import { useState, useEffect, useRef } from "react";

/** Track window scroll position */
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollY;
}

/** Track which section is active based on scroll position */
export function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] || "");

  useEffect(() => {
    function onScroll() {
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) {
          setActive(sectionIds[i]);
          break;
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds]);

  return active;
}

/** Detect when an element enters the viewport (triggers once) */
export function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
