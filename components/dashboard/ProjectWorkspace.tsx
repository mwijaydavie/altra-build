"use client";

import * as Tabs from "@radix-ui/react-tabs";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  FileText,
  Layers,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ApprovalsPanel } from "@/components/dashboard/ApprovalsPanel";
import { DailyLogCard } from "@/components/dashboard/DailyLogCard";
import { FinancialBurnChart } from "@/components/dashboard/FinancialBurnChart";
import { GanttTimeline } from "@/components/dashboard/GanttTimeline";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import {
  Avatar,
  Chip,
  DataRow,
  EmptyState,
  Eyebrow,
  LoadingBlock,
  Meter,
  Panel,
  PanelHeader,
  TrafficDot,
} from "@/components/dashboard/ui";
import { useMoveTask, useOpsSnapshot } from "@/lib/ops/hooks";
import { compact, formatDate, pct, relative, statusLabel, tzs } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { Role, TaskStatus } from "@/types/construction";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "programme", label: "Programme" },
  { id: "logs", label: "Daily logs" },
  { id: "financials", label: "Financials" },
  { id: "documents", label: "Documents" },
] as const;

const COST_COLORS = ["#F7BC32", "#C88F12", "#8FB8A8", "#F08A4B"];

export function ProjectWorkspace({ projectId, role }: { projectId: string; role: Role }) {
  const { data, isLoading } = useOpsSnapshot();
  const moveTask = useMoveTask();
  const [pendingTask, setPendingTask] = useState<string | null>(null);

  const project = data?.projects.find((entry) => entry.id === projectId);
  const projectNames = useMemo(
    () => Object.fromEntries((data?.projects ?? []).map((entry) => [entry.id, entry.name])),
    [data],
  );
  const users = data?.users ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3 px-3 py-5 sm:px-5">
        <LoadingBlock className="h-56" />
        <LoadingBlock className="h-40" />
      </div>
    );
  }

  if (!data || !project) {
    return (
      <div className="px-4 py-16">
        <Panel className="mx-auto max-w-md p-6">
          <Eyebrow>Site unavailable</Eyebrow>
          <h1 className="mt-2 text-lg font-semibold text-paper">This project is outside your scope</h1>
          <Link href="/dashboard" className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
            ← Back to command centre
          </Link>
        </Panel>
      </div>
    );
  }

  const phases = data.phases.filter((phase) => phase.projectId === project.id);
  const tasks = data.tasks.filter((task) => task.projectId === project.id);
  const logs = data.logs.filter((log) => log.projectId === project.id);
  const rfis = data.rfis.filter((rfi) => rfi.projectId === project.id);
  const invoices = data.invoices.filter((invoice) => invoice.projectId === project.id);
  const documents = data.documents.filter((document) => document.projectId === project.id);
  const team = (data.viewer.role === "client" ? [] : users).filter((user) =>
    ["u-pm1", "u-pm2", "u-eng1", "u-eng2"].includes(user.id),
  );

  const certified = invoices.filter((invoice) => invoice.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstanding = invoices.filter((invoice) => invoice.status !== "paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const canApprove = role === "executive" || role === "pm";
  const canMove = role === "executive" || role === "pm" || role === "engineer";
  const isClient = role === "client";

  const onMove = (taskId: string, status: TaskStatus) => {
    setPendingTask(taskId);
    moveTask.mutate(
      { id: taskId, status },
      { onSettled: () => setPendingTask(null) },
    );
  };

  const costBreakdown = [
    { label: "Materials", value: 42 },
    { label: "Labour & subcontract", value: 31 },
    { label: "Plant & logistics", value: 16 },
    { label: "Preliminaries", value: 11 },
  ];

  return (
    <div className="px-3 pb-10 pt-4 sm:px-5 sm:pt-5">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex min-h-9 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40 hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Command centre
        </Link>
        <div className="flex items-center gap-2">
          <Chip tone="neutral">{project.projectCode}</Chip>
          <Chip tone={project.status === "active" ? "green" : project.status === "on-hold" ? "red" : "gold"}>
            {statusLabel[project.status] ?? project.status}
          </Chip>
        </div>
      </div>

      {/* Hero */}
      <Panel className="mt-3 overflow-hidden">
        <div className="ops-dark-inset relative">
          <div className="relative h-44 w-full sm:h-56">
            <Image
              src={project.cover}
              alt={`${project.name} site`}
              fill
              sizes="(min-width: 1280px) 1000px, 100vw"
              className="object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-[#0F1117]/70 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4 sm:p-5">
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">{project.division}</p>
              <h1 className="mt-1.5 font-display text-[26px] font-semibold leading-none tracking-[-0.035em] text-paper sm:text-[34px]">
                {project.name}
              </h1>
              <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-paper/55">{project.summary}</p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <TrafficDot light={project.trafficLight} />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">
                {project.completion}% complete · {project.openTasks} open tasks
              </span>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 divide-paper/10 border-t border-paper/10 sm:grid-cols-4 sm:divide-x">
          {[
            { label: "Client", value: project.clientName, icon: Building2 },
            { label: "Project manager", value: project.manager, icon: Users },
            { label: "Target handover", value: formatDate(project.targetDate), icon: CalendarDays },
            { label: "Workforce today", value: `${project.workforce} on site`, icon: Layers },
          ].map((cell) => {
            const Icon = cell.icon;
            return (
              <div key={cell.label} className="flex items-start gap-2.5 p-3.5 sm:p-4">
                <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/60" />
                <div className="min-w-0">
                  <dt className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-paper/35">{cell.label}</dt>
                  <dd className="mt-1 truncate text-[12.5px] text-paper/80">{cell.value}</dd>
                </div>
              </div>
            );
          })}
        </dl>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-paper/10 px-4 py-2.5">
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/35">
            <MapPin className="h-3 w-3" /> {project.address}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/25">
            {project.lat.toFixed(4)}°, {project.lng.toFixed(4)}°
          </span>
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.12em] text-paper/35">
            {project.scheduleVarianceDays > 0 ? `+${project.scheduleVarianceDays}d behind baseline` : project.scheduleVarianceDays < 0 ? `${Math.abs(project.scheduleVarianceDays)}d ahead` : "On baseline"}
          </span>
        </div>
      </Panel>

      {/* Tabs */}
      <Tabs.Root defaultValue="overview" className="mt-3">
        <Tabs.List
          aria-label="Project sections"
          className="flex gap-1 overflow-x-auto border-b border-paper/10 pb-px"
        >
          {TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className="min-h-10 shrink-0 border-b-2 border-transparent px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45 transition-colors hover:text-paper/75 data-[state=active]:border-gold data-[state=active]:text-gold"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* OVERVIEW */}
        <Tabs.Content value="overview" className="mt-3 space-y-3 focus:outline-none">
          <div className="grid gap-3 xl:grid-cols-3">
            <Panel className="xl:col-span-2">
              <PanelHeader
                eyebrow="Programme"
                title="Phase completion"
                action={<span className="font-mono text-[10px] tabular-nums text-gold">{project.completion}%</span>}
              />
              <div className="space-y-3 p-4 sm:p-5">
                {phases.map((phase) => (
                  <div key={phase.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        {phase.status === "complete" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#6FD3A6]" />
                        ) : (
                          <Circle className={cn("h-3.5 w-3.5 shrink-0", phase.status === "in-progress" ? "text-gold" : "text-paper/25")} />
                        )}
                        <span className="truncate text-[12.5px] text-paper/80">{phase.name}</span>
                        <span className="hidden font-mono text-[9px] uppercase tracking-[0.1em] text-paper/25 sm:inline">
                          {phase.status.replace("-", " ")}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] tabular-nums text-paper/50">{phase.progress}%</span>
                    </div>
                    <Meter
                      value={phase.progress}
                      tone={phase.status === "complete" ? "green" : phase.status === "blocked" ? "red" : "gold"}
                      className="mt-1.5"
                    />
                    <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-paper/25">
                      {formatDate(phase.startDate)} — {formatDate(phase.endDate)} · weight {Math.round(phase.weight * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            <div className="space-y-3">
              <Panel>
                <PanelHeader eyebrow="Commercial" title="Contract position" />
                <dl className="divide-y divide-paper/[0.08] px-4 py-2 sm:px-5">
                  <DataRow label="Contract sum" value={tzs(project.budgetTotal)} />
                  <DataRow label="Cost to date" value={tzs(project.budgetSpent)} />
                  <DataRow label="Certified" value={tzs(certified)} />
                  <DataRow label="Outstanding" value={<span className={outstanding > 0 ? "text-gold" : ""}>{tzs(outstanding)}</span>} />
                  <DataRow label={isClient ? "Retention held" : "Gross margin"} value={isClient ? tzs(project.budgetTotal * 0.05) : pct(0.128)} />
                </dl>
                <div className="border-t border-paper/10 px-4 py-2.5 sm:px-5">
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-paper/30">
                    <span>Budget consumed</span>
                    <span>{pct(project.budgetSpent / project.budgetTotal)}</span>
                  </div>
                  <Meter value={(project.budgetSpent / project.budgetTotal) * 100} className="mt-1.5" />
                </div>
              </Panel>

              <Panel>
                <PanelHeader eyebrow="Milestones" title="Next gates" />
                <ul className="divide-y divide-paper/[0.08]">
                  {project.nextMilestone ? (
                    <li className="flex items-start gap-2.5 px-4 py-3">
                      <TrendingUp className="mt-0.5 h-3.5 w-3.5 text-gold" />
                      <div>
                        <p className="text-[12px] text-paper/80">{project.nextMilestone}</p>
                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/30">
                          Target {formatDate(project.nextMilestoneDate)}
                        </p>
                      </div>
                    </li>
                  ) : null}
                  {phases
                    .filter((phase) => phase.status === "not-started" || phase.status === "blocked")
                    .slice(0, 2)
                    .map((phase) => (
                      <li key={phase.id} className="flex items-start gap-2.5 px-4 py-3">
                        <Circle className="mt-0.5 h-3.5 w-3.5 text-paper/25" />
                        <div>
                          <p className="text-[12px] text-paper/60">{phase.name} start</p>
                          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/30">
                            {formatDate(phase.startDate)}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </Panel>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-3">
            <Panel className="xl:col-span-2">
              <PanelHeader
                eyebrow="Field report"
                title="Latest daily log"
                action={<span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/35">Field verified</span>}
              />
              <div className="p-3 sm:p-4">
                {logs[0] ? (
                  <DailyLogCard
                    log={logs[0]}
                    author={users.find((user) => user.id === logs[0]!.createdBy)?.fullName}
                  />
                ) : (
                  <EmptyState title="No daily log submitted" detail="Field teams submit a log at the end of each shift." />
                )}
              </div>
            </Panel>

            <Panel>
              <PanelHeader eyebrow="Safety" title="Site safety posture" />
              <div className="p-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-semibold text-paper">{compact(project.safeManHours)}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/35">safe man-hours</span>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center justify-between gap-2 border-b border-paper/[0.08] pb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/45">
                    <span>Open incidents</span>
                    <span className={project.openIncidents ? "text-[#F08A4B]" : "text-[#6FD3A6]"}>{project.openIncidents}</span>
                  </li>
                  <li className="flex items-center justify-between gap-2 border-b border-paper/[0.08] pb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/45">
                    <span>LTI days</span>
                    <span className="text-[#6FD3A6]">0</span>
                  </li>
                  <li className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/45">
                    <span>Toolbox talks</span>
                    <span className="text-paper/70">142 this year</span>
                  </li>
                </ul>
                <Link
                  href="/dashboard/safety"
                  className="mt-4 inline-flex min-h-9 items-center gap-1.5 border border-paper/20 px-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/60 hover:border-gold/40 hover:text-gold"
                >
                  <ShieldCheck className="h-3 w-3" /> Safety register
                </Link>
              </div>
            </Panel>
          </div>

          <Panel>
            <ApprovalsPanel rfis={rfis} projectNames={projectNames} canApprove={canApprove} />
          </Panel>
        </Tabs.Content>

        {/* PROGRAMME */}
        <Tabs.Content value="programme" className="mt-3 space-y-3 focus:outline-none">
          <Panel>
            <PanelHeader eyebrow="Baseline" title="Phase timeline" action={<span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/35">Scroll horizontally</span>} />
            <GanttTimeline phases={phases} />
          </Panel>
          <Panel>
            <PanelHeader
              eyebrow="Execution"
              title="Task board"
              action={<Chip tone="neutral">{tasks.filter((task) => task.status !== "done").length} open</Chip>}
            />
            <KanbanBoard
              tasks={tasks}
              users={users}
              canMove={canMove}
              onMove={onMove}
              pendingId={pendingTask}
            />
          </Panel>
        </Tabs.Content>

        {/* LOGS */}
        <Tabs.Content value="logs" className="mt-3 focus:outline-none">
          <Panel>
            <PanelHeader
              eyebrow="Field records"
              title="Daily site logs"
              action={
                <Link href="/field" className="inline-flex min-h-8 items-center border border-gold/40 px-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-gold hover:bg-gold hover:text-ink">
                  Submit log
                </Link>
              }
            />
            <div className="grid gap-2 p-3 sm:grid-cols-2 sm:p-4">
              {logs.map((log) => (
                <DailyLogCard
                  key={log.id}
                  log={log}
                  author={users.find((user) => user.id === log.createdBy)?.fullName}
                />
              ))}
              {logs.length === 0 ? (
                <div className="sm:col-span-2">
                  <EmptyState title="No logs yet" detail="The first shift log will appear here once synced." />
                </div>
              ) : null}
            </div>
          </Panel>
        </Tabs.Content>

        {/* FINANCIALS */}
        <Tabs.Content value="financials" className="mt-3 space-y-3 focus:outline-none">
          <div className="grid gap-px bg-paper/10 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Contract sum", value: tzs(project.budgetTotal), note: "Fixed-price lump sum" },
              { label: "Cost to date", value: tzs(project.budgetSpent), note: `${pct(project.budgetSpent / project.budgetTotal)} of contract` },
              { label: "Certified", value: tzs(certified), note: `${invoices.filter((invoice) => invoice.status === "paid").length} certificate{invoices.filter((invoice) => invoice.status === "paid").length === 1 ? "" : "s"} paid` },
              { label: "Outstanding", value: tzs(outstanding), note: `${invoices.filter((invoice) => invoice.status !== "paid").length} invoice{invoices.filter((invoice) => invoice.status !== "paid").length === 1 ? "" : "s"} open` },
            ].map((metric) => (
              <div key={metric.label} className="bg-[var(--ops-panel-2)] p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/35">{metric.label}</p>
                <p className="mt-2 font-display text-xl font-semibold tabular-nums text-paper">{metric.value}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/30">{metric.note}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 xl:grid-cols-3">
            <Panel className="xl:col-span-2">
              <FinancialBurnChart series={data.financials} />
            </Panel>
            <Panel>
              <PanelHeader eyebrow={isClient ? "Summary" : "Cost structure"} title={isClient ? "Contract breakdown" : "Where the money went"} />
              {isClient ? (
                <dl className="divide-y divide-paper/[0.08] px-4 py-2 sm:px-5">
                  <DataRow label="Contract sum" value={tzs(project.budgetTotal)} />
                  <DataRow label="Certified to date" value={tzs(certified)} />
                  <DataRow label="Retention (5%)" value={tzs(project.budgetTotal * 0.05)} />
                  <DataRow label="Next certificate" value={tzs(invoices.find((invoice) => invoice.status !== "paid")?.amount ?? 0)} />
                </dl>
              ) : (
                <div className="p-4">
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdown}
                          dataKey="value"
                          nameKey="label"
                          innerRadius={48}
                          outerRadius={74}
                          paddingAngle={2}
                          stroke="#0F1117"
                          strokeWidth={2}
                          animationDuration={500}
                        >
                          {costBreakdown.map((entry, index) => (
                            <Cell key={entry.label} fill={COST_COLORS[index % COST_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) =>
                            active && payload?.length ? (
                              <div className="border border-paper/20 bg-[var(--ops-dialog)] px-2.5 py-1.5 font-mono text-[10px] text-paper/80">
                                {payload[0]?.name}: {payload[0]?.value}%
                              </div>
                            ) : null
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {costBreakdown.map((entry, index) => (
                      <li key={entry.label} className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.1em] text-paper/45">
                        <span className="h-1.5 w-1.5" style={{ background: COST_COLORS[index % COST_COLORS.length] }} />
                        {entry.label}
                        <span className="ml-auto tabular-nums text-paper/70">{entry.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Panel>
          </div>

          <Panel>
            <PanelHeader eyebrow="Accounts receivable" title="Milestone invoices" action={<Chip tone="neutral">{invoices.length} total</Chip>} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-paper/10 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/30">
                    <th className="px-4 py-2 font-normal">Invoice</th>
                    <th className="px-4 py-2 font-normal">Milestone</th>
                    <th className="px-4 py-2 text-right font-normal">Amount</th>
                    <th className="px-4 py-2 font-normal">Issued</th>
                    <th className="px-4 py-2 font-normal">Due</th>
                    <th className="px-4 py-2 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-paper/[0.06] last:border-0">
                      <td className="px-4 py-2.5 font-mono text-[10px] text-paper/60">{invoice.invoiceNumber}</td>
                      <td className="px-4 py-2.5 text-[12px] text-paper/80">{invoice.milestone}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-[11px] tabular-nums text-paper/75">{tzs(invoice.amount)}</td>
                      <td className="px-4 py-2.5 font-mono text-[10px] text-paper/40">{formatDate(invoice.issuedAt)}</td>
                      <td className="px-4 py-2.5 font-mono text-[10px] text-paper/40">{formatDate(invoice.dueAt)}</td>
                      <td className="px-4 py-2.5">
                        <Chip tone={invoice.status === "paid" ? "green" : invoice.status === "overdue" ? "red" : "gold"}>
                          {statusLabel[invoice.status] ?? invoice.status}
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </Tabs.Content>

        {/* DOCUMENTS */}
        <Tabs.Content value="documents" className="mt-3 focus:outline-none">
          <Panel>
            <PanelHeader
              eyebrow="Document control"
              title="Project documents"
              action={<Chip tone="neutral">{documents.length} files</Chip>}
            />
            <ul className="divide-y divide-paper/[0.08]">
              {documents.map((document) => (
                <li key={document.id} className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-paper/[0.03] sm:px-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-paper/15 bg-paper/[0.03]">
                    <FileText className="h-4 w-4 text-gold/70" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-medium text-paper/85">{document.name}</p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/30">
                      {document.category} · Rev {document.revision} · {document.fileSize} ·{" "}
                      {users.find((user) => user.id === document.uploadedBy)?.fullName ?? "Document control"} ·{" "}
                      {relative(document.uploadedAt)}
                    </p>
                  </div>
                  <Chip tone={document.status === "current" ? "green" : document.status === "superseded" ? "neutral" : "gold"}>
                    {statusLabel[document.status] ?? document.status}
                  </Chip>
                </li>
              ))}
            </ul>
          </Panel>
        </Tabs.Content>
      </Tabs.Root>

      {team.length ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 border border-paper/10 bg-[var(--ops-panel-2)] px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/30">Site leadership</p>
          <div className="flex flex-wrap items-center gap-3">
            {team.slice(0, 4).map((member) => (
              <span key={member.id} className="flex items-center gap-2">
                <Avatar name={member.fullName} size="sm" />
                <span className="text-[11px] text-paper/60">{member.fullName.split(" ")[0]}</span>
              </span>
            ))}
          </div>
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.12em] text-paper/25">
            Audit-ready records · {data.viewer.role}
          </span>
        </div>
      ) : null}
    </div>
  );
}
