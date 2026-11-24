import { Camera, CloudLightning, CloudRain, CloudSun, Droplets, Sun, ThermometerSun, Wind } from "lucide-react";

import { Chip } from "@/components/dashboard/ui";
import { formatDate, num } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { DailySiteLog, WeatherCondition } from "@/types/construction";

const WEATHER: Record<WeatherCondition, { label: string; Icon: typeof Sun }> = {
  clear: { label: "Clear", Icon: Sun },
  cloudy: { label: "Cloudy", Icon: CloudSun },
  "light-rain": { label: "Light rain", Icon: CloudRain },
  "heavy-rain": { label: "Heavy rain", Icon: CloudLightning },
  windy: { label: "Windy", Icon: Wind },
  "extreme-heat": { label: "Extreme heat", Icon: ThermometerSun },
};

export function DailyLogCard({
  log,
  projectName,
  author,
  compact = false,
}: {
  log: DailySiteLog;
  projectName?: string;
  author?: string;
  compact?: boolean;
}) {
  const weather = WEATHER[log.weather];
  const Icon = weather.Icon;
  const hasDelays = log.delays && log.delays.toLowerCase() !== "none." && log.delays.toLowerCase() !== "none";

  return (
    <article
      className={cn(
        "border border-paper/10 bg-[var(--ops-panel-2)] p-3.5 transition-colors hover:border-paper/20 sm:p-4",
        compact && "p-3",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
              {formatDate(log.logDate)}
            </span>
            <Chip tone={log.syncedFromField ? "green" : "gold"} className="px-1.5 py-0">
              {log.syncedFromField ? "Synced" : "Queued"}
            </Chip>
          </div>
          {projectName ? (
            <p className="mt-1 truncate text-[13px] font-medium text-paper/90">{projectName}</p>
          ) : null}
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/35">
            {author ?? "Field team"} · {log.manpowerTotal} on site
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/55">
            <Icon className="h-3.5 w-3.5 text-paper/50" /> {weather.label}
          </span>
          <span className="font-mono text-[10px] tabular-nums text-paper/35">{log.temperatureC}°C</span>
        </div>
      </div>

      <p className="mt-2.5 line-clamp-3 text-[12.5px] leading-relaxed text-paper/65">{log.workCompleted}</p>

      {hasDelays ? (
        <p className="mt-2 flex items-start gap-1.5 border-l border-[#F08A4B]/50 bg-[#F08A4B]/[0.06] px-2 py-1.5 text-[11.5px] leading-snug text-[#F08A4B]/90">
          <Droplets className="mt-0.5 h-3 w-3 shrink-0" /> {log.delays}
        </p>
      ) : null}

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {log.manpower.slice(0, compact ? 3 : 4).map((entry) => (
          <span
            key={entry.trade}
            className="border border-paper/10 px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.08em] text-paper/40"
          >
            {entry.trade} {num(entry.count)}
          </span>
        ))}
        {log.manpower.length > (compact ? 3 : 4) ? (
          <span className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-paper/25">
            +{log.manpower.length - (compact ? 3 : 4)} trades
          </span>
        ) : null}
        {log.photos.length ? (
          <span className="ml-auto flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-paper/35">
            <Camera className="h-3 w-3" /> {log.photos.length}
          </span>
        ) : null}
      </div>
    </article>
  );
}
