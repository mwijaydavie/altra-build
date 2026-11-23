"use client";

import { CheckCircle2, ClipboardCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { IncidentReportDialog } from "@/components/dashboard/IncidentReportDialog";
import { SafetyMatrix } from "@/components/dashboard/SafetyMatrix";
import { Chip, Eyebrow, LoadingBlock, Panel, PanelHeader } from "@/components/dashboard/ui";
import { useOpsSnapshot, useSignOffIncident } from "@/lib/ops/hooks";
import { formatDate, pct, relative, severityTone, statusLabel } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { IncidentStatus } from "@/types/construction";

const CHECK_FILTERS = [
  { id: "all", label: "All clauses" },
  { id: "action-required", label: "Action required" },
  { id: "overdue", label: "Overdue" },
  { id: "compliant", label: "Compliant" },
] as const;

const INCIDENT_FILTERS: { id: "all" | IncidentStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "under-review", label: "Under review" },
  { id: "resolved", label: "Resolved" },
];

export default function SafetyPage() {
  const { data, isLoading } = useOpsSnapshot();
  const signOff = useSignOffIncident();
  const [checkFilter, setCheckFilter] = useState<(typeof CHECK_FILTERS)[number]["id"]>("all");
  const [incidentFilter, setIncidentFilter] = useState<"all" | IncidentStatus>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const projectNames = useMemo(
    () => Object.fromEntries((data?.projects ?? []).map((project) => [project.id, project.name])),
    [data],
  );
  const people = useMemo(
    () => Object.fromEntries((data?.users ?? []).map((user) => [user.id, user.fullName])),
    [data],
  );

  if (isLoading || !data) {
    return (
      <div className="space-y-3 px-3 py-5 sm:px-5">
        <LoadingBlock className="h-16 w-1/2" />
        <div className="grid gap-3 xl:grid-cols-3">
          <LoadingBlock className="h-56" />
          <LoadingBlock className="h-56 xl:col-span-2" />
        </div>
        <LoadingBlock className="h-64" />
      </div>
    );
  }

  if (data.viewer.role === "client") {
    return (
      <div className="px-4 py-16">
        <Panel className="mx-auto max-w-md p-6">
          <Eyebrow>Restricted area</Eyebrow>
          <h1 className="mt-2 text-lg font-semibold text-paper">HSE register is internal</h1>
          <p className="mt-2 text-sm text-paper/50">
            Clients receive a monthly safety summary through their project manager. Individual incident records remain
            confidential to protect worker privacy.
          </p>
        </Panel>
      </div>
    );
  }

  const { incidents, checklist, audit, projects } = data;
  const canSignOff = data.viewer.role === "executive" || data.viewer.role === "pm";
  const compliant = checklist.filter((item) => item.status === "compliant").length;
  const compliance = checklist.length ? compliant / checklist.length : 1;
  const checklistRows = checkFilter === "all" ? checklist : checklist.filter((item) => item.status === checkFilter);
  const incidentRows = incidentFilter === "all" ? incidents : incidents.filter((incident) => incident.status === incidentFilter);
  const openIncidents = incidents.filter((incident) => incident.status !== "resolved").length;
  const overdue = checklist.filter((item) => item.status === "overdue").length;

  const standards = ["ISO 45001", "OSHA", "Company"].map((standard) => {
    const rows = checklist.filter((item) => item.standard === standard);
    const ok = rows.filter((item) => item.status === "compliant").length;
    return { standard, total: rows.length, ok, ratio: rows.length ? ok / rows.length : 1 };
  });

  const onSignOff = (id: string) => {
    setError(null);
    setBusy(id);
    signOff.mutate(
      { id, status: "resolved" },
      {
        onError: (mutationError: Error) => setError(mutationError.message),
        onSettled: () => setBusy(null),
      },
    );
  };

  return (
    <div className="px-3 pb-10 pt-5 sm:px-5 sm:pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-paper/10 pb-5">
        <div>
          <Eyebrow>HSE · ISO 45001 / OSHA Tanzania</Eyebrow>
          <h1 className="mt-2 font-display text-[27px] font-semibold leading-none tracking-[-0.035em] text-paper sm:text-[34px]">
            Safety & compliance.
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-paper/50">
            Statutory checklist, incident severity matrix and signed audit trail across {projects.length} sites.{" "}
            {openIncidents} items remain unresolved.
          </p>
        </div>
        <IncidentReportDialog incidents={incidents} projectNames={projectNames} inspectorNames={people} />
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* Compliance score */}
        <Panel className="flex flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">Compliance score</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/30">Rolling 30 days</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-[#6FD3A6]" />
          </div>

          <div className="mt-4 flex items-center gap-5">
            <div className="relative h-[104px] w-[104px] shrink-0">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(247,242,231,0.1)" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#F7BC32"
                  strokeWidth="10"
                  strokeLinecap="butt"
                  strokeDasharray={`${compliance * 314} 314`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-semibold tabular-nums text-paper">{pct(compliance, 0)}</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/35">clauses met</span>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-2.5">
              {standards.map((row) => (
                <div key={row.standard}>
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.1em]">
                    <span className="text-paper/45">{row.standard}</span>
                    <span className="tabular-nums text-paper/60">
                      {row.ok}/{row.total}
                    </span>
                  </div>
                  <div className="mt-1 h-1 w-full bg-paper/10">
                    <div
                      className={cn("h-full", row.ratio === 1 ? "bg-[#6FD3A6]" : row.ratio >= 0.7 ? "bg-gold" : "bg-[#F26D5B]")}
                      style={{ width: `${row.ratio * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto grid grid-cols-3 gap-2 border-t border-paper/10 pt-3">
            {[
              { label: "LTI free", value: "26 mo" },
              { label: "TRIR", value: "0.00" },
              { label: "Overdue", value: `${overdue}` },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/30">{stat.label}</p>
                <p className={cn("mt-0.5 font-mono text-[13px] tabular-nums", stat.label === "Overdue" && overdue ? "text-[#F26D5B]" : "text-paper/80")}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        {/* Matrix */}
        <Panel>
          <PanelHeader
            eyebrow="Incident severity"
            title="Severity × status matrix"
            action={
              <div className="flex gap-1">
                <Chip tone="green">{incidents.filter((incident) => incident.status === "resolved").length} resolved</Chip>
                <Chip tone="red">{openIncidents} open</Chip>
              </div>
            }
          />
          <SafetyMatrix incidents={incidents} />
        </Panel>
      </div>

      {/* Checklist */}
      <Panel className="mt-3">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-paper/10 px-4 py-3.5 sm:px-5">
          <div>
            <Eyebrow>Statutory checklist</Eyebrow>
            <h2 className="mt-1 text-[15px] font-semibold tracking-tight text-paper">ISO 45001 & OSHA controls</h2>
          </div>
          <div className="flex flex-wrap gap-1">
            {CHECK_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setCheckFilter(filter.id)}
                aria-pressed={checkFilter === filter.id}
                className={cn(
                  "min-h-8 border px-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors",
                  checkFilter === filter.id
                    ? "border-gold/50 bg-gold/10 text-gold"
                    : "border-paper/15 text-paper/45 hover:text-paper/75",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-paper/[0.08]">
          {checklistRows.map((item) => (
            <li key={item.id} className="flex flex-wrap items-start gap-3 px-4 py-3 sm:px-5">
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border",
                  item.status === "compliant"
                    ? "border-[#6FD3A6]/30 bg-[#6FD3A6]/10 text-[#6FD3A6]"
                    : item.status === "overdue"
                      ? "border-[#F26D5B]/40 bg-[#F26D5B]/10 text-[#F26D5B]"
                      : "border-gold/30 bg-gold/10 text-gold",
                )}
              >
                {item.status === "compliant" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/35">{item.clause}</span>
                  <Chip
                    tone={item.status === "compliant" ? "green" : item.status === "overdue" ? "red" : "gold"}
                    className="px-1.5 py-0"
                  >
                    {statusLabel[item.status] ?? item.status}
                  </Chip>
                </div>
                <p className="mt-1 text-[12.5px] leading-snug text-paper/75">{item.requirement}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/30">
                  {item.standard} · owner {people[item.owner] ?? "HSE"} · audited {formatDate(item.lastAudited)}
                </p>
              </div>
              <ClipboardCheck className="h-4 w-4 text-paper/20" />
            </li>
          ))}
          {checklistRows.length === 0 ? (
            <li className="px-4 py-8 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-paper/30">
              No clauses in this state
            </li>
          ) : null}
        </ul>
      </Panel>

      {/* Incidents */}
      <Panel className="mt-3">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-paper/10 px-4 py-3.5 sm:px-5">
          <div>
            <Eyebrow>Incident register</Eyebrow>
            <h2 className="mt-1 text-[15px] font-semibold tracking-tight text-paper">
              {incidentRows.length} {incidentRows.length === 1 ? "record" : "records"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-1">
            {INCIDENT_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setIncidentFilter(filter.id)}
                aria-pressed={incidentFilter === filter.id}
                className={cn(
                  "min-h-8 border px-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors",
                  incidentFilter === filter.id
                    ? "border-gold/50 bg-gold/10 text-gold"
                    : "border-paper/15 text-paper/45 hover:text-paper/75",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <p className="border-b border-[#F26D5B]/30 bg-[#F26D5B]/10 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#F26D5B]">
            {error}
          </p>
        ) : null}

        <ul className="divide-y divide-paper/[0.08]">
          {incidentRows.map((incident) => (
            <li key={incident.id} className="px-4 py-3.5 sm:px-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em]", severityTone[incident.severity])}>
                      {incident.severity}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/35">
                      {incident.type.replace("-", " ")}
                    </span>
                    <Chip
                      tone={incident.status === "resolved" ? "green" : incident.status === "open" ? "red" : "gold"}
                      className="px-1.5 py-0"
                    >
                      {statusLabel[incident.status] ?? incident.status}
                    </Chip>
                  </div>
                  <p className="mt-1.5 text-[12.5px] font-medium leading-snug text-paper/85">{incident.title}</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-paper/45">{incident.description}</p>
                  {incident.correctiveAction ? (
                    <p className="mt-1.5 border-l border-gold/40 pl-2 text-[11px] leading-snug text-paper/50">
                      <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-gold/80">Action · </span>
                      {incident.correctiveAction}
                    </p>
                  ) : null}
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/25">
                    {projectNames[incident.projectId] ?? "Portfolio"} · {relative(incident.occurredAt)} ·{" "}
                    {people[incident.inspectorId] ?? "HSE"} ·{" "}
                    {incident.signedOffAt ? `signed ${relative(incident.signedOffAt)} by ${people[incident.signedOffBy ?? ""] ?? "director"}` : "unsigned"}
                  </p>
                </div>
                {canSignOff && incident.status !== "resolved" ? (
                  <button
                    type="button"
                    disabled={busy === incident.id}
                    onClick={() => onSignOff(incident.id)}
                    className="inline-flex min-h-8 shrink-0 items-center gap-1 border border-[#6FD3A6]/40 px-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6FD3A6] hover:bg-[#6FD3A6]/10 disabled:opacity-40"
                  >
                    <CheckCircle2 className="h-3 w-3" /> Sign off
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      {/* Audit */}
      <Panel className="mt-3">
        <PanelHeader eyebrow="Immutable log" title="Safety audit trail" action={<Chip tone="neutral">{audit.length} entries</Chip>} />
        <ol className="divide-y divide-paper/[0.08]">
          {audit.slice(0, 6).map((entry) => (
            <li key={entry.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5 sm:px-5">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-gold/70">{relative(entry.createdAt)}</span>
              <span className="text-[12px] text-paper/75">{entry.action}</span>
              <span className="min-w-0 flex-1 truncate text-[11px] text-paper/35">{entry.detail}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-paper/30">
                {people[entry.actorId] ?? "System"}
              </span>
            </li>
          ))}
        </ol>
      </Panel>

      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/25">
        Records retained 7 years · statutory reporting within 24h under OSHA TZ §105 · sign-off restricted to PM and
        director roles
      </p>
    </div>
  );
}
