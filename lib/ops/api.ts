import { NextResponse } from "next/server";

import { profileById } from "@/data/opsData";
import type { Profile } from "@/types/construction";

import { getSession } from "./auth";
import { can, type Permission } from "./permissions";

export const jsonError = (status: number, error: string, detail?: string): NextResponse =>
  NextResponse.json({ error, ...(detail ? { detail } : {}) }, { status });

export type SessionGuard = { session: Profile; response: null } | { session: null; response: NextResponse };

export async function requirePermission(permission: Permission): Promise<SessionGuard> {
  const session = await getSession();
  if (!can(session.role, permission)) {
    return {
      session: null,
      response: jsonError(403, "Forbidden", `The ${session.role} role cannot perform ${permission}.`),
    };
  }
  return { session, response: null };
}

/** Project-scope check mirroring `public.can_see_project()` in SQL. */
export async function assertProjectAccess(session: Profile, projectId: string): Promise<NextResponse | null> {
  if (session.role === "executive") return null;
  const me = profileById(session.id);
  if (!me?.projectIds.includes(projectId)) {
    return jsonError(403, "Outside your project scope", "This site is not assigned to your account.");
  }
  return null;
}

export const noStore = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json",
};
