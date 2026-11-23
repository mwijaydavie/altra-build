"use client";

import { del, get, set } from "idb-keyval";

import type { LogPhoto, ManpowerEntry, WeatherCondition } from "@/types/construction";

/**
 * Offline-first queue for the field PWA. Records are written to IndexedDB
 * before any network attempt, then replayed by `/api/ops/sync` — which is
 * idempotent on `clientUuid`, so a dropped connection cannot double-post.
 */
export type QueuedLog = {
  kind: "log";
  queueId: string;
  clientUuid: string;
  queuedAt: string;
  payload: {
    projectId: string;
    logDate: string;
    weather: WeatherCondition;
    temperatureC: number;
    manpower: ManpowerEntry[];
    workCompleted: string;
    delays: string;
    photos: LogPhoto[];
    syncedFromField: boolean;
    clientUuid: string;
  };
};

export type QueuedIncident = {
  kind: "incident";
  queueId: string;
  queuedAt: string;
  payload: {
    projectId: string;
    type: "near-miss" | "minor" | "severe" | "routine-check";
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    description: string;
    correctiveAction: string;
    occurredAt: string;
    clientUuid: string;
  };
};

export type QueueItem = QueuedLog | QueuedIncident;

const KEY = "altra:field:queue:v1";

export const newClientUuid = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `field-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

export async function readQueue(): Promise<QueueItem[]> {
  try {
    const value = await get<QueueItem[]>(KEY);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export async function writeQueue(items: QueueItem[]): Promise<void> {
  try {
    await set(KEY, items);
  } catch {
    // IndexedDB unavailable (private mode / quota) — callers fall back to memory.
  }
}

export async function enqueue(item: QueueItem): Promise<QueueItem[]> {
  const current = await readQueue();
  const next = [item, ...current];
  await writeQueue(next);
  return next;
}

export async function removeQueueItems(ids: string[]): Promise<QueueItem[]> {
  const current = await readQueue();
  const next = current.filter((item) => !ids.includes(item.queueId));
  await writeQueue(next);
  return next;
}

export async function clearQueue(): Promise<void> {
  try {
    await del(KEY);
  } catch {
    // no-op
  }
}

export type SyncResult = {
  synced: number;
  duplicates: number;
  failed: number;
  at: string;
};

/** Replay the queue. Returns per-run counters for the sync badge. */
export async function flushQueue(): Promise<SyncResult> {
  const items = await readQueue();
  const logs = items.filter((item): item is QueuedLog => item.kind === "log");
  const incidents = items.filter((item): item is QueuedIncident => item.kind === "incident");

  if (logs.length === 0 && incidents.length === 0) {
    return { synced: 0, duplicates: 0, failed: 0, at: new Date().toISOString() };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  const response = await fetch("/api/ops/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      logs: logs.map((item) => item.payload),
      incidents: incidents.map((item) => item.payload),
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) throw new Error(`Sync failed (${response.status})`);

  const body = (await response.json()) as {
    results: {
      logs: number;
      incidents: number;
      duplicates: number;
      errors: string[];
      accepted?: string[];
    };
  };

  const acceptedIds = new Set(body.results.accepted ?? []);
  if (acceptedIds.size > 0) {
    const handled = items.filter((item) => acceptedIds.has(item.payload.clientUuid));
    await removeQueueItems(handled.map((item) => item.queueId));
  }

  return {
    synced: body.results.logs + body.results.incidents,
    duplicates: body.results.duplicates,
    failed: body.results.errors.length,
    at: new Date().toISOString(),
  };
}
