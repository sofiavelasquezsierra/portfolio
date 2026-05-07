"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Canvas snow overlay. Soft white circles drifting down with sinusoidal
 * sway. Pauses on tab hide; respects prefers-reduced-motion.
 */
export default function Snow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COUNT = 90;
    type Flake = {
      x: number;
      y: number;
      r: number;
      vy: number;
      sway: number;
      phase: number;
    };
    let flakes: Flake[] = [];

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      flakes = Array.from({ length: COUNT }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 1 + Math.random() * 2.5,
        vy: 0.6 + Math.random() * 1.2,
        sway: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let running = true;
    let t = 0;

    function frame() {
      if (!running || !canvas) return;
      t += 0.018;
      ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (ctx) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        for (const f of flakes) {
          const x = f.x + Math.sin(t + f.phase) * 14 * f.sway;
          ctx.beginPath();
          ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
          f.y += f.vy;
          if (f.y > window.innerHeight + 4) {
            f.y = -4;
            f.x = Math.random() * window.innerWidth;
          }
        }
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onVisibility() {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduced) {
        running = true;
        if (!raf) raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
