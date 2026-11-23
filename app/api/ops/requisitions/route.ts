import { NextResponse } from "next/server";

import { requisitions } from "@/data/opsData";
import { assertProjectAccess, jsonError, requirePermission } from "@/lib/ops/api";
import { decideRequisition, recordAudit, requisitionFeed } from "@/lib/ops/store";
import { newRequisitionSchema, requisitionDecisionSchema } from "@/lib/ops/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("procurement:view");
  if (guard.response) return guard.response;

  const projectId = new URL(request.url).searchParams.get("projectId") ?? undefined;
  if (projectId) {
    const denied = await assertProjectAccess(guard.session, projectId);
    if (denied) return denied;
  }
  return NextResponse.json({ requisitions: requisitionFeed(projectId) });
}

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("requisition:create");
  if (guard.response) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = newRequisitionSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Requisition rejected", parsed.error.issues[0]?.message);
  }

  const denied = await assertProjectAccess(guard.session, parsed.data.projectId);
  if (denied) return denied;

  const payload = parsed.data;
  const entry = {
    id: `req-${Date.now().toString(36)}`,
    projectId: payload.projectId,
    requestedBy: guard.session.id,
    itemName: payload.itemName,
    category: payload.category,
    quantityRequested: payload.quantityRequested,
    unit: payload.unit,
    estimatedCost: payload.estimatedCost,
    approvalStatus: "pending" as const,
    deliveryTrackingCode: null,
    requiredBy: payload.requiredBy,
    supplier: payload.supplier,
    createdAt: new Date().toISOString(),
  };
  requisitions.unshift(entry);

  recordAudit({
    actorId: guard.session.id,
    action: "Raised requisition",
    entity: "requisitions",
    entityId: entry.id,
    detail: `${entry.itemName} — ${entry.quantityRequested} ${entry.unit}`,
  });

  return NextResponse.json({ requisition: entry }, { status: 201 });
}

export async function PATCH(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("requisition:approve");
  if (guard.response) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = requisitionDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Invalid requisition decision", parsed.error.issues[0]?.message);
  }

  const existing = requisitions.find((requisition) => requisition.id === parsed.data.id);
  if (!existing) return jsonError(404, "Requisition not found");

  const denied = await assertProjectAccess(guard.session, existing.projectId);
  if (denied) return denied;

  if (parsed.data.approvalStatus === "delivered") {
    existing.approvalStatus = "delivered";
    recordAudit({
      actorId: guard.session.id,
      action: "Confirmed delivery",
      entity: "requisitions",
      entityId: existing.id,
      detail: `${existing.itemName} — ${existing.quantityRequested} ${existing.unit}`,
    });
    return NextResponse.json({ requisition: existing });
  }

  const decision = parsed.data.approvalStatus === "approved" ? "approved" : "rejected";
  const entry = decideRequisition(parsed.data.id, decision, guard.session.id);
  if (!entry) return jsonError(409, "Requisition could not be updated");

  return NextResponse.json({ requisition: entry });
}
