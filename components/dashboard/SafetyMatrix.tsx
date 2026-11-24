import { cn } from "@/lib/utils";
import type { IncidentSeverity, IncidentStatus, SafetyIncident } from "@/types/construction";

const SEVERITIES: IncidentSeverity[] = ["critical", "high", "medium", "low"];
const STATUSES: { id: IncidentStatus; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "under-review", label: "Review" },
  { id: "resolved", label: "Resolved" },
];

const heat = (count: number, severity: IncidentSeverity, status: IncidentStatus): string => {
  if (count === 0) return "text-paper/20 border-paper/[0.08] bg-transparent";
  if (severity === "critical" || severity === "high") {
    return status === "resolved"
      ? "text-[#8FB8A8] border-[#8FB8A8]/25 bg-[#8FB8A8]/[0.06]"
      : "text-[#F26D5B] border-[#F26D5B]/35 bg-[#F26D5B]/10";
  }
  return status === "resolved"
    ? "text-[#6FD3A6] border-[#6FD3A6]/25 bg-[#6FD3A6]/[0.06]"
    : "text-gold border-gold/25 bg-gold/[0.07]";
};

export function SafetyMatrix({ incidents }: { incidents: SafetyIncident[] }) {
  const cell = (severity: IncidentSeverity, status: IncidentStatus) =>
    incidents.filter((incident) => incident.severity === severity && incident.status === status).length;

  return (
    <div>
      <div className="grid grid-cols-[76px_repeat(3,minmax(0,1fr))] gap-1 p-3 sm:p-4">
        <span />
        {STATUSES.map((status) => (
          <span
            key={status.id}
            className="pb-1 text-center font-mono text-[8.5px] uppercase tracking-[0.14em] text-paper/55"
          >
            {status.label}
          </span>
        ))}
        {SEVERITIES.map((severity) => (
          <div key={severity} className="contents">
            <span className="flex items-center font-mono text-[9px] uppercase tracking-[0.12em] text-paper/55">
              {severity}
            </span>
            {STATUSES.map((status) => {
              const count = cell(severity, status.id);
              return (
                <div
                  key={status.id}
                  className={cn(
                    "flex aspect-[2.8/1] items-center justify-center border font-mono text-[15px] tabular-nums transition-colors",
                    heat(count, severity, status.id),
                  )}
                  aria-label={`${severity} ${status.label}: ${count}`}
                >
                  {count}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-paper/10 px-3 py-2.5 sm:px-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/55">
          Severity × status · live register
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/55">
          {incidents.filter((incident) => incident.status !== "resolved").length} unresolved
        </p>
      </div>
    </div>
  );
}
