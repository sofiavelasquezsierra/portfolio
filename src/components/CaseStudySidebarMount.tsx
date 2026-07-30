"use client";

import { usePathname } from "next/navigation";
import { getProject } from "@/data/projects";
import CaseStudySidebar, { TocSection } from "./CaseStudySidebar";

/** Stable, URL-safe id from a section heading. Must match the anchors
 *  rendered in CaseStudyView. */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Renders the case-study table-of-contents sidebar at the root layout level
 * (a sibling of the site Sidebar), so it swaps in INSTANTLY when navigating
 * into /work/[slug] — instead of fading in with the page transition, which
 * left the rail momentarily empty.
 */
export default function CaseStudySidebarMount() {
  const pathname = usePathname();
  const match = pathname.match(/^\/work\/([^/]+)$/);
  if (!match) return null;

  const project = getProject(match[1]);
  if (!project) return null;

  // Keep the table of contents short (≤4): the problem plus the main
  // narrative sections. Gallery / key decisions / outcomes still render on the
  // page — they just don't clutter the rail.
  const sections: TocSection[] = [
    { id: "overview", label: "the problem" },
    ...(project.caseStudy ?? []).map((s) => ({
      id: slugify(s.heading),
      label: s.heading,
    })),
  ];

  return (
    <CaseStudySidebar sections={sections} accent={project.accent ?? "#7E91C0"} />
  );
}
