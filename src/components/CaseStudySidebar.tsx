"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type TocSection = {
  id: string;
  label: string;
};

/**
 * Case-study sidebar — replaces the site Sidebar on /work/* detail pages.
 *   • "all work" link back to /work
 *   • Table of contents with scrollspy + a soft pill that slides under the
 *     active entry (and follows the hovered entry, returning to active on leave)
 *   • "back to top" at the bottom
 *
 * Desktop: fixed left rail matching the site Sidebar width.
 * Mobile (<1024px): collapses into a slide-out drawer opened by a tab on the
 * left edge, with a backdrop. Mirrors the home Sidebar UX.
 */
export default function CaseStudySidebar({
  sections,
}: {
  sections: TocSection[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState({ top: 0, height: 0, show: false });

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const reducedRef = useRef(false);
  useEffect(() => {
    reducedRef.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  // --- Pill geometry ------------------------------------------------------
  const measurePill = useCallback((id: string | null) => {
    const list = listRef.current;
    const item = id ? itemRefs.current[id] : null;
    if (!list || !item) {
      setPill((p) => ({ ...p, show: false }));
      return;
    }
    const itemRect = item.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setPill({
      top: itemRect.top - listRect.top,
      height: itemRect.height,
      show: true,
    });
  }, []);

  // --- Scrollspy ----------------------------------------------------------
  useEffect(() => {
    const ids = sections.map((s) => s.id);
    if (ids.length === 0) return;

    let scheduled = false;
    const update = () => {
      scheduled = false;
      const line = window.innerHeight * 0.28;

      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (nearBottom) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      let chosen: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) chosen = id;
        else break;
      }
      setActiveId(chosen ?? ids[0]);
    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    const t = setTimeout(update, 60);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t);
    };
  }, [sections]);

  // Reposition pill whenever the active/hover target changes.
  useEffect(() => {
    measurePill(hoverId ?? activeId);
  }, [activeId, hoverId, measurePill]);

  // Close drawer on ESC; reset drawer when crossing to desktop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  const scrollToId = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
      behavior: reducedRef.current ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
  }, []);

  const handleNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToId(id);
    setOpen(false);
  };

  const backToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reducedRef.current ? "auto" : "smooth" });
    history.replaceState(null, "", window.location.pathname);
    setOpen(false);
  };

  // --- Shared inner content ----------------------------------------------
  const inner = (
    <>
      {/* Top: back to all work */}
      <Link
        href="/work"
        className="group flex items-center gap-2 w-fit font-mono text-xs uppercase tracking-[0.12em] text-ink transition-colors hover:text-rose"
      >
        <span className="inline-block transition-transform group-hover:-translate-x-1">
          ←
        </span>
        <span>all work</span>
      </Link>

      {/* TOC */}
      <nav className="bg-codebg rounded-xl p-3 mt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/70 mb-2 px-1.5">
          contents
        </p>
        <ul ref={listRef} className="relative flex flex-col gap-0.5">
          {/* Sliding active pill */}
          <span
            aria-hidden
            className="absolute left-0 right-0 rounded-lg pointer-events-none"
            style={{
              height: pill.height,
              transform: `translateY(${pill.top}px)`,
              opacity: pill.show ? 1 : 0,
              background: "rgba(126,145,192,0.22)",
              transition: reducedRef.current
                ? "none"
                : "transform 280ms cubic-bezier(0.22,1,0.36,1), height 280ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease",
            }}
          />
          {sections.map((s, i) => {
            const current = s.id === activeId;
            return (
              <li key={s.id} className="relative">
                <a
                  href={`#${s.id}`}
                  ref={(el) => {
                    itemRefs.current[s.id] = el;
                  }}
                  onClick={(e) => handleNav(e, s.id)}
                  onMouseEnter={() => setHoverId(s.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className={`relative block px-2 py-2 rounded-lg text-[15px] leading-snug transition-colors ${
                    current ? "text-ink font-medium" : "text-mute hover:text-ink"
                  }`}
                >
                  <span className="font-mono text-[11px] text-ink/40 mr-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: back to top */}
      <a
        href="#top"
        onClick={backToTop}
        className="group mt-auto flex items-center gap-2 w-fit font-mono text-[11px] uppercase tracking-[0.12em] text-mute hover:text-ink transition-colors"
      >
        <span className="inline-block transition-transform group-hover:-translate-y-0.5">
          ↑
        </span>
        <span>back to top</span>
      </a>
    </>
  );

  return (
    <>
      {/* Desktop fixed rail */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[280px] xl:w-[320px] z-30 flex-col p-6 xl:p-8 border-r border-ink/10 bg-cream/95 backdrop-blur-md overflow-y-auto">
        {inner}
      </aside>

      {/* Mobile: edge tab to open the drawer */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open table of contents"
        aria-expanded={open}
        className={`lg:hidden fixed top-1/2 left-0 z-40 -translate-y-1/2 flex items-center gap-1 py-3.5 pl-1.5 pr-2 rounded-r-xl bg-codebg text-ink shadow-[2px_0_12px_-4px_rgba(36,36,36,0.18)] transition-opacity ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <span className="flex flex-col gap-[3px]" aria-hidden>
          <span className="block w-[3px] h-[3px] rounded-full bg-mute" />
          <span className="block w-[3px] h-[3px] rounded-full bg-mute" />
          <span className="block w-[3px] h-[3px] rounded-full bg-mute" />
        </span>
        <span className="font-mono text-sm leading-none">›</span>
      </button>

      {/* Mobile: backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`lg:hidden fixed inset-0 z-40 bg-ink/35 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile: drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] flex flex-col p-6 bg-cream overflow-y-auto shadow-[2px_0_28px_-8px_rgba(36,36,36,0.2)] transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close table of contents"
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-mute hover:text-ink hover:bg-codebg text-xl leading-none transition-colors"
        >
          ×
        </button>
        {inner}
      </aside>
    </>
  );
}
