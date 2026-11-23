"use client";

import { ArrowUpRight, Download, Smartphone } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AlertsRail } from "@/components/dashboard/AlertsRail";
import { ApprovalsPanel } from "@/components/dashboard/ApprovalsPanel";
import { DailyLogCard } from "@/components/dashboard/DailyLogCard";
import { ExecutiveSummaryCards } from "@/components/dashboard/ExecutiveSummaryCards";
import { FinancialBurnChart } from "@/components/dashboard/FinancialBurnChart";
import { LiveProjectMap } from "@/components/dashboard/LiveProjectMap";
import { ProjectTable } from "@/components/dashboard/ProjectTable";
import { Chip, Eyebrow, LoadingBlock, Panel, PanelHeader } from "@/components/dashboard/ui";
import { useOpsSnapshot } from "@/lib/ops/hooks";
import { pct, relative, statusLabel, tzs } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/construction";

const FILTERS: { id: "all" | ProjectStatus; label: string }[] = [
  { id: "all", label: "All sites" },
  { id: "active", label: "Active" },
  { id: "handover", label: "Handover" },
  { id: "pre-con", label: "Pre-con" },
  { id: "on-hold", label: "On hold" },
];

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useOpsSnapshot();
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");

  const projectNames = useMemo(
    () => Object.fromEntries((data?.projects ?? []).map((project) => [project.id, project.name])),
    [data],
  );
  const users = useMemo(
    () => Object.fromEntries((data?.users ?? []).map((user) => [user.id, user.fullName])),
    [data],
  );

  if (isLoading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <div className="px-4 py-16 sm:px-6">
        <Panel className="mx-auto max-w-lg p-6">
          <Eyebrow>Telemetry interrupted</Eyebrow>
          <h1 className="mt-2 text-xl font-semibold text-paper">Command link unavailable</h1>
          <p className="mt-2 text-sm text-paper/50">
            The operational snapshot could not be loaded. Local demo data usually recovers on retry.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 inline-flex min-h-10 items-center gap-2 border border-gold/50 px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:bg-gold hover:text-ink"
          >
            Retry uplink
          </button>
        </Panel>
      </div>
    );
  }

  const { metrics, viewer, projects, financials, alerts, rfis, logs, checklist, incidents, audit } = data;
  const filtered = filter === "all" ? projects : projects.filter((project) => project.status === filter);
  const pendingRfis = rfis.filter((rfi) => rfi.status === "pending-approval" || (rfi.isChangeOrder && rfi.status === "open"));
  const unacknowledged = alerts.filter((alert) => !alert.acknowledged);
  const compliance = checklist.length
    ? checklist.filter((item) => item.status === "compliant").length / checklist.length
    : 1;

  return (
    <div className="px-3 pb-10 pt-5 sm:px-5 sm:pt-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-paper/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Portfolio HUD · 23 Nov 2026 · EAT</Eyebrow>
          <h1 className="mt-2 font-display text-[27px] font-semibold leading-[1.05] tracking-[-0.035em] text-paper sm:text-[34px]">
            {viewer.role === "client" ? "Your project, live." : "Portfolio command."}
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-paper/50">
            {viewer.role === "client"
              ? `Read-only delivery view for ${projects[0]?.name ?? "your project"} — programme, daily logs, documents and financial summary.`
              : `${metrics.activeSites} active sites, ${metrics.liveWorkforce.toLocaleString("en-TZ")} workers on shift, ${metrics.openRfis} RFIs open. Signed in as ${viewer.fullName} · ${viewer.title}.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="neutral">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6FD3A6]" /> Snapshot {relative(data.generatedAt)}
          </Chip>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-10 items-center gap-2 border border-paper/20 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/65 transition-colors hover:border-gold/50 hover:text-gold"
          >
            <Download className="h-3.5 w-3.5" /> Board pack
          </button>
          {viewer.role !== "client" ? (
            <Link
              href="/field"
              className="inline-flex min-h-10 items-center gap-2 border border-gold/50 bg-gold px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold-soft"
            >
              <Smartphone className="h-3.5 w-3.5" /> Field app
            </Link>
          ) : null}
        </div>
      </div>

      {viewer.role === "client" ? (
        <p className="mt-4 border border-gold/20 bg-gold/[0.05] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-gold/80">
          Client workspace · financial detail restricted to certified milestones
        </p>
      ) : null}

      {/* KPIs */}
      <div className="mt-5">
        <ExecutiveSummaryCards metrics={metrics} scopeLabel={viewer.role === "client" ? "contract" : "portfolio"} />
      </div>

      {/* Finance + alerts */}
      <div className="mt-5 grid gap-3 xl:grid-cols-3">
        {viewer.role !== "client" ? (
          <Panel className="xl:col-span-2">
            <FinancialBurnChart series={financials} />
          </Panel>
        ) : (
          <Panel className="flex flex-col justify-between p-5 xl:col-span-2">
            <div>
              <Eyebrow>Certified position</Eyebrow>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-paper">
                {pct(metrics.capitalUtilisation)} of contract value certified
              </h2>
              <p className="mt-2 max-w-md text-sm text-paper/50">
                Milestone certificates and retention release for {projects[0]?.name}. Detailed commercial papers live under
                the project financials tab and are issued through your commercial contact.
              </p>
            </div>
            <div className="mt-6">
              <dl className="grid grid-cols-2 gap-4 border-t border-paper/10 pt-4">
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/35">Contract sum</dt>
                  <dd className="mt-1 font-mono text-lg tabular-nums text-paper/85">
                    TZS {(metrics.capitalBudget / 1_000_000_000).toFixed(1)}B
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/35">Certified to date</dt>
                  <dd className="mt-1 font-mono text-lg tabular-nums text-gold">
                    TZS {(metrics.capitalDeployed / 1_000_000_000).toFixed(1)}B
                  </dd>
                </div>
              </dl>
              <ul className="mt-4 divide-y divide-paper/[0.08] border-t border-paper/10">
                {data.invoices.slice(0, 3).map((invoice) => (
                  <li key={invoice.id} className="flex items-center justify-between gap-3 py-2">
                    <span className="min-w-0 truncate font-mono text-[9.5px] uppercase tracking-[0.1em] text-paper/45">
                      {invoice.invoiceNumber} · {invoice.milestone}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] tabular-nums text-paper/70">{tzs(invoice.amount)}</span>
                    <Chip tone={invoice.status === "paid" ? "green" : invoice.status === "overdue" ? "red" : "gold"} className="px-1.5 py-0">
                      {statusLabel[invoice.status] ?? invoice.status}
                    </Chip>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        )}
        <Panel className="min-h-[330px]">
          <AlertsRail
            alerts={alerts}
            projectNames={projectNames}
            canAcknowledge={viewer.role !== "client"}
            showSafetyLink={viewer.role !== "client"}
          />
        </Panel>
      </div>

      {/* Map + logs */}
      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <Panel className="self-start xl:col-span-2">
          <LiveProjectMap projects={projects} />
        </Panel>
        <Panel className="flex flex-col">
          <PanelHeader
            eyebrow="Field feed"
            title="Today on site"
            action={
              viewer.role !== "client" ? (
                <Link
                  href="/dashboard/safety"
                  className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40 hover:text-gold"
                >
                  Register →
                </Link>
              ) : null
            }
          />
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {logs.slice(0, 2).map((entry) => (
              <DailyLogCard
                key={entry.id}
                log={entry}
                projectName={projectNames[entry.projectId]}
                author={users[entry.createdBy]}
                compact
              />
            ))}
            {logs.length === 0 ? (
              <p className="px-2 py-8 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">
                No field reports yet
              </p>
            ) : null}
          </div>
          <div className="border-t border-paper/10 px-4 py-2.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/35">
              {logs.filter((log) => log.logDate === "2026-11-22").length} logs submitted yesterday ·{" "}
              {incidents.filter((incident) => incident.status !== "resolved").length} open safety items
            </p>
          </div>
        </Panel>
      </div>

      {/* Register */}
      <Panel className="mt-3">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-paper/10 px-4 py-3.5 sm:px-5">
          <div>
            <Eyebrow>Project register</Eyebrow>
            <h2 className="mt-1 text-[15px] font-semibold tracking-tight text-paper">
              {filtered.length} {filtered.length === 1 ? "site" : "sites"} in view
            </h2>
          </div>
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((option) => {
              const count =
                option.id === "all"
                  ? projects.length
                  : projects.filter((project) => project.status === option.id).length;
              if (count === 0 && option.id !== "all") return null;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilter(option.id)}
                  aria-pressed={filter === option.id}
                  className={cn(
                    "min-h-8 border px-2.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                    filter === option.id
                      ? "border-gold/50 bg-gold/10 text-gold"
                      : "border-paper/15 text-paper/45 hover:border-paper/30 hover:text-paper/70",
                  )}
                >
                  {option.label} <span className="tabular-nums text-paper/30">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        <ProjectTable projects={filtered} />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-paper/10 px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30">
            Portfolio completion {pct(projects.reduce((sum, project) => sum + project.completion, 0) / Math.max(projects.length, 1), 1)}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30">
            Best-in-class threshold · variance ≤ 5 days
          </p>
        </div>
      </Panel>

      {/* Approvals + audit */}
      <div className="mt-3 grid gap-3 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <ApprovalsPanel
            rfis={pendingRfis}
            projectNames={projectNames}
            canApprove={viewer.role === "executive" || viewer.role === "pm"}
          />
        </Panel>
        <Panel className="flex flex-col">
          <PanelHeader eyebrow="Immutable log" title="Audit trail" />
          <ol className="flex-1 divide-y divide-paper/[0.08]">
            {audit.slice(0, 5).map((entry) => (
              <li key={entry.id} className="px-4 py-2.5 sm:px-5">
                <p className="text-[12px] leading-snug text-paper/75">{entry.action}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/30">
                  {users[entry.actorId] ?? "System"} · {relative(entry.createdAt)}
                </p>
                <p className="mt-1 line-clamp-1 text-[11px] text-paper/40">{entry.detail}</p>
              </li>
            ))}
            {audit.length === 0 ? (
              <li className="px-4 py-8 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-paper/30">
                Audit trail restricted for this role
              </li>
            ) : null}
          </ol>
          <div className="border-t border-paper/10 px-4 py-2.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30">
              Compliance {pct(compliance, 0)} · {statusLabel["action-required"]} items{" "}
              {checklist.filter((item) => item.status !== "compliant").length}
            </p>
          </div>
        </Panel>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/25">
          ALTRA COMMAND · demo dataset mirroring supabase/schema.sql
        </p>
        {viewer.role !== "client" ? (
          <Link
            href="/dashboard/safety"
            className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.16em] text-gold/80 hover:text-gold"
          >
            Safety & compliance <ArrowUpRight className="h-3 w-3" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-3 px-3 pb-10 pt-5 sm:px-5">
      <LoadingBlock className="h-16 w-2/3" />
      <div className="grid grid-cols-1 gap-px bg-paper/10 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <div key={key} className="space-y-3 bg-[#14161E] p-4">
            <LoadingBlock className="h-2.5 w-20" />
            <LoadingBlock className="h-8 w-32" />
            <LoadingBlock className="h-2 w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        <LoadingBlock className="h-[340px] xl:col-span-2" />
        <LoadingBlock className="h-[340px]" />
      </div>
      <LoadingBlock className="h-[280px]" />
    </div>
  );
}
