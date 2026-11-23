import { NextResponse } from "next/server";

import { assertProjectAccess, jsonError, requirePermission } from "@/lib/ops/api";
import { createIncident, incidentFeed, recordAudit } from "@/lib/ops/store";
import { incidentUpdateSchema, newIncidentSchema } from "@/lib/ops/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("safety:view");
  if (guard.response) return guard.response;

  const projectId = new URL(request.url).searchParams.get("projectId") ?? undefined;
  if (projectId) {
    const denied = await assertProjectAccess(guard.session, projectId);
    if (denied) return denied;
  }
  return NextResponse.json({ incidents: incidentFeed(projectId) });
}

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("incident:create");
  if (guard.response) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = newIncidentSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Incident rejected", parsed.error.issues[0]?.message);
  }

  const denied = await assertProjectAccess(guard.session, parsed.data.projectId);
  if (denied) return denied;

  const payload = parsed.data;
  const entry = createIncident({
    projectId: payload.projectId,
    inspectorId: guard.session.id,
    type: payload.type,
    severity: payload.severity,
    title: payload.title,
    description: payload.description,
    correctiveAction: payload.correctiveAction,
    occurredAt: payload.occurredAt ?? new Date().toISOString(),
    photos: payload.photos,
  });

  return NextResponse.json({ incident: entry }, { status: 201 });
}

/** Sign-off is restricted to PM and executive roles (SQL: incidents_update policy). */
export async function PATCH(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("incident:signoff");
  if (guard.response) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = incidentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Invalid incident update", parsed.error.issues[0]?.message);
  }

  const entry = incidentFeed().find((incident) => incident.id === parsed.data.id);
  if (!entry) return jsonError(404, "Incident not found");

  const denied = await assertProjectAccess(guard.session, entry.projectId);
  if (denied) return denied;

  entry.status = parsed.data.status;
  if (parsed.data.correctiveAction) entry.correctiveAction = parsed.data.correctiveAction;
  if (parsed.data.status === "resolved") {
    entry.signedOffAt = new Date().toISOString();
    entry.signedOffBy = guard.session.id;
  }

  recordAudit({
    actorId: guard.session.id,
    action: parsed.data.status === "resolved" ? "Signed off incident" : "Updated incident",
    entity: "safety_incidents",
    entityId: entry.id,
    detail: `${entry.title} → ${parsed.data.status}`,
  });

  return NextResponse.json({ incident: entry });
}
