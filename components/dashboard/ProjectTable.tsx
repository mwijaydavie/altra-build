import Link from "next/link";

import { Meter, TrafficDot } from "@/components/dashboard/ui";
import { daysBetween, num, statusLabel, tzs } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/types/construction";

const TODAY = "2026-11-23";

export function ProjectTable({ projects }: { projects: ProjectSummary[] }) {
  return (
    <div>
      <div className="hidden grid-cols-[minmax(0,2.2fr)_90px_120px_120px_90px_110px] gap-4 border-b border-paper/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-paper/55 md:grid">
        <span>Site</span>
        <span>Status</span>
        <span className="text-right">Complete</span>
        <span className="text-right">Budget spent</span>
        <span className="text-right">Variance</span>
        <span className="text-right">Crew</span>
      </div>

      <ul className="divide-y divide-paper/10">
        {projects.map((project) => {
          const remaining = daysBetween(TODAY, project.targetDate);
          return (
            <li key={project.id}>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="group block px-4 py-3 transition-colors hover:bg-paper/[0.04]"
              >
                {/* Desktop row */}
                <div className="hidden grid-cols-[minmax(0,2.2fr)_90px_120px_120px_90px_110px] items-center gap-4 md:grid">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-paper/90 group-hover:text-paper">
                      {project.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/55">
                      {project.projectCode} · {project.division}
                    </p>
                  </div>
                  <TrafficDot light={project.trafficLight} />
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] tabular-nums text-paper/60">
                      <span>{project.completion}%</span>
                    </div>
                    <Meter value={project.completion} height="h-1" className="mt-1" />
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[11px] tabular-nums text-paper/75">{tzs(project.budgetSpent)}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-paper/55">
                      of {tzs(project.budgetTotal)}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "text-right font-mono text-[11px] tabular-nums",
                      project.scheduleVarianceDays > 0
                        ? "text-[#F08A4B]"
                        : project.scheduleVarianceDays < 0
                          ? "text-[#6FD3A6]"
                          : "text-paper/50",
                    )}
                  >
                    {project.scheduleVarianceDays > 0 ? "+" : ""}
                    {project.scheduleVarianceDays}d
                  </p>
                  <p className="text-right font-mono text-[11px] tabular-nums text-paper/60">
                    {num(project.workforce)}
                  </p>
                </div>

                {/* Mobile card */}
                <div className="md:hidden">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-paper/90">{project.name}</p>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/55">
                        {project.projectCode} · {statusLabel[project.status] ?? project.status}
                      </p>
                    </div>
                    <TrafficDot light={project.trafficLight} label={false} />
                  </div>
                  <div className="mt-2.5 flex items-center gap-3">
                    <Meter value={project.completion} height="h-1" className="flex-1" />
                    <span className="font-mono text-[10px] tabular-nums text-paper/55">{project.completion}%</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/55">
                    <span>{tzs(project.budgetSpent)} spent</span>
                    <span className={project.scheduleVarianceDays > 0 ? "text-[#F08A4B]" : "text-paper/55"}>
                      {project.scheduleVarianceDays > 0 ? "+" : ""}
                      {project.scheduleVarianceDays}d variance
                    </span>
                    <span>{num(project.workforce)} crew</span>
                    <span>{remaining}d to target</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
