"use client";

import { useState } from "react";

import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { Chip, Eyebrow, LoadingBlock, Panel, PanelHeader } from "@/components/dashboard/ui";
import { useOpsSnapshot } from "@/lib/ops/hooks";
import { num, tzs } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/construction";

const FILTERS: { id: "all" | ProjectStatus; label: string }[] = [
  { id: "all", label: "All sites" },
  { id: "active", label: "Active" },
  { id: "handover", label: "Handover" },
  { id: "pre-con", label: "Pre-con" },
  { id: "on-hold", label: "On hold" },
];

export default function ProjectsRegisterPage() {
  const { data, isLoading, error, refetch } = useOpsSnapshot();
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");

  if (isLoading) {
    return (
      <div className="px-3 pb-10 pt-5 sm:px-5 sm:pt-6">
        <div className="space-y-3">
          <LoadingBlock className="h-24" />
          <LoadingBlock className="h-72" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-3 pb-10 pt-5 sm:px-5 sm:pt-6">
        <Panel className="max-w-lg p-6">
          <Eyebrow>Register unavailable</Eyebrow>
          <h1 className="mt-2 text-xl font-semibold text-paper">Project register could not load</h1>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 inline-flex min-h-10 items-center border border-gold/50 px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:bg-gold hover:text-ink"
          >
            Retry uplink
          </button>
        </Panel>
      </div>
    );
  }

  const { viewer, projects } = data;
  const visible = filter === "all" ? projects : projects.filter((project) => project.status === filter);
  const deployed = projects.reduce((sum, project) => sum + project.budgetSpent, 0);
  const workforce = projects.reduce((sum, project) => sum + project.workforce, 0);
  const completion = projects.length
    ? Math.round(projects.reduce((sum, project) => sum + project.completion, 0) / projects.length)
    : 0;
  const atRisk = projects.filter((project) => project.trafficLight !== "green").length;

  return (
    <div className="px-3 pb-10 pt-5 sm:px-5 sm:pt-6">
      <div className="flex flex-col gap-4 border-b border-paper/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Project register · 23 Nov 2026 · EAT</Eyebrow>
          <h1 className="mt-2 font-display text-[27px] font-semibold leading-[1.05] tracking-[-0.035em] text-paper sm:text-[34px]">
            {viewer.role === "client" ? "Your contract." : "Every site, one register."}
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-paper/50">
            {viewer.role === "client"
              ? "Read-only view of your contracted work — progress, spend against budget and the site team."
              : `${projects.length} sites in your scope · ${atRisk} carrying a schedule or cost exception. Open a row for the full workspace.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={atRisk > 0 ? "orange" : "green"}>
            {atRisk > 0 ? `${atRisk} need attention` : "All sites on track"}
          </Chip>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Capital deployed", value: tzs(deployed), note: "against contracted budget" },
          { label: "Workforce on shift", value: num(workforce), note: "across visible sites" },
          { label: "Avg completion", value: `${completion}%`, note: `${atRisk} of ${projects.length} off-track` },
        ].map((item) => (
          <Panel key={item.label} className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/35">{item.label}</p>
            <p className="mt-2 font-display text-[26px] leading-none tracking-tight text-paper">{item.value}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/30">{item.note}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => {
          const count =
            item.id === "all" ? projects.length : projects.filter((p) => p.status === item.id).length;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 border px-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
                filter === item.id
                  ? "border-gold bg-gold text-ink"
                  : "border-paper/15 text-paper/55 hover:border-paper/35 hover:text-paper",
              )}
            >
              {item.label}
              <span className={cn("tabular-nums", filter === item.id ? "text-ink/60" : "text-paper/30")}>
                {count}
              </span>
            </button>
          );
        })}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-paper/30">
          Showing {visible.length} of {projects.length}
        </span>
      </div>

      <Panel className="mt-3">
        <PanelHeader
          eyebrow="Live portfolio"
          title={filter === "all" ? "All visible sites" : `${FILTERS.find((f) => f.id === filter)?.label} sites`}
          action={
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/35">
              Select a row for the workspace
            </span>
          }
        />
        {visible.length > 0 ? (
          <ProjectTable projects={visible} />
        ) : (
          <p className="px-4 py-10 text-center text-[13px] text-paper/45">
            No sites in this state right now.
          </p>
        )}
      </Panel>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/25">
        Scope-filtered by role · demo dataset generated 23 Nov 2026
      </p>
    </div>
  );
}
