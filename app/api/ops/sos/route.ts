import { NextResponse } from "next/server";

import { assertProjectAccess, jsonError, requirePermission } from "@/lib/ops/api";
import { broadcastSos } from "@/lib/ops/store";
import { sosSchema } from "@/lib/ops/validation";

export const dynamic = "force-dynamic";

/**
 * Safety-stop broadcast from the field PWA. Creates a critical, unacknowledged
 * site alert with coordinates, and writes an audit entry. Mirrored on device by
 * an SMS fallback to the site emergency number when offline.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("sos:broadcast");
  if (guard.response) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = sosSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "SOS rejected", parsed.error.issues[0]?.message);
  }

  const denied = await assertProjectAccess(guard.session, parsed.data.projectId);
  if (denied) return denied;

  const alert = broadcastSos({
    projectId: parsed.data.projectId,
    actorId: guard.session.id,
    reason: parsed.data.message,
    latitude: parsed.data.lat ?? null,
    longitude: parsed.data.lng ?? null,
  });

  return NextResponse.json(
    {
      alert,
      broadcast: {
        channels: ["dashboard", "sms", "email"],
        recipients: 6,
        acknowledgedSlaSeconds: 120,
      },
    },
    { status: 201 },
  );
}
