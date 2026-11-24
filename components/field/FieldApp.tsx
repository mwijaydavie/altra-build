"use client";

import {
  AlertOctagon,
  ChevronDown,
  ClipboardList,
  CloudOff,
  HardHat,
  MapPin,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FieldSyncList } from "@/components/field/FieldSyncList";
import { OfflineSyncBadge } from "@/components/field/OfflineSyncBadge";
import { QuickIncidentForm } from "@/components/field/QuickIncidentForm";
import { QuickLogEntryForm } from "@/components/field/QuickLogEntryForm";
import { SosPanel } from "@/components/field/SosPanel";
import { Chip } from "@/components/dashboard/ui";
import { flushQueue, readQueue, type QueueItem } from "@/lib/field/queue";
import { useClock, useOnline, useOpsSnapshot } from "@/lib/ops/hooks";
import { formatDate, relative } from "@/lib/ops/format";
import { cn } from "@/lib/utils";

type Tab = "log" | "safety" | "sos";

const TABS: { id: Tab; label: string; icon: typeof ClipboardList }[] = [
  { id: "log", label: "Daily log", icon: ClipboardList },
  { id: "safety", label: "Safety", icon: ShieldCheck },
  { id: "sos", label: "SOS", icon: AlertOctagon },
];

export function FieldApp() {
  const { data, isLoading } = useOpsSnapshot();
  const online = useOnline();
  const clock = useClock();
  const [tab, setTab] = useState<Tab>("log");
  const [projectId, setProjectId] = useState<string>("");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!projectId) {
      const stored = window.localStorage.getItem("altra:field:project");
      const first = data?.projects[0]?.id;
      setProjectId(stored ?? first ?? "");
    }
  }, [data, projectId]);

  useEffect(() => {
    if (projectId) window.localStorage.setItem("altra:field:project", projectId);
  }, [projectId]);

  useEffect(() => {
    void readQueue().then(setQueue);
  }, []);

  const sync = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    if (inFlight.current) return;
    const pending = await readQueue();
    if (pending.length === 0) {
      setQueue(pending);
      return;
    }
    inFlight.current = true;
    setSyncing(true);
    setSyncError(null);
    try {
      const result = await flushQueue();
      if (result.synced + result.duplicates > 0) {
        setLastSynced(
          new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Africa/Dar_es_Salaam",
          }),
        );
      }
      setQueue(await readQueue());
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : "Sync failed");
    } finally {
      inFlight.current = false;
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (!online) return;
    const timer = window.setTimeout(() => void sync(), 1200);
    return () => window.clearTimeout(timer);
  }, [online, queue.length, sync]);

  useEffect(() => {
    const interval = window.setInterval(() => void sync(), 30_000);
    const onOnline = () => void sync();
    window.addEventListener("online", onOnline);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("online", onOnline);
    };
  }, [sync]);

  const project = data?.projects.find((entry) => entry.id === projectId) ?? data?.projects[0];
  const projectLogs = useMemo(
    () => (data?.logs ?? []).filter((log) => log.projectId === project?.id),
    [data, project?.id],
  );
  const projectIncidents = useMemo(
    () => (data?.incidents ?? []).filter((incident) => incident.projectId === project?.id),
    [data, project?.id],
  );
  const users = data?.users ?? [];

  if (isLoading || !project) {
    return (
      <div className="ops-root flex min-h-dvh flex-col items-center justify-center gap-3 bg-[var(--ops-bg)] px-6 text-center">
        <span className="h-8 w-8 animate-spin border-2 border-gold border-t-transparent" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/55">Loading field kit…</p>
      </div>
    );
  }

  const latest = projectLogs[0];
  const canUseField = data?.viewer.role !== "client";

  return (
    <div className="ops-root mx-auto min-h-dvh w-full max-w-[480px] border-x border-paper/10 bg-[var(--ops-bg)] pb-[92px] text-paper shadow-[0_0_90px_-30px_rgba(247,188,50,0.22)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-paper/10 bg-[var(--ops-chrome)] backdrop-blur">
        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center border border-gold/40 bg-gold/10">
              <HardHat className="h-4 w-4 text-gold" />
            </span>
            <span>
              <span className="block font-display text-[13px] font-semibold leading-none tracking-tight">
                ALTRA <span className="text-gold">FIELD</span>
              </span>
              <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.22em] text-paper/55">
                Site reporting
              </span>
            </span>
          </Link>
          <OfflineSyncBadge
            online={online}
            queued={queue.length}
            syncing={syncing}
            lastSynced={lastSynced}
            onSync={() => void sync()}
          />
        </div>

        <div className="flex items-center gap-2 border-t border-paper/[0.08] px-3 py-2">
          <label className="relative min-w-0 flex-1" aria-label="Select site">
            <select
              value={project.id}
              onChange={(event) => setProjectId(event.target.value)}
              className="h-11 w-full appearance-none border border-paper/15 bg-[var(--ops-panel-2)] pl-3 pr-8 text-[13px] font-medium text-paper focus:border-gold/60 focus:outline-none"
            >
              {(data?.projects ?? []).map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-paper/55" />
          </label>
          <span className="flex h-11 items-center gap-1.5 border border-paper/15 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/55">
            <MapPin className="h-3 w-3" /> {project.lat.toFixed(2)}, {project.lng.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-paper/[0.08] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/55">
          <span className="text-gold">{project.projectCode}</span>
          <span>{project.status}</span>
          <span>{project.workforce} crew today</span>
          <span className="ml-auto">{clock ? clock.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Dar_es_Salaam" }) : "--:--"} EAT</span>
        </div>
      </header>

      {!online ? (
        <div className="flex items-center gap-2 border-b border-gold/30 bg-gold/10 px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-gold">
          <CloudOff className="h-3.5 w-3.5" /> Offline mode · records are saved on this device and sync automatically
        </div>
      ) : null}
      {syncError ? (
        <div className="border-b border-[#F26D5B]/30 bg-[#F26D5B]/10 px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#F26D5B]">
          {syncError} — will retry
        </div>
      ) : null}

      {!canUseField ? (
        <div className="m-3 border border-gold/30 bg-gold/[0.06] px-3 py-2.5 text-[12.5px] leading-relaxed text-paper/60">
          Client accounts have read-only access. Ask your project manager to submit field records.
        </div>
      ) : null}

      <main className="px-3 py-3">
        {tab === "log" ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">Shift log</p>
                <h1 className="mt-1 font-display text-[22px] font-semibold leading-none tracking-[-0.03em]">
                  Today on site.
                </h1>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/55">
                  {formatDate(new Date().toISOString().slice(0, 10))} · {project.weatherLocation}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Chip tone={online ? "green" : "gold"} className="px-1.5 py-0">
                  {online ? <Wifi className="h-2.5 w-2.5" /> : <CloudOff className="h-2.5 w-2.5" />}
                  {online ? "Online" : "Offline"}
                </Chip>
                {latest ? (
                  <span className="whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.1em] text-paper/55">
                    last log {relative(latest.createdAt)}
                  </span>
                ) : null}
              </div>
            </div>

            <QuickLogEntryForm
              key={`${project.id}-form`}
              projectId={project.id}
              projectName={project.name}
              fallbackCoords={{ lat: project.lat, lng: project.lng }}
              suggestedManpower={latest?.manpower}
              online={online}
              onQueued={setQueue}
            />

            <FieldSyncList items={queue} />

            {projectLogs.length ? (
              <section className="border border-paper/12 bg-[var(--ops-panel-2)] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/55">Recent logs</p>
                  <Link href={`/dashboard/projects/${project.id}`} className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold/80">
                    Open site →
                  </Link>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {projectLogs.slice(0, 4).map((log) => (
                    <li key={log.id} className="flex items-center justify-between gap-2 border-b border-paper/[0.08] pb-1.5 last:border-0">
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-paper/50">
                        {formatDate(log.logDate)}
                      </span>
                      <span className="text-[11.5px] text-paper/60">
                        {log.manpowerTotal} crew · {log.weather.replace("-", " ")}
                      </span>
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-paper/55">
                        {users.find((user) => user.id === log.createdBy)?.fullName.split(" ")[0] ?? "Field"}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        ) : null}

        {tab === "safety" ? (
          <div className="space-y-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">HSE</p>
              <h1 className="mt-1 font-display text-[22px] font-semibold leading-none tracking-[-0.03em]">
                Raise an observation.
              </h1>
              <p className="mt-1 text-[11.5px] leading-relaxed text-paper/55">
                Record near misses and inspections at the work face. Severe items page the safety director instantly.
              </p>
            </div>

            <QuickIncidentForm projectId={project.id} projectName={project.name} online={online} onQueued={setQueue} />

            <section className="border border-paper/12 bg-[var(--ops-panel-2)] p-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/55">Recent at this site</p>
                <Link href="/dashboard/safety" className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold/80">
                  Register →
                </Link>
              </div>
              <ul className="mt-2 space-y-2">
                {projectIncidents.slice(0, 4).map((incident) => (
                  <li key={incident.id} className="border-b border-paper/[0.08] pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          incident.status === "resolved" ? "bg-[#6FD3A6]" : incident.severity === "high" || incident.severity === "critical" ? "bg-[#F26D5B]" : "bg-gold",
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate text-[12px] text-paper/70">{incident.title}</span>
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-paper/55">{relative(incident.occurredAt)}</span>
                    </div>
                  </li>
                ))}
                {projectIncidents.length === 0 ? (
                  <li className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/55">No incidents recorded at this site</li>
                ) : null}
              </ul>
            </section>
          </div>
        ) : null}

        {tab === "sos" ? (
          <div className="space-y-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#F26D5B]">Emergency</p>
              <h1 className="mt-1 font-display text-[22px] font-semibold leading-none tracking-[-0.03em]">
                Stop work now.
              </h1>
            </div>
            <SosPanel
              projectId={project.id}
              projectName={project.name}
              online={online}
              fallbackCoords={{ lat: project.lat, lng: project.lng }}
            />
          </div>
        ) : null}
      </main>

      {/* Bottom nav */}
      <nav
        aria-label="Field sections"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] border-t border-paper/12 bg-[var(--ops-dialog)] pb-[env(safe-area-inset-bottom)] backdrop-blur"
      >
        <ul className="grid grid-cols-3">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-[68px] w-full flex-col items-center justify-center gap-1 border-r border-paper/[0.06] font-mono text-[10px] uppercase tracking-[0.12em] last:border-r-0",
                    active
                      ? item.id === "sos"
                        ? "bg-[#F26D5B]/15 text-[#F26D5B]"
                        : "bg-gold/10 text-gold"
                      : "text-paper/55",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                  {item.label}
                  {active ? <span className="absolute inset-x-4 top-0 h-0.5 bg-current" /> : null}
                  {item.id === "log" && queue.length ? (
                    <span className="absolute right-3 top-2 flex h-4 min-w-4 items-center justify-center bg-gold px-1 font-mono text-[10px] font-bold text-ink">
                      {queue.length}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
