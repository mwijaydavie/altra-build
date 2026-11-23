import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { OpsProviders } from "@/components/dashboard/Providers";
import { getSession } from "@/lib/ops/auth";
import { alerts } from "@/data/opsData";
import { metricsForProjects, projectSummaries } from "@/lib/ops/store";

export const metadata: Metadata = {
  title: {
    default: "ALTRA COMMAND — Operations portal",
    template: "%s · ALTRA COMMAND",
  },
  description:
    "Mission-critical construction operations: portfolio finance, programme, procurement, safety and offline field reporting.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getSession();
  const visible =
    viewer.role === "executive"
      ? projectSummaries
      : projectSummaries.filter((project) => viewer.projectIds.includes(project.id));
  const visibleIds = new Set(visible.map((project) => project.id));
  const scopedAlerts = alerts.filter((alert) => visibleIds.has(alert.projectId) && !alert.acknowledged);
  const metrics = metricsForProjects(visible);

  return (
    <OpsProviders>
      <link rel="manifest" href="/field/manifest.webmanifest" />
      <DashboardShell
        viewer={viewer}
        projects={visible.map((project) => ({
          id: project.id,
          name: project.name,
          status: project.status,
          light: project.trafficLight,
        }))}
        pendingApprovals={metrics.pendingApprovals}
        alertCount={scopedAlerts.length}
      >
        {children}
      </DashboardShell>
    </OpsProviders>
  );
}
