import { NextResponse } from "next/server";

import { rfis } from "@/data/opsData";
import { assertProjectAccess, jsonError, requirePermission } from "@/lib/ops/api";
import { createRfi, rfiFeed } from "@/lib/ops/store";
import { newRfiSchema } from "@/lib/ops/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("documents:view");
  if (guard.response) return guard.response;

  const projectId = new URL(request.url).searchParams.get("projectId") ?? undefined;
  if (projectId) {
    const denied = await assertProjectAccess(guard.session, projectId);
    if (denied) return denied;
  }
  return NextResponse.json({ rfis: rfiFeed(projectId) });
}

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("log:create");
  if (guard.response) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = newRfiSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "RFI rejected", parsed.error.issues[0]?.message);
  }

  const denied = await assertProjectAccess(guard.session, parsed.data.projectId);
  if (denied) return denied;

  const payload = parsed.data;
  const nextNumber = 700 + rfis.filter((rfi) => rfi.projectId === payload.projectId).length + 1;

  const entry = createRfi({
    projectId: payload.projectId,
    rfiNumber: `RFI-${nextNumber}`,
    title: payload.title,
    description: payload.description,
    raisedBy: guard.session.id,
    costImpact: payload.costImpact,
    scheduleImpactDays: payload.scheduleImpactDays,
    architectResponse: null,
    isChangeOrder: payload.isChangeOrder,
  });

  return NextResponse.json({ rfi: entry }, { status: 201 });
}
