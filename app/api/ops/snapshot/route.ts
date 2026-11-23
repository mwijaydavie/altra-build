import { NextResponse } from "next/server";

import { getSession } from "@/lib/ops/auth";
import { snapshotFor } from "@/lib/ops/store";

export const dynamic = "force-dynamic";

/** One round-trip for every dashboard surface; scoped by the session role. */
export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  return NextResponse.json(snapshotFor(session.role, session.id), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
