"use client";

import { Check, GitPullRequestArrow, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Chip } from "@/components/dashboard/ui";
import { useRfiDecision } from "@/lib/ops/hooks";
import { tzs } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { Rfi } from "@/types/construction";

export function ApprovalsPanel({
  rfis,
  projectNames,
  canApprove,
}: {
  rfis: Rfi[];
  projectNames: Record<string, string>;
  canApprove: boolean;
}) {
  const decision = useRfiDecision();
  const [resolved, setResolved] = useState<Record<string, "approved" | "rejected">>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const queue = rfis
    .filter((rfi) => (rfi.status === "pending-approval" || (rfi.isChangeOrder && rfi.status === "open")) && !resolved[rfi.id])
    .slice(0, 5);

  const onDecide = (rfi: Rfi, choice: "approved" | "rejected") => {
    setError(null);
    setBusy(rfi.id);
    decision.mutate(
      { id: rfi.id, decision: choice },
      {
        onSuccess: () => {
          setResolved((current) => ({ ...current, [rfi.id]: choice }));
        },
        onError: (mutationError: Error) => setError(mutationError.message),
        onSettled: () => setBusy(null),
      },
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-paper/10 px-4 py-3.5 sm:px-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">Commercial controls</p>
          <h2 className="mt-1 text-[15px] font-semibold tracking-tight text-paper">Approvals & change orders</h2>
        </div>
        <Chip tone={queue.length ? "gold" : "green"}>{queue.length} waiting</Chip>
      </div>

      {queue.length === 0 ? (
        <p className="px-4 py-8 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-paper/35 sm:px-5">
          Queue clear · no decisions outstanding
        </p>
      ) : (
        <ul className="flex-1 divide-y divide-paper/10">
          {queue.map((rfi) => (
            <li key={rfi.id} className="px-4 py-3 sm:px-5">
              <div className="flex items-start gap-2.5">
                <GitPullRequestArrow className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/40">{rfi.rfiNumber}</span>
                    {rfi.isChangeOrder ? <Chip tone="orange" className="px-1.5 py-0">Change order</Chip> : null}
                  </div>
                  <p className="mt-1 text-[12.5px] font-medium leading-snug text-paper/90">{rfi.title}</p>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/35">
                    {projectNames[rfi.projectId] ?? "Portfolio"} ·{" "}
                    {rfi.costImpact > 0 ? tzs(rfi.costImpact) : "No cost"} ·{" "}
                    {rfi.scheduleImpactDays > 0 ? `+${rfi.scheduleImpactDays}d` : rfi.scheduleImpactDays < 0 ? `${rfi.scheduleImpactDays}d` : "0d"}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {canApprove ? (
                      <>
                        <button
                          type="button"
                          disabled={busy === rfi.id}
                          onClick={() => onDecide(rfi, "approved")}
                          className="inline-flex min-h-8 items-center gap-1 border border-gold/50 bg-gold/10 px-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold hover:text-ink disabled:opacity-50"
                        >
                          <Check className="h-3 w-3" /> Approve
                        </button>
                        <button
                          type="button"
                          disabled={busy === rfi.id}
                          onClick={() => onDecide(rfi, "rejected")}
                          className="inline-flex min-h-8 items-center gap-1 border border-paper/20 px-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/55 transition-colors hover:border-[#F26D5B]/50 hover:text-[#F26D5B] disabled:opacity-50"
                        >
                          <X className="h-3 w-3" /> Decline
                        </button>
                      </>
                    ) : (
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30">
                        Awaiting PM decision
                      </span>
                    )}
                    <Link
                      href={`/dashboard/projects/${rfi.projectId}`}
                      className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40 hover:text-paper"
                    >
                      Open site →
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={cn("border-t border-paper/10 px-4 py-2.5 sm:px-5", error ? "text-[#F26D5B]" : "text-paper/35")}>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em]">
          {error ?? (decision.isPending ? "Writing decision to audit log…" : "Every decision is signed and logged")}
        </p>
      </div>
    </div>
  );
}
