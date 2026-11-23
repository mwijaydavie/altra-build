import { NextResponse } from "next/server";

import { alerts } from "@/data/opsData";
import { assertProjectAccess, jsonError, requirePermission } from "@/lib/ops/api";
import { acknowledgeAlert } from "@/lib/ops/store";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("safety:view");
  if (guard.response) return guard.response;

  const body = await request.json().catch(() => null);
  const id: unknown = body && typeof body === "object" ? (body as { id?: unknown }).id : undefined;
  if (typeof id !== "string" || !id) return jsonError(400, "Alert id required");

  const existing = alerts.find((alert) => alert.id === id);
  if (!existing) return jsonError(404, "Alert not found");

  const denied = await assertProjectAccess(guard.session, existing.projectId);
  if (denied) return denied;

  const entry = acknowledgeAlert(id, guard.session.id);
  return NextResponse.json({ alert: entry });
}
