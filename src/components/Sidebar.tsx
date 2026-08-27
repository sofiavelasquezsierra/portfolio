"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PhotoOrLogo from "./PhotoOrLogo";

const links = [
  { href: "/", label: "home", glyph: "✧" },
  { href: "/work", label: "work", glyph: "✦" },
  { href: "/about", label: "about", glyph: "✿" },
  { href: "/gallery", label: "gallery", glyph: "❋" },
  { href: "/contact", label: "contact", glyph: "✉" },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Case-study detail pages render their own CaseStudySidebar in this rail.
  if (/^\/work\/[^/]+$/.test(pathname)) return null;

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[220px] xl:w-[250px] z-30 flex-col p-5 xl:p-6 border-r border-ink/10 bg-cream/95 backdrop-blur-md">
      <Link href="/" className="block">
        <PhotoOrLogo
          size={76}
          imgSize={76}
          rounded="rounded-2xl"
          className="mb-3"
        />
        <h1 className="font-serif text-2xl text-ink leading-none">sofia</h1>
        <p className="font-serif text-xl text-ink/70 leading-tight">
          velasquez sierra
        </p>
      </Link>

      <nav className="mt-7 flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-[0.22em] text-mute mb-2">
          explore
        </p>
        {links.map((l) => {
          // "/" must match exactly — every path startsWith it.
          const active =
            l.href === "/"
              ? pathname === "/"
              : pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                active
                  ? "bg-coral/10 text-coral"
                  : "text-ink/75 hover:text-coral hover:bg-coral/5"
              }`}
            >
              <span className="text-base">{l.glyph}</span>
              <span className="text-sm">{l.label}</span>
              {active && (
                <span className="ml-auto text-xs text-coral">→</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <p className="text-[10px] uppercase tracking-[0.22em] text-mute mb-2">
          elsewhere
        </p>
        <div className="flex items-center gap-2">
          <SocialLink
            href="https://github.com/sofiavelasquezsierra"
            label="GitHub"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.69-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.7 5.36-5.27 5.65.41.36.78 1.05.78 2.13v3.16c0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </SocialLink>
          <SocialLink
            href="https://www.linkedin.com/in/sofia-velasquez/"
            label="LinkedIn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </SocialLink>
          <SocialLink
            href="mailto:sofiavs321@gmail.com"
            label="Email"
            external={false}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2.4 0L12 11.5 19.6 6H4.4zM4 8.4V18h16V8.4l-7.42 5.4a1 1 0 0 1-1.16 0L4 8.4z" />
            </svg>
          </SocialLink>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-ink/10">
        <p className="text-xs text-mute">hi there.</p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-mute mt-1">
          built with claude code · 2026
        </p>
      </div>
    </aside>
  );
}

function SocialLink({
  href,
  label,
  children,
  external = true,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={label}
      className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center text-ink hover:text-coral hover:border-coral transition-colors"
    >
      {children}
    </a>
  );
}
