import { NextResponse } from "next/server";

import { tasks } from "@/data/opsData";
import { assertProjectAccess, jsonError, requirePermission } from "@/lib/ops/api";
import { moveTask, taskFeed } from "@/lib/ops/store";
import { taskMoveSchema } from "@/lib/ops/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("documents:view");
  if (guard.response) return guard.response;

  const projectId = new URL(request.url).searchParams.get("projectId") ?? undefined;
  if (projectId) {
    const denied = await assertProjectAccess(guard.session, projectId);
    if (denied) return denied;
  }
  return NextResponse.json({ tasks: taskFeed(projectId) });
}

/** Kanban drag/reschedule endpoint — the Gantt and board share it. */
export async function PATCH(request: Request): Promise<NextResponse> {
  const guard = await requirePermission("task:move");
  if (guard.response) return guard.response;

  const body = await request.json().catch(() => null);
  const parsed = taskMoveSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Invalid task move", parsed.error.issues[0]?.message);
  }

  const existing = tasks.find((task) => task.id === parsed.data.id);
  if (!existing) return jsonError(404, "Task not found");

  const denied = await assertProjectAccess(guard.session, existing.projectId);
  if (denied) return denied;

  const entry = moveTask(parsed.data.id, parsed.data.status, guard.session.id);
  return NextResponse.json({ task: entry });
}
