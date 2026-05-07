"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

export default function SignaturePad({
  color = "#7E91C0",
}: {
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPt = useRef<Point | null>(null);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
  }, []);

  function getPos(e: PointerEvent | React.PointerEvent): Point {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent) {
    drawing.current = true;
    lastPt.current = getPos(e);
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent) {
    if (!drawing.current) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const pt = getPos(e);
    const last = lastPt.current ?? pt;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    lastPt.current = pt;
    if (!hasInk) setHasInk(true);
  }

  function end() {
    drawing.current = false;
    lastPt.current = null;
  }

  function clear() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    setHasInk(false);
  }

  return (
    <div>
      <div className="relative rounded-2xl border border-dashed border-ink/25 bg-cream/60 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="block w-full h-44 touch-none cursor-target"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
        />
        {!hasInk && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center handwritten text-2xl text-ink/40">
            sign here, friend ✎
          </p>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <p className="text-mute">
          your signature stays on this page only — nothing is saved.
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-coral hover:underline"
        >
          clear
        </button>
      </div>
    </div>
  );
}
