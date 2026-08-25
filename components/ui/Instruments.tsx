"use client";

import { useEffect, useState } from "react";

/* Fixed page instruments reading scroll depth.
   Desktop (≥1000px): a labelled DEPTH rail in the left margin — vertical
   readout, dashed rail, sliding knob. It persists the whole page (a gauge
   you can't scroll past). Mobile (<900px): a hairline amber progress strip
   pinned to the top of the screen, so the identity travels to phones. */
export default function Instruments() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const depth = ("000" + Math.round(p * 8420)).slice(-4);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-11 left-[22px] top-[110px] z-40 hidden w-5 flex-col items-center gap-3.5 min-[1000px]:flex"
      >
        <span className="whitespace-nowrap text-[9.5px] font-extrabold uppercase tabular-nums tracking-[0.22em] text-[var(--fg-3)] [text-orientation:mixed] [writing-mode:vertical-rl]">
          <b className="text-[var(--accent-1)]">{depth}</b>&ensp;· depth
        </span>
        <span
          className="relative w-px flex-1 opacity-55"
          style={{ background: "repeating-linear-gradient(180deg, var(--fg-3) 0 4px, transparent 4px 9px)" }}
        >
          <span
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent-1)] shadow-[0_0_0_4px_rgba(232,148,58,0.2)] transition-[top] duration-150 ease-linear"
            style={{ top: `${(p * 100).toFixed(1)}%` }}
          />
        </span>
        <span className="h-0.5 w-[11px] bg-[var(--accent-2)]" />
      </div>

      <div
        aria-hidden
        className="fixed left-0 top-0 z-[120] h-[3px] bg-[var(--accent-1)] shadow-[0_0_8px_rgba(232,148,58,0.45)] min-[900px]:hidden"
        style={{ width: `${(p * 100).toFixed(1)}%` }}
      />
    </>
  );
}
