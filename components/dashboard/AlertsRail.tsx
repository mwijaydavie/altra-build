"use client";

import { AlertTriangle, Check, PackageX, ShieldAlert, TimerReset } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Chip } from "@/components/dashboard/ui";
import { useAcknowledgeAlert } from "@/lib/ops/hooks";
import { relative, severityTone } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { SiteAlert } from "@/types/construction";

const KIND_ICON = {
  safety: ShieldAlert,
  procurement: PackageX,
  schedule: TimerReset,
  sos: AlertTriangle,
} as const;

export function AlertsRail({
  alerts,
  projectNames,
  canAcknowledge,
  showSafetyLink = true,
}: {
  alerts: SiteAlert[];
  projectNames: Record<string, string>;
  canAcknowledge: boolean;
  showSafetyLink?: boolean;
}) {
  const acknowledge = useAcknowledgeAlert();
  const [acked, setAcked] = useState<Record<string, boolean>>({});
  const open = alerts.filter((alert) => !alert.acknowledged && !acked[alert.id]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-4 sm:px-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">Exception queue</p>
          <h2 className="mt-1 text-[15px] font-semibold tracking-tight text-paper">Live alerts</h2>
        </div>
        <Chip tone={open.length ? "red" : "green"}>{open.length} open</Chip>
      </div>

      <ul className="flex-1 divide-y divide-paper/10 overflow-y-auto">
        {open.length === 0 ? (
          <li className="px-4 py-8 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55 sm:px-5">
            No open alerts · all sites acknowledged
          </li>
        ) : (
          open.map((alert) => {
            const Icon = KIND_ICON[alert.kind] ?? AlertTriangle;
            return (
              <li key={alert.id} className="px-4 py-3 sm:px-5">
                <div className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border",
                      severityTone[alert.severity] ?? severityTone.info,
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-medium leading-snug text-paper/90">{alert.title}</p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/55">
                      {projectNames[alert.projectId] ?? "Portfolio"} · {relative(alert.createdAt)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-paper/50">{alert.detail}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <Link
                        href={`/dashboard/projects/${alert.projectId}`}
                        className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold hover:underline"
                      >
                        Open site
                      </Link>
                      {canAcknowledge ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAcked((current) => ({ ...current, [alert.id]: true }));
                            acknowledge.mutate({ id: alert.id });
                          }}
                          className="inline-flex min-h-7 items-center gap-1 border border-paper/15 px-2 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/55 transition-colors hover:border-[#6FD3A6]/40 hover:text-[#6FD3A6]"
                        >
                          <Check className="h-3 w-3" /> Acknowledge
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <div className="border-t border-paper/10 px-4 py-2.5 sm:px-5">
        {showSafetyLink ? (
          <Link
            href="/dashboard/safety"
            className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/55 transition-colors hover:text-gold"
          >
            Safety & compliance register →
          </Link>
        ) : (
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/55">
            Alerts acknowledged by your project manager
          </span>
        )}
      </div>
    </div>
  );
}
