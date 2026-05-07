"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = { intensity?: "light" | "heavy" };

/**
 * Canvas rain overlay. Tilted lines fall continuously; recycled when they
 * leave the bottom. Pauses on tab hide; respects prefers-reduced-motion.
 */
export default function Rain({ intensity = "light" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COUNT = intensity === "heavy" ? 220 : 130;
    const TILT = -0.18; // radians

    type Drop = { x: number; y: number; speed: number; len: number };
    let drops: Drop[] = [];

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: COUNT }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        speed: 7 + Math.random() * 9,
        len: 12 + Math.random() * 16,
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let running = true;

    function frame() {
      if (!running || !canvas) return;
      ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = "rgba(200, 220, 240, 0.55)";
        ctx.lineWidth = 1;
        for (const d of drops) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + Math.sin(TILT) * d.len, d.y + Math.cos(TILT) * d.len);
          ctx.stroke();
          d.y += d.speed;
          d.x += Math.sin(TILT) * d.speed;
          if (d.y > window.innerHeight) {
            d.y = -d.len;
            d.x = Math.random() * window.innerWidth;
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
  }, [intensity, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
