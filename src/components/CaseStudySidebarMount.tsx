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

  const sections: TocSection[] = [
    { id: "overview", label: "the problem" },
    ...(project.caseStudy ?? []).map((s) => ({
      id: slugify(s.heading),
      label: s.heading,
    })),
    ...(project.screenshots && project.screenshots.length > 0
      ? [{ id: "gallery", label: "more" }]
      : []),
    ...(project.keyDecisions && project.keyDecisions.length > 0
      ? [{ id: "key-decisions", label: "key decisions" }]
      : []),
    ...(project.outcomes && project.outcomes.length > 0
      ? [{ id: "outcomes", label: "outcomes" }]
      : []),
  ];

  return <CaseStudySidebar sections={sections} />;
}
