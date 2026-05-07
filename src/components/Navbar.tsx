"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useVisitor } from "@/hooks/useVisitor";
import { getCursor } from "@/data/cursors";

const links = [
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/gallery", label: "gallery" },
  { href: "/contact", label: "contact" },
];

/** Mobile-only nav. Desktop uses Sidebar. */
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cursor } = useVisitor();
  const picked = getCursor(cursor);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/") return null;

  return (
    <nav
      className={`lg:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-cream/85 backdrop-blur-md border-b border-ink/5"
          : "bg-transparent"
      }`}
    >
      <div className="section-padding flex items-center justify-between h-16">
        <Link href="/work" className="font-serif text-xl text-rose">
          sofia
        </Link>

        <div className="flex items-center gap-3">
          {cursor && (
            <span
              className="text-base leading-none"
              style={{ color: picked.color }}
              aria-label={`your cursor is ${picked.label}`}
            >
              {picked.glyph}
            </span>
          )}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-1.5 p-2 cursor-target"
          >
            <span
              className={`w-5 h-px bg-ink transition-transform ${
                open ? "rotate-45 translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`w-5 h-px bg-ink transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-5 h-px bg-ink transition-transform ${
                open ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="bg-cream border-t border-ink/5">
          <div className="flex flex-col py-4 section-padding">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-ink/80 hover:text-rose"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
