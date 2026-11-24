"use client";

import { CalendarDays, GripVertical } from "lucide-react";
import { useState } from "react";

import { Chip } from "@/components/dashboard/ui";
import { formatDateShort, severityTone } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { Profile, Task, TaskStatus } from "@/types/construction";

const COLUMNS: { status: TaskStatus; label: string; hint: string }[] = [
  { status: "backlog", label: "Backlog", hint: "Queued" },
  { status: "in-progress", label: "In progress", hint: "On site" },
  { status: "review", label: "Review", hint: "QA / sign-off" },
  { status: "done", label: "Complete", hint: "Closed" },
];

export function KanbanBoard({
  tasks,
  users,
  canMove,
  onMove,
  pendingId,
}: {
  tasks: Task[];
  users: Pick<Profile, "id" | "fullName">[];
  canMove: boolean;
  onMove: (taskId: string, status: TaskStatus) => void;
  pendingId?: string | null;
}) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<TaskStatus | null>(null);

  return (
    <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-4">
      {COLUMNS.map((column) => {
        const rows = tasks.filter((task) => task.status === column.status);
        return (
          <div
            key={column.status}
            onDragOver={(event) => {
              if (!canMove) return;
              event.preventDefault();
              setOver(column.status);
            }}
            onDragLeave={() => setOver(null)}
            onDrop={(event) => {
              event.preventDefault();
              setOver(null);
              const id = event.dataTransfer.getData("text/plain") || dragging;
              if (id && canMove) onMove(id, column.status);
              setDragging(null);
            }}
            className={cn(
              "flex min-h-[180px] flex-col border bg-[var(--ops-bg)]",
              over === column.status ? "border-gold/60 bg-gold/[0.04]" : "border-paper/10",
            )}
          >
            <header className="flex items-center justify-between border-b border-paper/10 px-3 py-2">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/60">{column.label}</p>
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/55">{column.hint}</p>
              </div>
              <span className="font-mono text-[10px] tabular-nums text-paper/55">{rows.length}</span>
            </header>

            <ul className="flex-1 space-y-2 p-2">
              {rows.map((task) => {
                const assignee = users.find((user) => user.id === task.assigneeId);
                return (
                  <li
                    key={task.id}
                    draggable={canMove}
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", task.id);
                      setDragging(task.id);
                    }}
                    onDragEnd={() => setDragging(null)}
                    className={cn(
                      "group border border-paper/10 bg-[var(--ops-panel-2)] p-2.5 transition-colors",
                      canMove && "cursor-grab active:cursor-grabbing hover:border-gold/30",
                      dragging === task.id && "opacity-40",
                      pendingId === task.id && "animate-pulse border-gold/50",
                    )}
                  >
                    <div className="flex items-start gap-1.5">
                      {canMove ? (
                        <GripVertical className="mt-0.5 h-3 w-3 shrink-0 text-paper/20 group-hover:text-paper/20" />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="text-[11.5px] font-medium leading-snug text-paper/85">{task.title}</p>
                        <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-paper/55">
                          {task.trade ?? "General"} · {task.phase}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em]",
                          severityTone[task.priority] ?? severityTone.medium,
                        )}
                      >
                        {task.priority}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[8.5px] text-paper/55">
                        <CalendarDays className="h-2.5 w-2.5" /> {formatDateShort(task.dueDate)}
                      </span>
                      {assignee ? (
                        <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.1em] text-paper/55">
                          {assignee.fullName.split(" ")[0]}
                        </span>
                      ) : null}
                    </div>
                    {canMove ? (
                      <div className="mt-2 flex gap-1 border-t border-paper/[0.08] pt-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        {COLUMNS.filter((option) => option.status !== task.status).map((option) => (
                          <button
                            key={option.status}
                            type="button"
                            onClick={() => onMove(task.id, option.status)}
                            className="min-h-6 flex-1 border border-paper/10 px-1 font-mono text-[8px] uppercase tracking-[0.08em] text-paper/55 hover:border-gold/40 hover:text-gold"
                          >
                            {option.label.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </li>
                );
              })}
              {rows.length === 0 ? (
                <li className="border border-dashed border-paper/10 px-2 py-4 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-paper/20">
                  Drop a task here
                </li>
              ) : null}
            </ul>
          </div>
        );
      })}
      <p className="col-span-full font-mono text-[9px] uppercase tracking-[0.14em] text-paper/55">
        {canMove ? "Drag a card, or use the quick-move buttons, to update programme status." : "Read-only view for your role."}
      </p>
    </div>
  );
}
