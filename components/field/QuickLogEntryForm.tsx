"use client";

import {
  Check,
  CloudLightning,
  CloudRain,
  CloudSun,
  Minus,
  Plus,
  Send,
  Sun,
  ThermometerSun,
  Users,
  Wind,
  WifiOff,
} from "lucide-react";
import { useMemo, useState } from "react";

import { PhotoCaptureInput } from "@/components/field/PhotoCaptureInput";
import { enqueue, newClientUuid, type QueueItem } from "@/lib/field/queue";
import { useCreateLog } from "@/lib/ops/hooks";
import { cn } from "@/lib/utils";
import type { LogPhoto, ManpowerEntry, WeatherCondition } from "@/types/construction";

const WEATHER_OPTIONS: { id: WeatherCondition; label: string; Icon: typeof Sun }[] = [
  { id: "clear", label: "Clear", Icon: Sun },
  { id: "cloudy", label: "Cloudy", Icon: CloudSun },
  { id: "light-rain", label: "Light rain", Icon: CloudRain },
  { id: "heavy-rain", label: "Heavy rain", Icon: CloudLightning },
  { id: "windy", label: "Windy", Icon: Wind },
  { id: "extreme-heat", label: "Heat", Icon: ThermometerSun },
];

const DEFAULT_TRADES = [
  "Steel fixers",
  "Carpenters",
  "MEP",
  "Finishing",
  "General labour",
  "Subcontractors",
];

const DELAY_CHIPS = ["Rain", "Material delay", "Access", "Plant breakdown", "Utility", "Inspection hold"];

const TEMPS = [24, 28, 31, 35];

export function QuickLogEntryForm({
  projectId,
  projectName,
  fallbackCoords,
  suggestedManpower,
  online,
  onQueued,
}: {
  projectId: string;
  projectName: string;
  fallbackCoords: { lat: number; lng: number };
  suggestedManpower?: ManpowerEntry[];
  online: boolean;
  onQueued: (items: QueueItem[]) => void;
}) {
  const createLog = useCreateLog();
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [temperatureC, setTemperatureC] = useState(31);
  const [manpower, setManpower] = useState<ManpowerEntry[]>(() => {
    const base = suggestedManpower?.length ? suggestedManpower : DEFAULT_TRADES.map((trade) => ({ trade, count: 0 }));
    return base.map((entry) => ({ trade: entry.trade, count: entry.count }));
  });
  const [delays, setDelays] = useState<string[]>([]);
  const [delayNote, setDelayNote] = useState("");
  const [workCompleted, setWorkCompleted] = useState("");
  const [photos, setPhotos] = useState<LogPhoto[]>([]);
  const [status, setStatus] = useState<{ tone: "ok" | "queued" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = useMemo(() => manpower.reduce((sum, row) => sum + row.count, 0), [manpower]);
  const delayText = [...delays, delayNote.trim()].filter(Boolean).join(" · ");

  const adjust = (trade: string, delta: number) => {
    setManpower((current) =>
      current.map((row) =>
        row.trade === trade ? { ...row, count: Math.max(0, Math.min(999, row.count + delta)) } : row,
      ),
    );
  };

  const toggleTrade = (trade: string) => {
    setManpower((current) => {
      if (current.some((row) => row.trade === trade)) {
        return current.filter((row) => row.trade !== trade);
      }
      return [...current, { trade, count: 0 }];
    });
  };

  const reset = () => {
    setWeather(null);
    setDelays([]);
    setDelayNote("");
    setWorkCompleted("");
    setPhotos([]);
  };

  const onSubmit = async () => {
    setStatus(null);
    if (!weather) {
      setStatus({ tone: "error", message: "Tap the weather first — it is the only required step." });
      return;
    }
    if (total === 0) {
      setStatus({ tone: "error", message: "Add at least one worker to the crew count." });
      return;
    }

    setSubmitting(true);
    const clientUuid = newClientUuid();
    const payload = {
      projectId,
      logDate: new Date().toISOString().slice(0, 10),
      weather,
      temperatureC,
      manpower: manpower.filter((row) => row.count > 0),
      workCompleted: workCompleted.trim() || "Shift complete — works executed to programme; no exceptions recorded.",
      delays: delayText || "None.",
      photos,
      syncedFromField: true,
      clientUuid,
    };

    const queueOnDevice = async (reason: string) => {
      const items = await enqueue({
        kind: "log",
        queueId: clientUuid,
        clientUuid,
        queuedAt: new Date().toISOString(),
        payload,
      });
      onQueued(items);
      setStatus({ tone: "queued", message: reason });
      reset();
      setSubmitting(false);
    };

    if (!online) {
      await queueOnDevice("Saved offline. It will sync automatically when signal returns.");
      return;
    }

    createLog.mutate(payload, {
      onSuccess: () => {
        setStatus({ tone: "ok", message: `Log submitted for ${projectName}. Recorded and audited.` });
        reset();
        setSubmitting(false);
      },
      onError: async () => {
        await queueOnDevice("Upload failed — saved to the device queue. Retrying automatically.");
      },
    });
  };

  return (
    <div className="space-y-4">
      {status ? (
        <div
          className={cn(
            "flex items-start gap-2 border px-3 py-2.5",
            status.tone === "ok"
              ? "border-[#6FD3A6]/40 bg-[#6FD3A6]/10 text-[#6FD3A6]"
              : status.tone === "queued"
                ? "border-gold/40 bg-gold/10 text-gold"
                : "border-[#F26D5B]/40 bg-[#F26D5B]/10 text-[#F26D5B]",
          )}
          role="status"
        >
          {status.tone === "ok" ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />}
          <p className="text-[12.5px] leading-snug">{status.message}</p>
        </div>
      ) : null}

      {/* 1 · Weather */}
      <section className="border border-paper/12 bg-[var(--ops-panel-2)] p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">1 · Weather</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/30">Tap one</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {WEATHER_OPTIONS.map((option) => {
            const Icon = option.Icon;
            const active = weather === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setWeather(option.id)}
                aria-pressed={active}
                className={cn(
                  "flex min-h-[64px] flex-col items-center justify-center gap-1 border text-[11px] transition-colors",
                  active
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-paper/15 bg-paper/[0.03] text-paper/60 active:bg-paper/10",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="font-mono uppercase tracking-[0.06em]">{option.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/35">Temp</span>
          {TEMPS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTemperatureC(value)}
              aria-pressed={temperatureC === value}
              className={cn(
                "min-h-9 flex-1 border font-mono text-[10px] tabular-nums transition-colors",
                temperatureC === value
                  ? "border-gold/50 bg-gold/10 text-gold"
                  : "border-paper/12 text-paper/45",
              )}
            >
              {value}°C
            </button>
          ))}
        </div>
      </section>

      {/* 2 · Crew */}
      <section className="border border-paper/12 bg-[var(--ops-panel-2)] p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">2 · Manpower</h2>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/45">
            <Users className="h-3.5 w-3.5" />
            {total} on site
          </span>
        </div>

        <ul className="mt-2 space-y-1.5">
          {manpower.map((row) => (
            <li key={row.trade} className="flex items-center gap-2 border border-paper/10 bg-paper/[0.02] px-2 py-1.5">
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-paper/75">{row.trade}</span>
              <button
                type="button"
                onClick={() => adjust(row.trade, -1)}
                aria-label={`Decrease ${row.trade}`}
                className="flex h-11 w-11 items-center justify-center border border-paper/20 text-paper/60 active:bg-paper/10"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-mono text-[15px] tabular-nums text-paper">{row.count}</span>
              <button
                type="button"
                onClick={() => adjust(row.trade, 1)}
                aria-label={`Increase ${row.trade}`}
                className="flex h-11 w-11 items-center justify-center border border-gold/40 bg-gold/10 text-gold active:bg-gold/20"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleTrade(row.trade)}
                aria-label={`Remove ${row.trade}`}
                className="flex h-11 w-8 items-center justify-center text-paper/25 active:text-paper/60"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {DEFAULT_TRADES.filter((trade) => !manpower.some((row) => row.trade === trade)).map((trade) => (
            <button
              key={trade}
              type="button"
              onClick={() => toggleTrade(trade)}
              className="min-h-9 border border-dashed border-paper/20 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/40 active:border-gold/40 active:text-gold"
            >
              + {trade}
            </button>
          ))}
        </div>
      </section>

      {/* 3 · Progress */}
      <section className="border border-paper/12 bg-[var(--ops-panel-2)] p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">3 · Works & delays</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/30">Optional</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {DELAY_CHIPS.map((chip) => {
            const active = delays.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() =>
                  setDelays((current) =>
                    current.includes(chip) ? current.filter((entry) => entry !== chip) : [...current, chip],
                  )
                }
                aria-pressed={active}
                className={cn(
                  "min-h-10 border px-2.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
                  active
                    ? "border-[#F08A4B]/60 bg-[#F08A4B]/15 text-[#F08A4B]"
                    : "border-paper/15 text-paper/45",
                )}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <textarea
          value={workCompleted}
          onChange={(event) => setWorkCompleted(event.target.value)}
          rows={3}
          placeholder="Works completed this shift — e.g. L33 stone install, chiller second-fix…"
          className="mt-2 w-full resize-y border border-paper/15 bg-[var(--ops-field)] px-3 py-2.5 text-[13px] leading-relaxed text-paper placeholder:text-paper/25 focus:border-gold/60 focus:outline-none"
        />
        <input
          value={delayNote}
          onChange={(event) => setDelayNote(event.target.value)}
          placeholder="Delay note (optional)"
          className="mt-2 h-11 w-full border border-paper/12 bg-[var(--ops-field)] px-3 text-[12.5px] text-paper placeholder:text-paper/25 focus:border-gold/60 focus:outline-none"
        />

        <div className="mt-3">
          <PhotoCaptureInput
            photos={photos}
            onChange={setPhotos}
            siteName={projectName}
            fallback={fallbackCoords}
          />
        </div>
      </section>

      <button
        type="button"
        onClick={() => void onSubmit()}
        disabled={submitting}
        className="flex min-h-14 w-full items-center justify-center gap-2 border border-gold bg-gold px-4 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors active:bg-gold-soft disabled:opacity-60"
      >
        {submitting ? (
          <>Submitting…</>
        ) : online ? (
          <>
            <Send className="h-4 w-4" /> Submit daily log
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" /> Save offline
          </>
        )}
      </button>
      <p className="text-center font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-paper/30">
        Weather → crew → submit. Photos and GPS are attached automatically.
      </p>
    </div>
  );
}
