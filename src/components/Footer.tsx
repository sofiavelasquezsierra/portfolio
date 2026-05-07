"use client";

import VisitorCounter from "./VisitorCounter";

export default function Footer() {
  return (
    <footer className="border-t border-ink/5 py-10 mt-16 bg-cream/60 backdrop-blur-sm">
      <div className="section-padding flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-mute">
        <p>
          built with <span className="text-coral">♥</span> by sofia · next.js
          + claude code · 2026
        </p>
        <VisitorCounter />
      </div>
    </footer>
  );
}
