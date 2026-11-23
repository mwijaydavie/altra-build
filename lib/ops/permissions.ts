import type { Role } from "@/types/construction";

/**
 * Role capability matrix. Mirrors the RLS policies in `supabase/schema.sql`:
 * every check below has a database-side equivalent, so the UI and the SQL
 * agree on who may do what.
 */
export type Permission =
  | "portfolio:view-all"
  | "projects:view-assigned"
  | "finance:view"
  | "finance:view-summary"
  | "changeorder:approve"
  | "requisition:approve"
  | "requisition:create"
  | "task:move"
  | "log:create"
  | "incident:create"
  | "incident:signoff"
  | "sos:broadcast"
  | "audit:view"
  | "procurement:view"
  | "safety:view"
  | "documents:view"
  | "field:use";

const MATRIX: Record<Role, Permission[]> = {
  executive: [
    "portfolio:view-all",
    "finance:view",
    "finance:view-summary",
    "changeorder:approve",
    "requisition:approve",
    "requisition:create",
    "task:move",
    "log:create",
    "incident:create",
    "incident:signoff",
    "sos:broadcast",
    "audit:view",
    "procurement:view",
    "safety:view",
    "documents:view",
    "field:use",
  ],
  pm: [
    "finance:view",
    "finance:view-summary",
    "projects:view-assigned",
    "changeorder:approve",
    "requisition:approve",
    "requisition:create",
    "task:move",
    "log:create",
    "incident:create",
    "incident:signoff",
    "sos:broadcast",
    "audit:view",
    "procurement:view",
    "safety:view",
    "documents:view",
    "field:use",
  ],
  engineer: [
    "projects:view-assigned",
    "finance:view-summary",
    "requisition:create",
    "task:move",
    "log:create",
    "incident:create",
    "sos:broadcast",
    "procurement:view",
    "safety:view",
    "documents:view",
    "field:use",
  ],
  client: ["projects:view-assigned", "finance:view-summary", "documents:view"],
};

export const can = (role: Role, permission: Permission): boolean => MATRIX[role].includes(permission);

export const PERMISSION_LABELS: Record<Role, string> = {
  executive: "Executive — full portfolio",
  pm: "Project manager — assigned projects",
  engineer: "Field engineer — assigned sites",
  client: "Client — read-only project view",
};

/** Role that may approve at which financial threshold (TZS). */
export const APPROVAL_THRESHOLD: Record<Role, number> = {
  executive: Number.POSITIVE_INFINITY,
  pm: 50_000_000,
  engineer: 0,
  client: 0,
};
