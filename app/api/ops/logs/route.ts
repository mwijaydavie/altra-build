import { NextResponse } from "next/server";

import { assertProjectAccess, jsonError, requirePermission } from "@/lib/ops/api";
import { createLog, logFeed } from "@/lib/ops/store";
import { newLogSchema } from "@/lib/ops/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("field:use");
  if (guard.response) return guard.response;

  const projectId = new URL(request.url).searchParams.get("projectId") ?? undefined;
  if (projectId) {
    const denied = await assertProjectAccess(guard.session, projectId);
    if (denied) return denied;
  }
  return NextResponse.json({ logs: logFeed(projectId) });
}

export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("log:create");
  if (guard.response) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = newLogSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Daily log rejected", parsed.error.issues[0]?.message);
  }

  const denied = await assertProjectAccess(guard.session, parsed.data.projectId);
  if (denied) return denied;

  const payload = parsed.data;
  const entry = createLog({
    projectId: payload.projectId,
    createdBy: guard.session.id,
    logDate: payload.logDate,
    weather: payload.weather,
    temperatureC: payload.temperatureC,
    manpower: payload.manpower,
    workCompleted: payload.workCompleted,
    delays: payload.delays,
    photos: payload.photos,
  });

  return NextResponse.json({ log: entry }, { status: 201 });
}
