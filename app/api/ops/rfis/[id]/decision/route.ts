import { NextResponse } from "next/server";

import { rfis } from "@/data/opsData";
import { assertProjectAccess, jsonError, requirePermission } from "@/lib/ops/api";
import { approveChangeOrder, decideRfi } from "@/lib/ops/store";
import { rfiDecisionSchema } from "@/lib/ops/validation";

export const dynamic = "force-dynamic";

/**
 * One-click change-order approval. Change orders close with an approver and
 * timestamp; ordinary RFIs move to answered/closed.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const guard = await requirePermission("changeorder:approve");
  if (guard.response) return guard.response;

  const { id } = await context.params;
  const existing = rfis.find((rfi) => rfi.id === id);
  if (!existing) return jsonError(404, "RFI not found");

  const denied = await assertProjectAccess(guard.session, existing.projectId);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = rfiDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Invalid decision", parsed.error.issues[0]?.message);
  }

  if (existing.isChangeOrder && parsed.data.decision === "approved") {
    const approved = approveChangeOrder(id, guard.session.id);
    if (!approved) return jsonError(409, "Change order could not be approved");
    return NextResponse.json({ rfi: approved, mode: "change-order" });
  }

  const updated = decideRfi(id, parsed.data.decision, guard.session.id);
  if (!updated) return jsonError(409, "RFI could not be updated");
  if (parsed.data.note) updated.architectResponse = parsed.data.note;

  return NextResponse.json({ rfi: updated, mode: "rfi" });
}
