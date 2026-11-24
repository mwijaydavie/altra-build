"use client";

import { Chip } from "@/components/dashboard/ui";
import { formatDateShort } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { Phase } from "@/types/construction";

const DAY = 86_400_000;
const TODAY = new Date("2026-11-23T00:00:00Z").getTime();

const toTime = (iso: string) => new Date(`${iso}T00:00:00Z`).getTime();

const monthTicks = (start: number, end: number) => {
  const ticks: { label: string; left: number }[] = [];
  const cursor = new Date(start);
  cursor.setUTCDate(1);
  while (cursor.getTime() <= end) {
    ticks.push({
      label: cursor.toLocaleDateString("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" }),
      left: ((cursor.getTime() - start) / (end - start)) * 100,
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 3);
  }
  return ticks;
};

export function GanttTimeline({ phases }: { phases: Phase[] }) {
  if (!phases.length) return null;

  const start = Math.min(...phases.map((phase) => toTime(phase.startDate)));
  const end = Math.max(...phases.map((phase) => toTime(phase.endDate)));
  const span = Math.max(end - start, 1);
  const ticks = monthTicks(start, end);
  const todayLeft = ((TODAY - start) / span) * 100;
  const showToday = todayLeft >= 0 && todayLeft <= 100;

  return (
    <div className="overflow-x-auto" data-lenis-prevent>
      <div className="min-w-[680px] px-4 pb-4 pt-3 sm:px-5">
        {/* Axis */}
        <div className="grid grid-cols-[180px_1fr] gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/55">Phase</span>
          <div className="relative h-5 border-b border-paper/10">
            {ticks.map((tick) => (
              <span
                key={`${tick.label}-${tick.left}`}
                className="absolute -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/55"
                style={{ left: `${tick.left}%` }}
              >
                {tick.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-1">
          {showToday ? (
            <div
              className="pointer-events-none absolute bottom-0 top-0 z-10 border-l border-dashed border-gold/60"
              style={{ left: `calc(180px + 12px + (100% - 192px) * ${todayLeft / 100})` }}
            >
              <span className="absolute -top-1 left-1 whitespace-nowrap bg-gold px-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-ink">
                Today
              </span>
            </div>
          ) : null}

          {phases.map((phase) => {
            const phaseStart = toTime(phase.startDate);
            const phaseEnd = toTime(phase.endDate);
            const offset = ((phaseStart - start) / span) * 100;
            const width = Math.max(((phaseEnd - phaseStart) / span) * 100, 1.5);
            const duration = Math.round((phaseEnd - phaseStart) / DAY);
            const tone =
              phase.status === "complete"
                ? "green"
                : phase.status === "blocked"
                  ? "red"
                  : phase.status === "in-progress"
                    ? "gold"
                    : "muted";

            return (
              <div key={phase.id} className="grid grid-cols-[180px_1fr] items-center gap-3 border-b border-paper/[0.06] py-2.5 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-medium text-paper/85">{phase.name}</p>
                  <p className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.06em] text-paper/55">
                    {formatDateShort(phase.startDate)} — {formatDateShort(phase.endDate)} · {duration}d
                  </p>
                </div>
                <div className="relative h-7">
                  <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper/10" />
                  <div
                    className={cn(
                      "absolute top-1/2 h-6 -translate-y-1/2 overflow-hidden border",
                      tone === "green"
                        ? "border-[#6FD3A6]/40 bg-[#6FD3A6]/10"
                        : tone === "red"
                          ? "border-[#F26D5B]/50 bg-[#F26D5B]/10"
                          : tone === "gold"
                            ? "border-gold/50 bg-gold/10"
                            : "border-paper/15 bg-paper/[0.04]",
                    )}
                    style={{ left: `${offset}%`, width: `${width}%` }}
                    title={`${phase.name}: ${phase.progress}% (${phase.status})`}
                  >
                    <div
                      className={cn(
                        "h-full",
                        tone === "green"
                          ? "bg-[#6FD3A6]/35"
                          : tone === "red"
                            ? "bg-[#F26D5B]/30"
                            : tone === "gold"
                              ? "bg-gold/35"
                              : "bg-paper/10",
                      )}
                      style={{ width: `${phase.progress}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/70">
                      {phase.progress}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Chip tone="green">Complete</Chip>
          <Chip tone="gold">In progress</Chip>
          <Chip tone="neutral">Not started</Chip>
          <Chip tone="red">Blocked</Chip>
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.12em] text-paper/55">
            Baseline programme · phase weights applied to % complete
          </span>
        </div>
      </div>
    </div>
  );
}
