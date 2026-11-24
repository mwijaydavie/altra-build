import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { trafficTone } from "@/lib/ops/format";
import type { TrafficLight } from "@/types/construction";

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */
export function Panel({
  children,
  className,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "aside";
}) {
  return (
    <Tag
      className={cn(
        "ops-panel relative rounded-lg border border-paper/12 bg-[var(--ops-panel)] shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-paper/10 px-4 py-3.5 sm:px-5",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 truncate text-[15px] font-semibold tracking-tight text-paper sm:text-base">
          {title}
        </h2>
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </header>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[10px] uppercase tracking-[0.26em] text-gold", className)}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Status                                                              */
/* ------------------------------------------------------------------ */
export function Chip({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "gold" | "green" | "red" | "orange";
}) {
  const tones: Record<string, string> = {
    neutral: "border-paper/15 bg-paper/[0.04] text-paper/70",
    gold: "border-gold/35 bg-gold/10 text-gold",
    green: "border-[#6FD3A6]/35 bg-[#6FD3A6]/10 text-[#6FD3A6]",
    red: "border-[#F26D5B]/40 bg-[#F26D5B]/10 text-[#F26D5B]",
    orange: "border-[#F08A4B]/40 bg-[#F08A4B]/10 text-[#F08A4B]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TrafficDot({ light, label = true }: { light: TrafficLight; label?: boolean }) {
  const tone = trafficTone[light] ?? trafficTone.green!;
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("relative flex h-2 w-2 rounded-full", tone.dot)}>
        <span className={cn("absolute inset-0 animate-ping rounded-full opacity-40", tone.dot)} />
      </span>
      {label ? (
        <span className={cn("font-mono text-[10px] uppercase tracking-[0.18em]", tone.text)}>
          {tone.label}
        </span>
      ) : null}
    </span>
  );
}

export function Meter({
  value,
  tone = "gold",
  height = "h-1.5",
  className,
}: {
  value: number;
  tone?: "gold" | "green" | "red" | "orange";
  height?: string;
  className?: string;
}) {
  const fills: Record<string, string> = {
    gold: "bg-gold",
    green: "bg-[#6FD3A6]",
    red: "bg-[#F26D5B]",
    orange: "bg-[#F08A4B]",
  };
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <span className={cn("block w-full overflow-hidden bg-paper/10", height, className)}>
      <span
        className={cn("block h-full transition-[width] duration-700 ease-out", fills[tone])}
        style={{ width: `${clamped}%` }}
      />
    </span>
  );
}

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-mono uppercase tracking-wider text-gold",
        size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-[11px]",
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function DataRow({
  label,
  value,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-2", className)}>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/55">{label}</dt>
      <dd className="text-right text-[13px] text-paper/85">{value}</dd>
    </div>
  );
}

export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-6 py-12 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">{title}</p>
      {detail ? <p className="max-w-sm text-sm text-paper/55">{detail}</p> : null}
    </div>
  );
}

export function LoadingBlock({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse border border-paper/10 bg-paper/[0.04]", className)} />
  );
}

export function MetricSpark({ values, tone = "gold" }: { values: number[]; tone?: "gold" | "green" }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 30 - ((value - min) / range) * 26;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 32" className="h-8 w-24" aria-hidden="true" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={tone === "gold" ? "#F7BC32" : "#6FD3A6"}
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
