import { NextResponse } from "next/server";

import { profileById } from "@/data/opsData";
import { DEMO_SESSIONS, SESSION_COOKIE, getSession, userForRole } from "@/lib/ops/auth";
import { jsonError } from "@/lib/ops/api";
import { sessionSchema } from "@/lib/ops/validation";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const session = await getSession();
  return NextResponse.json({ user: session, sessions: DEMO_SESSIONS });
}

/**
 * Demo-only role switch. Production replaces this with Supabase Auth:
 * the cookie is an opaque profile id and is re-validated on every read.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = sessionSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Invalid session payload", parsed.error.issues[0]?.message);
  }

  const requested = parsed.data.userId ? profileById(parsed.data.userId) : undefined;
  const fallback = parsed.data.role ? userForRole(parsed.data.role) : undefined;
  const user = requested ?? fallback;
  if (!user) return jsonError(404, "Unknown profile");

  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
