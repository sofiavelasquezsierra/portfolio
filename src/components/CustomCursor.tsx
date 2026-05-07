"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useVisitor } from "@/hooks/useVisitor";
import { getCursor } from "@/data/cursors";

export default function CustomCursor() {
  const reduced = useReducedMotion();
  const { cursor } = useVisitor();
  const picked = getCursor(cursor);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    setEnabled(true);
    document.documentElement.classList.add("cursor-custom");

    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

    const onOver = (e: Event) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = el.closest(
        "a, button, [role='button'], input, textarea, select, label, .cursor-target"
      );
      setHover(!!interactive);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("cursor-custom");
    };
  }, [reduced]);

  if (!enabled) return null;

  // Classic dot cursor: keep the existing ring + dot.
  if (picked.id === "dot") {
    return (
      <>
        <div
          aria-hidden
          className="pointer-events-none fixed z-[9999] mix-blend-multiply transition-[width,height,background] duration-150"
          style={{
            left: pos.x,
            top: pos.y,
            transform: "translate(-50%, -50%)",
            width: hover ? 44 : 28,
            height: hover ? 44 : 28,
            borderRadius: "9999px",
            background: hover
              ? "rgba(201,123,133,0.25)"
              : "rgba(44,62,80,0.12)",
            border: "1.5px solid rgba(44,62,80,0.55)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: pos.x,
            top: pos.y,
            transform: "translate(-50%, -50%)",
            width: 5,
            height: 5,
            borderRadius: "9999px",
            background: picked.color,
          }}
        />
      </>
    );
  }

  // Glyph cursor: ring on hover + the chosen glyph following the pointer.
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed z-[9999] transition-[width,height,opacity] duration-150"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          width: hover ? 40 : 0,
          height: hover ? 40 : 0,
          opacity: hover ? 1 : 0,
          borderRadius: "9999px",
          border: `1.5px solid ${picked.color}`,
          background: `${picked.color}1A`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none fixed z-[9999] select-none"
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%, -50%) scale(${hover ? 1.18 : 1})`,
          color: picked.color,
          fontSize: 22,
          lineHeight: 1,
          textShadow: `0 0 6px ${picked.color}66`,
          transition: "transform 120ms ease",
        }}
      >
        {picked.glyph}
      </span>
    </>
  );
}
