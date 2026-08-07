import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import CaseStudyView from "./CaseStudyView";

/** Pre-render every case study at build time so navigation is instant
 *  (static + prefetched) instead of server-rendered on each click. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) return notFound();

  // "Up next" cycles through visible (non-hidden) projects only.
  const visible = projects.filter((p) => !p.hidden);
  const idx = visible.findIndex((p) => p.slug === project.slug);
  const next = visible[(idx + 1) % visible.length] ?? visible[0];

  return <CaseStudyView project={project} next={next} />;
}
