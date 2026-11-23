"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import type {
  DailySiteLog,
  LogPhoto,
  ManpowerEntry,
  OpsSnapshot,
  Role,
  SafetyIncident,
  TaskStatus,
  WeatherCondition,
} from "@/types/construction";

const jsonInit = (body: unknown, method = "POST"): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!response.ok) {
    throw new Error(payload?.error ?? `Request failed (${response.status})`);
  }
  return payload as T;
}

/** Single cache key for every scoped read model. */
export const opsKeys = {
  snapshot: ["ops", "snapshot"] as const,
};

export function useOpsSnapshot() {
  return useQuery({
    queryKey: opsKeys.snapshot,
    queryFn: () => request<OpsSnapshot>("/api/ops/snapshot"),
    staleTime: 20_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

function useOpsMutation<TVars, TData = unknown>(fn: (vars: TVars) => Promise<TData>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ops"] });
    },
  });
}

export const useCreateLog = () =>
  useOpsMutation<
    {
      projectId: string;
      logDate: string;
      weather: WeatherCondition;
      temperatureC: number;
      manpower: ManpowerEntry[];
      workCompleted: string;
      delays: string;
      photos: LogPhoto[];
      syncedFromField: boolean;
      clientUuid?: string;
    },
    { log: DailySiteLog }
  >((body) => request("/api/ops/logs", jsonInit(body)));

export const useCreateIncident = () =>
  useOpsMutation<
    {
      projectId: string;
      type: SafetyIncident["type"];
      severity: SafetyIncident["severity"];
      title: string;
      description: string;
      correctiveAction: string;
      occurredAt?: string;
    },
    { incident: SafetyIncident }
  >((body) => request("/api/ops/incidents", jsonInit(body)));

export const useSignOffIncident = () =>
  useOpsMutation<
    { id: string; status: SafetyIncident["status"]; correctiveAction?: string },
    { incident: SafetyIncident }
  >((body) => request("/api/ops/incidents", jsonInit(body, "PATCH")));

export const useRfiDecision = () =>
  useOpsMutation<{ id: string; decision: "approved" | "rejected"; note?: string }, { rfi: unknown }>(
    ({ id, ...body }) =>
      request(`/api/ops/rfis/${encodeURIComponent(id)}/decision`, jsonInit(body)),
  );

export const useCreateRfi = () =>
  useOpsMutation<Record<string, unknown>, { rfi: unknown }>((body) =>
    request("/api/ops/rfis", jsonInit(body)),
  );

export const useRequisitionDecision = () =>
  useOpsMutation<{ id: string; approvalStatus: "approved" | "rejected" | "delivered" }, unknown>(
    (body) => request("/api/ops/requisitions", jsonInit(body, "PATCH")),
  );

export const useCreateRequisition = () =>
  useOpsMutation<Record<string, unknown>, unknown>((body) =>
    request("/api/ops/requisitions", jsonInit(body)),
  );

export const useMoveTask = () =>
  useOpsMutation<{ id: string; status: TaskStatus }, unknown>((body) =>
    request("/api/ops/tasks", jsonInit(body, "PATCH")),
  );

export const useAcknowledgeAlert = () =>
  useOpsMutation<{ id: string }, unknown>((body) =>
    request("/api/ops/alerts", jsonInit(body, "PATCH")),
  );

export const useSos = () =>
  useOpsMutation<
    { projectId: string; message: string; lat: number | null; lng: number | null },
    { alert: { id: string }; broadcast: { recipients: number; channels: string[] } }
  >((body) => request("/api/ops/sos", jsonInit(body)));

export const useSyncQueue = () =>
  useOpsMutation<{ logs: unknown[]; incidents: unknown[] }, { results: Record<string, number> }>(
    (body) => request("/api/ops/sync", jsonInit(body)),
  );

export async function switchRole(role: Role): Promise<void> {
  await request("/api/ops/session", jsonInit({ role }));
}

export function useOnline(): boolean {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

/** Mount-safe clock: avoids hydration mismatch by returning null on first paint. */
export function useClock(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}
