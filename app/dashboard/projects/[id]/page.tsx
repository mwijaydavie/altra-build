import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectWorkspace } from "@/components/dashboard/ProjectWorkspace";
import { getSession } from "@/lib/ops/auth";
import { projectDetail } from "@/lib/ops/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = projectDetail(id);
  return {
    title: detail ? detail.project.name : "Project",
    robots: { index: false, follow: false },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getSession();
  const detail = projectDetail(id);

  if (!detail) notFound();
  if (viewer.role !== "executive" && !viewer.projectIds.includes(id)) notFound();

  return <ProjectWorkspace projectId={id} role={viewer.role} />;
}
