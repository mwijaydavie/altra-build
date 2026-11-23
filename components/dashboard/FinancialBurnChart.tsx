"use client";

import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { tzs, tzsAxis } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { MonthlyFinancial } from "@/types/construction";

type Range = "6M" | "12M";

export function FinancialBurnChart({
  series,
  compact = false,
}: {
  series: MonthlyFinancial[];
  compact?: boolean;
}) {
  const [range, setRange] = useState<Range>(compact ? "6M" : "12M");
  const data = range === "6M" ? series.slice(-6) : series;
  const totalOutflow = series.reduce((sum, row) => sum + row.outflow, 0);
  const totalBilling = series.reduce((sum, row) => sum + row.billing, 0);
  const coverage = totalBilling === 0 ? 0 : totalBilling / totalOutflow;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 pb-1 pt-4 sm:px-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
            Cash position · FY 2026
          </p>
          <h2 className="mt-1 text-[15px] font-semibold tracking-tight text-paper">
            Financial burn vs milestone billing
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
            Outflow {tzs(totalOutflow)} · Billed {tzs(totalBilling)} · Coverage {Math.round(coverage * 100)}%
          </p>
        </div>
        <div className="flex border border-paper/15" role="group" aria-label="Chart range">
          {(["6M", "12M"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRange(option)}
              aria-pressed={range === option}
              className={cn(
                "min-h-8 px-3 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors",
                range === option ? "bg-gold text-ink" : "text-paper/50 hover:text-paper",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("mt-2 w-full flex-1", compact ? "h-[220px]" : "h-[280px]")}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
            <defs>
              <linearGradient id="billingFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7BC32" stopOpacity={0.34} />
                <stop offset="100%" stopColor="#F7BC32" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(247,242,231,0.08)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(247,242,231,0.45)", fontSize: 10, fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "rgba(247,242,231,0.12)" }}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tickFormatter={(value: number) => tzsAxis(value)}
              tick={{ fill: "rgba(247,242,231,0.4)", fontSize: 10, fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip
              cursor={{ stroke: "rgba(247,188,50,0.4)", strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="border border-paper/20 bg-[#0B0D13] px-3 py-2 shadow-2xl">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/40">{label} 2026</p>
                    {payload.map((entry) => (
                      <p key={String(entry.dataKey)} className="mt-1 flex items-center gap-2 text-[11px] text-paper/80">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="capitalize">{String(entry.dataKey)}</span>
                        <span className="ml-auto font-mono tabular-nums">{tzs(Number(entry.value))}</span>
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="billing"
              stroke="#F7BC32"
              strokeWidth={2}
              fill="url(#billingFill)"
              name="Milestone billing"
            />
            <Line
              type="monotone"
              dataKey="outflow"
              stroke="#F26D5B"
              strokeWidth={1.8}
              dot={false}
              name="Outflow"
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="rgba(247,242,231,0.42)"
              strokeDasharray="4 4"
              strokeWidth={1.4}
              dot={false}
              name="Forecast"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-paper/10 px-4 py-3 sm:px-5">
        {[
          { label: "Milestone billing", color: "#F7BC32" },
          { label: "Outflow", color: "#F26D5B" },
          { label: "Forecast", color: "rgba(247,242,231,0.42)", dashed: true },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/45">
            <span
              className="h-0.5 w-4"
              style={{
                background: item.dashed
                  ? `repeating-linear-gradient(90deg, ${item.color} 0 3px, transparent 3px 6px)`
                  : item.color,
              }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
