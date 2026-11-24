import { ArrowDownRight, ArrowUpRight, Banknote, HardHat, ShieldCheck, TimerReset } from "lucide-react";

import { Meter, MetricSpark } from "@/components/dashboard/ui";
import { compact, num, pct, tzs } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { PortfolioMetrics } from "@/types/construction";

export function ExecutiveSummaryCards({
  metrics,
  scopeLabel = "portfolio",
}: {
  metrics: PortfolioMetrics;
  scopeLabel?: string;
}) {
  const cards = [
    {
      id: "capital",
      eyebrow: "01 / Capital",
      icon: Banknote,
      value: tzs(metrics.capitalDeployed),
      label: "Capital deployed",
      detail: `of ${tzs(metrics.capitalBudget)} ${scopeLabel} budget`,
      progress: metrics.capitalUtilisation * 100,
      progressLabel: `${pct(metrics.capitalUtilisation)} utilised`,
      trend: { direction: "up" as const, text: "+4.2% vs Oct", tone: "text-[#6FD3A6]" },
      spark: [42, 55, 61, 58, 72, 81, 88, 94],
      iconTone: "text-gold",
    },
    {
      id: "sites",
      eyebrow: "02 / Deployed",
      icon: HardHat,
      value: `${metrics.activeSites}`,
      suffix: `/${metrics.totalSites}`,
      label: "Active sites & workforce",
      detail: `${num(metrics.liveWorkforce)} workers on shift today`,
      progress: (metrics.activeSites / Math.max(metrics.totalSites, 1)) * 100,
      progressLabel: `${metrics.totalSites - metrics.activeSites} in handover, pre-con or hold`,
      trend: { direction: "up" as const, text: "+38 crew vs last week", tone: "text-[#6FD3A6]" },
      spark: [62, 64, 61, 68, 72, 74, 71, 79],
      iconTone: "text-[#8FB8A8]",
    },
    {
      id: "schedule",
      eyebrow: "03 / Critical path",
      icon: TimerReset,
      value: `+${metrics.worstDelayDays}`,
      suffix: "days",
      label: "Critical-path delays",
      detail: `${metrics.delayedCritical} sites carrying variance`,
      progress: Math.min((metrics.worstDelayDays / 30) * 100, 100),
      progressLabel: metrics.worstDelayDays >= 10 ? "Escalation threshold breached" : "Within recovery window",
      trend:
        metrics.delayedCritical > 0
          ? { direction: "down" as const, text: `${metrics.delayedCritical} sites to recover`, tone: "text-[#F08A4B]" }
          : { direction: "up" as const, text: "All on baseline", tone: "text-[#6FD3A6]" },
      spark: [4, 6, 9, 7, 11, 10, 13, 14],
      iconTone: "text-[#F08A4B]",
    },
    {
      id: "safety",
      eyebrow: "04 / Safety",
      icon: ShieldCheck,
      value: compact(metrics.safeManHours),
      suffix: "hrs",
      label: "Safe man-hours, no LTI",
      detail: `${metrics.ltiMonths} months LTI-free · TRIR ${metrics.trir.toFixed(2)}`,
      progress: 100,
      progressLabel: "ISO 45001 aligned · 0 lost-time injuries",
      trend: { direction: "up" as const, text: "2.1M hrs without incident", tone: "text-[#6FD3A6]" },
      spark: [22, 34, 41, 55, 63, 72, 81, 92],
      iconTone: "text-[#6FD3A6]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-px bg-paper/10 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trend.direction === "up" ? ArrowUpRight : ArrowDownRight;
        return (
          <article
            key={card.id}
            className="group relative flex flex-col bg-[var(--ops-panel-2)] px-4 py-4 transition-colors hover:bg-[var(--ops-raised)] sm:px-5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-paper/35">{card.eyebrow}</p>
              <Icon className={cn("h-4 w-4", card.iconTone)} strokeWidth={1.5} />
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="font-display text-[30px] font-semibold leading-none tracking-[-0.04em] text-paper sm:text-[34px]">
                {card.value}
              </span>
              {card.suffix ? (
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/40">{card.suffix}</span>
              ) : null}
            </div>
            <p className="mt-2 text-[12.5px] font-medium text-paper/75">{card.label}</p>
            <p className="mt-0.5 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.1em] text-paper/35">
              {card.detail}
            </p>

            <div className="mt-3">
              <Meter value={card.progress} tone={card.id === "schedule" ? "orange" : card.id === "safety" ? "green" : "gold"} />
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-paper/30">
                  {card.progressLabel}
                </span>
                <MetricSpark values={card.spark} tone={card.id === "safety" ? "green" : "gold"} />
              </div>
            </div>

            <p className={cn("mt-2 flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.1em]", card.trend.tone)}>
              <TrendIcon className="h-3 w-3" /> {card.trend.text}
            </p>
          </article>
        );
      })}
    </div>
  );
}
