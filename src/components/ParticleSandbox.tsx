"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
};

const PALETTE = [
  "#E8533A",
  "#FFD6C2",
  "#A8D2EA",
  "#C8D5C0",
  "#F5C6CB",
  "#FCE9B6",
  "#D7CDEB",
];

export default function ParticleSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<P[]>([]);
  const mouse = useRef<{ x: number; y: number; pressed: boolean }>({
    x: -1,
    y: -1,
    pressed: false,
  });
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function spawn(x: number, y: number, n = 3) {
      for (let i = 0; i < n; i++) {
        particles.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3 - 1,
          r: 3 + Math.random() * 5,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          life: 1,
        });
      }
    }

    function step() {
      if (!canvas) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx?.clearRect(0, 0, w, h);

      // gentle gravity-less float
      particles.current = particles.current.filter((p) => p.life > 0);
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.life -= 0.006;

        // bounce off walls softly
        if (p.x < 0 || p.x > w) p.vx *= -0.6;
        if (p.y < 0 || p.y > h) p.vy *= -0.6;

        // attract toward cursor when pressed
        if (mouse.current.pressed) {
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const d = Math.hypot(dx, dy) + 0.001;
          p.vx += (dx / d) * 0.18;
          p.vy += (dy / d) * 0.18;
        }

        if (ctx) {
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (ctx) ctx.globalAlpha = 1;

      // cap pop count for perf
      if (particles.current.length > 600) {
        particles.current.splice(0, particles.current.length - 600);
      }

      raf = requestAnimationFrame(step);
    }

    let raf = requestAnimationFrame(step);

    function onMove(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      if (!reduced) spawn(mouse.current.x, mouse.current.y, 1);
    }
    function onDown(e: PointerEvent) {
      if (!canvas) return;
      mouse.current.pressed = true;
      const rect = canvas.getBoundingClientRect();
      spawn(e.clientX - rect.left, e.clientY - rect.top, 14);
    }
    function onUp() {
      mouse.current.pressed = false;
    }

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reduced]);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-ink/10 bg-cream">
      <canvas
        ref={canvasRef}
        className="block w-full h-[440px] cursor-target"
        style={{ touchAction: "none" }}
      />
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-ink/10 text-xs text-ink/70">
        move · click to burst · hold to pull
      </div>
    </div>
  );
}
