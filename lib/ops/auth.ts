import { cookies } from "next/headers";

import { profileById, profiles } from "@/data/opsData";
import type { Profile, Role } from "@/types/construction";

/**
 * Demo session model. Production replaces this with Supabase Auth + the
 * `profiles` table; the cookie only stores a profile id and is re-validated
 * against the repository on every request.
 */
export const SESSION_COOKIE = "altra_ops_user";

export const DEMO_SESSIONS: { role: Role; userId: string; label: string; note: string }[] = [
  { role: "executive", userId: "u-exec", label: "Neema Mwakalinga", note: "CEO · all nine sites" },
  { role: "pm", userId: "u-pm1", label: "Baraka Mwakyusa", note: "PM · Msasani, Dodoma, Kariakoo, Ubungo" },
  { role: "engineer", userId: "u-eng1", label: "Halima Juma", note: "Site engineer · Msasani, Dodoma" },
  { role: "client", userId: "u-client", label: "Zahara Kimaro", note: "Client · Msasani Peninsula Tower" },
];

export const roleForUser = (userId: string): Role => profileById(userId)?.role ?? "engineer";

export async function getSession(): Promise<Profile> {
  const store = await cookies();
  const userId = store.get(SESSION_COOKIE)?.value;
  return profileById(userId ?? "") ?? profiles[0]!;
}

export async function getSessionRole(): Promise<Role> {
  return (await getSession()).role;
}

export const userForRole = (role: Role): Profile => {
  const demo = DEMO_SESSIONS.find((session) => session.role === role);
  return profileById(demo?.userId ?? "") ?? profiles[0]!;
};
