import { NextResponse } from "next/server";

import { jsonError, requirePermission } from "@/lib/ops/api";
import { createIncident, createLog } from "@/lib/ops/store";
import { syncBatchSchema } from "@/lib/ops/validation";

export const dynamic = "force-dynamic";

/**
 * Offline queue replay. The field PWA stores records in IndexedDB with a
 * `clientUuid`; this endpoint is idempotent on that key so a flaky connection
 * cannot double-post a daily log.
 */
const seen = new Set<string>();

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("field:use");
  if (guard.response) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = syncBatchSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Sync batch rejected", parsed.error.issues[0]?.message);
  }

  const results = {
    logs: 0,
    incidents: 0,
    duplicates: 0,
    errors: [] as string[],
    accepted: [] as string[],
  };

  for (const entry of parsed.data.logs) {
    const key = entry.clientUuid;
    if (key && seen.has(key)) {
      results.duplicates += 1;
      continue;
    }
    try {
      createLog({
        projectId: entry.projectId,
        createdBy: guard.session.id,
        logDate: entry.logDate,
        weather: entry.weather,
        temperatureC: entry.temperatureC,
        manpower: entry.manpower,
        workCompleted: entry.workCompleted,
        delays: entry.delays,
        photos: entry.photos,
      });
      if (key) {
        seen.add(key);
        results.accepted.push(key);
      }
      results.logs += 1;
    } catch {
      results.errors.push(`log ${entry.projectId} ${entry.logDate}`);
    }
  }

  for (const entry of parsed.data.incidents) {
    const key = entry.clientUuid;
    if (key && seen.has(key)) {
      results.duplicates += 1;
      results.accepted.push(key);
      continue;
    }
    try {
      createIncident({
        projectId: entry.projectId,
        inspectorId: guard.session.id,
        type: entry.type,
        severity: entry.severity,
        title: entry.title,
        description: entry.description,
        correctiveAction: entry.correctiveAction,
        occurredAt: entry.occurredAt ?? new Date().toISOString(),
        photos: entry.photos,
      });
      if (key) {
        seen.add(key);
        results.accepted.push(key);
      }
      results.incidents += 1;
    } catch {
      results.errors.push(`incident ${entry.projectId}`);
    }
  }

  return NextResponse.json({ syncedAt: new Date().toISOString(), results });
}
