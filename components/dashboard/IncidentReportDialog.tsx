"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Download, FileWarning, Printer, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { formatDate, num, statusLabel } from "@/lib/ops/format";
import type { SafetyIncident } from "@/types/construction";

export function IncidentReportDialog({
  incidents,
  projectNames,
  inspectorNames,
}: {
  incidents: SafetyIncident[];
  projectNames: Record<string, string>;
  inspectorNames: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const resolved = incidents.filter((incident) => incident.status === "resolved").length;
  const lti = incidents.filter((incident) => incident.type === "severe" && incident.status !== "resolved").length;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex min-h-10 items-center gap-2 border border-paper/20 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70 transition-colors hover:border-gold/50 hover:text-gold"
        >
          <Download className="h-3.5 w-3.5" /> Export report
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm print:hidden" />
        <Dialog.Content className="ops-root fixed inset-0 z-[90] overflow-y-auto bg-[var(--ops-dialog)] p-3 sm:p-6 print:static print:overflow-visible print:bg-white print:p-0">
          <div className="mx-auto max-w-3xl">
            <header className="mb-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div>
                <Dialog.Title className="font-display text-lg font-semibold tracking-tight text-paper">
                  Incident & inspection report
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-[11.5px] text-paper/45">
                  ISO 45001 aligned register extract · {incidents.length} records
                </Dialog.Description>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-9 items-center gap-1.5 border border-gold bg-gold px-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink hover:bg-gold-soft"
                >
                  <Printer className="h-3.5 w-3.5" /> Print / save PDF
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close report"
                    className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/60 hover:text-paper"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>
            </header>

            <div id="incident-document" className="bg-[#FFFDF7] px-5 py-6 text-[#14161E] sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#14161E] pb-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/brand/altra-wordmark.svg"
                    alt="Altra Build"
                    width={150}
                    height={40}
                    className="h-8 w-auto"
                    unoptimized
                  />
                  <span className="border-l border-[#14161E]/20 pl-3 font-mono text-[8px] uppercase leading-tight tracking-[0.14em] text-[#14161E]/60">
                    HSE department
                    <br />
                    ISO 45001 aligned
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#C88F12]">Safety report</p>
                  <p className="mt-1 font-mono text-[13px] font-semibold">HSE-2026-1123</p>
                  <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#14161E]/50">
                    Generated 23 Nov 2026
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 border-b border-[#14161E]/15 pb-4">
                {[
                  { label: "Records", value: `${incidents.length}` },
                  { label: "Resolved", value: `${resolved}` },
                  { label: "Open severe", value: `${lti}` },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-[#14161E]/45">{stat.label}</p>
                    <p className="mt-0.5 font-mono text-[16px] font-semibold tabular-nums">{stat.value}</p>
                  </div>
                ))}
              </div>

              <table className="mt-4 w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#14161E]/25 font-mono text-[7.5px] uppercase tracking-[0.12em] text-[#14161E]/50">
                    <th className="py-1.5 pr-2 font-normal">Date</th>
                    <th className="py-1.5 pr-2 font-normal">Site</th>
                    <th className="py-1.5 pr-2 font-normal">Type / severity</th>
                    <th className="py-1.5 pr-2 font-normal">Finding</th>
                    <th className="py-1.5 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.id} className="border-b border-[#14161E]/10 align-top">
                      <td className="py-1.5 pr-2 font-mono text-[8px] text-[#14161E]/60">
                        {formatDate(incident.occurredAt.slice(0, 10))}
                      </td>
                      <td className="py-1.5 pr-2 text-[8.5px]">{projectNames[incident.projectId] ?? "—"}</td>
                      <td className="py-1.5 pr-2 text-[8.5px]">
                        {incident.type.replace("-", " ")}
                        <span className="block font-mono text-[7px] uppercase tracking-[0.1em] text-[#14161E]/45">
                          {incident.severity}
                        </span>
                      </td>
                      <td className="py-1.5 pr-2 text-[8.5px]">
                        {incident.title}
                        <span className="mt-0.5 block text-[7.5px] leading-snug text-[#14161E]/55">
                          {incident.correctiveAction || "Corrective action pending."}
                        </span>
                      </td>
                      <td className="py-1.5 font-mono text-[7.5px] uppercase tracking-[0.08em] text-[#14161E]/60">
                        {statusLabel[incident.status] ?? incident.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 grid gap-3 border-t border-[#14161E]/15 pt-3 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-[#14161E]/45">Prepared by</p>
                  <p className="mt-0.5 text-[9px]">Joseph Mwansasu — Director of Safety & Operations</p>
                </div>
                <div>
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-[#14161E]/45">Inspections logged by</p>
                  <p className="mt-0.5 text-[9px]">
                    {[...new Set(incidents.map((incident) => inspectorNames[incident.inspectorId]).filter(Boolean))].join(", ") ||
                      "HSE team"}
                  </p>
                </div>
              </div>

              <p className="mt-4 border-t border-[#14161E]/15 pt-2 font-mono text-[7px] uppercase leading-relaxed tracking-[0.1em] text-[#14161E]/40">
                {num(incidents.length)} records · Statutory notifications made under OSHA TZ §105 where applicable · This
                extract is generated from the ALTRA COMMAND audit register and is not a substitute for the statutory
                accident book.
              </p>
            </div>

            <p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/30 print:hidden">
              <FileWarning className="h-3 w-3" /> Use “Save as PDF” in the print dialog to archive this report.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
