"use client";

import { AlertTriangle, Check, PackageCheck, Search, Truck, X } from "lucide-react";
import { useMemo, useState } from "react";

import { PurchaseOrderDialog } from "@/components/dashboard/PurchaseOrderDialog";
import { Chip, Eyebrow, LoadingBlock, Meter, Panel, PanelHeader } from "@/components/dashboard/ui";
import { useOpsSnapshot, useRequisitionDecision } from "@/lib/ops/hooks";
import { formatDate, num, statusLabel, tzs } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { MaterialCategory, Requisition } from "@/types/construction";

const CATEGORIES: { id: "all" | MaterialCategory; label: string }[] = [
  { id: "all", label: "All stock" },
  { id: "structural", label: "Structural" },
  { id: "electrical", label: "Electrical" },
  { id: "plumbing", label: "Plumbing" },
  { id: "finishing", label: "Finishing" },
];

export default function ProcurementPage() {
  const { data, isLoading } = useOpsSnapshot();
  const decision = useRequisitionDecision();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | MaterialCategory>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const projectNames = useMemo(
    () => Object.fromEntries((data?.projects ?? []).map((project) => [project.id, project.name])),
    [data],
  );

  if (isLoading || !data) {
    return (
      <div className="space-y-3 px-3 py-5 sm:px-5">
        <LoadingBlock className="h-16 w-1/2" />
        <LoadingBlock className="h-40" />
        <LoadingBlock className="h-64" />
      </div>
    );
  }

  if (data.viewer.role === "client") {
    return (
      <div className="px-4 py-16">
        <Panel className="mx-auto max-w-md p-6">
          <Eyebrow>Restricted area</Eyebrow>
          <h1 className="mt-2 text-lg font-semibold text-paper">Procurement is an internal function</h1>
          <p className="mt-2 text-sm text-paper/50">
            Supplier pricing and stock positions are not shared in the client workspace. Your commercial contact can
            provide material approvals on request.
          </p>
        </Panel>
      </div>
    );
  }

  const { inventory, requisitions, projects } = data;
  const canApprove = data.viewer.role === "executive" || data.viewer.role === "pm";
  const filtered = inventory.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const term = query.trim().toLowerCase();
    const matchesQuery =
      !term ||
      item.itemName.toLowerCase().includes(term) ||
      item.sku.toLowerCase().includes(term) ||
      item.warehouse.toLowerCase().includes(term);
    return matchesCategory && matchesQuery;
  });
  const lowStock = inventory.filter((item) => item.stockLevel <= item.reorderPoint);
  const pending = requisitions.filter((requisition) => requisition.approvalStatus === "pending");
  const inTransit = requisitions.filter((requisition) => requisition.approvalStatus === "approved" && requisition.deliveryTrackingCode);
  const pendingValue = pending.reduce((sum, requisition) => sum + requisition.estimatedCost, 0);

  const onDecision = (requisition: Requisition, approvalStatus: "approved" | "rejected" | "delivered") => {
    setError(null);
    setBusy(requisition.id);
    decision.mutate(
      { id: requisition.id, approvalStatus },
      {
        onError: (mutationError: Error) => setError(mutationError.message),
        onSettled: () => setBusy(null),
      },
    );
  };

  return (
    <div className="px-3 pb-10 pt-5 sm:px-5 sm:pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-paper/10 pb-5">
        <div>
          <Eyebrow>Supply chain · 23 Nov 2026</Eyebrow>
          <h1 className="mt-2 font-display text-[27px] font-semibold leading-none tracking-[-0.035em] text-paper sm:text-[34px]">
            Procurement & materials.
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-paper/50">
            Stock positions across the Ubungo consolidated yard and site stores, requisition approvals, and purchase
            order issue.
          </p>
        </div>
        <PurchaseOrderDialog projects={projects} inventory={inventory} defaultProjectId={projects[0]?.id} />
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-px bg-paper/10 xl:grid-cols-4">
        {[
          { label: "Low-stock lines", value: `${lowStock.length}`, note: "At or below reorder point", tone: lowStock.length ? "text-[#F08A4B]" : "text-paper" },
          { label: "Awaiting approval", value: `${pending.length}`, note: "Requisitions in queue", tone: pending.length ? "text-gold" : "text-paper" },
          { label: "Value in queue", value: tzs(pendingValue), note: "Estimated cost", tone: "text-paper" },
          { label: "In transit", value: `${inTransit.length}`, note: "Approved with tracking", tone: "text-[#6FD3A6]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--ops-panel-2)] p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/35">{stat.label}</p>
            <p className={cn("mt-2 font-display text-[22px] font-semibold leading-none tabular-nums", stat.tone)}>{stat.value}</p>
            <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/30">{stat.note}</p>
          </div>
        ))}
      </div>

      {lowStock.length ? (
        <div className="mt-3 flex flex-wrap items-start gap-3 border border-[#F08A4B]/30 bg-[#F08A4B]/[0.06] px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F08A4B]" />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F08A4B]">
              Reorder required · {lowStock.length} lines
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-paper/60">
              {lowStock.map((item) => `${item.itemName} (${num(item.stockLevel)} ${item.unit})`).join(" · ")}
            </p>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/40">
            Auto-drafted in PO generator
          </span>
        </div>
      ) : null}

      {/* Stock */}
      <Panel className="mt-3">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-paper/10 px-4 py-3.5 sm:px-5">
          <div>
            <Eyebrow>Inventory</Eyebrow>
            <h2 className="mt-1 text-[15px] font-semibold tracking-tight text-paper">Material stock position</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-paper/35" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search stock…"
                aria-label="Search stock"
                className="h-9 w-44 border border-paper/15 bg-paper/[0.03] pl-8 pr-2 text-[12px] text-paper placeholder:text-paper/30 focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCategory(option.id)}
                  aria-pressed={category === option.id}
                  className={cn(
                    "min-h-8 border px-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors",
                    category === option.id
                      ? "border-gold/50 bg-gold/10 text-gold"
                      : "border-paper/15 text-paper/45 hover:text-paper/75",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-paper/10 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/30">
                <th className="px-4 py-2 font-normal">Material</th>
                <th className="px-4 py-2 font-normal">Store</th>
                <th className="px-4 py-2 text-right font-normal">On hand</th>
                <th className="px-4 py-2 text-right font-normal">Reorder</th>
                <th className="px-4 py-2 font-normal">Cover</th>
                <th className="px-4 py-2 text-right font-normal">Unit cost</th>
                <th className="px-4 py-2 text-right font-normal">Value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const ratio = item.reorderPoint === 0 ? 1 : item.stockLevel / item.reorderPoint;
                const low = ratio <= 1;
                return (
                  <tr key={item.id} className="border-b border-paper/[0.06] last:border-0 hover:bg-paper/[0.03]">
                    <td className="px-4 py-2.5">
                      <p className="text-[12.5px] text-paper/85">{item.itemName}</p>
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-paper/30">
                        {item.sku} · {item.category}
                      </p>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper/45">
                      {item.warehouse}
                    </td>
                    <td className={cn("px-4 py-2.5 text-right font-mono text-[11px] tabular-nums", low ? "text-[#F08A4B]" : "text-paper/75")}>
                      {num(item.stockLevel)} <span className="text-[8.5px] uppercase text-paper/30">{item.unit}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[10px] tabular-nums text-paper/40">
                      {num(item.reorderPoint)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Meter value={Math.min(ratio * 100, 100)} tone={low ? "orange" : "green"} height="h-1.5" className="w-24" />
                        <span className="font-mono text-[9px] tabular-nums text-paper/35">{Math.round(ratio * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[10px] tabular-nums text-paper/55">
                      {tzs(item.unitCost, 0)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[10.5px] tabular-nums text-paper/70">
                      {tzs(item.stockLevel * item.unitCost)}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper/30">
                    No stock matches that filter
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Requisitions */}
      <Panel className="mt-3">
        <PanelHeader
          eyebrow="Requisitions"
          title="Material requests & deliveries"
          action={
            <div className="flex items-center gap-2">
              <Chip tone="gold">{pending.length} pending</Chip>
              <Chip tone="neutral">{requisitions.length} total</Chip>
            </div>
          }
        />
        {error ? (
          <p className="border-b border-[#F26D5B]/30 bg-[#F26D5B]/10 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#F26D5B]">
            {error}
          </p>
        ) : null}

        <ul className="divide-y divide-paper/[0.08]">
          {requisitions.map((requisition) => (
            <li key={requisition.id} className="px-4 py-3 transition-colors hover:bg-paper/[0.02] sm:px-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[12.5px] font-medium text-paper/85">{requisition.itemName}</p>
                    <Chip
                      tone={
                        requisition.approvalStatus === "approved"
                          ? "green"
                          : requisition.approvalStatus === "rejected"
                            ? "red"
                            : requisition.approvalStatus === "delivered"
                              ? "neutral"
                              : "gold"
                      }
                      className="px-1.5 py-0"
                    >
                      {statusLabel[requisition.approvalStatus] ?? requisition.approvalStatus}
                    </Chip>
                  </div>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-paper/35">
                    {projectNames[requisition.projectId] ?? "Portfolio"} · {num(requisition.quantityRequested)}{" "}
                    {requisition.unit} · {requisition.supplier} · required {formatDate(requisition.requiredBy)}
                  </p>
                  {requisition.deliveryTrackingCode ? (
                    <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#6FD3A6]/80">
                      <Truck className="h-3 w-3" /> {requisition.deliveryTrackingCode}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] tabular-nums text-paper/60">{tzs(requisition.estimatedCost)}</span>
                  {canApprove && requisition.approvalStatus === "pending" ? (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        disabled={busy === requisition.id}
                        onClick={() => onDecision(requisition, "approved")}
                        className="inline-flex min-h-8 items-center gap-1 border border-gold/50 px-2 font-mono text-[9px] uppercase tracking-[0.12em] text-gold hover:bg-gold hover:text-ink disabled:opacity-40"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </button>
                      <button
                        type="button"
                        disabled={busy === requisition.id}
                        onClick={() => onDecision(requisition, "rejected")}
                        className="inline-flex min-h-8 items-center gap-1 border border-paper/20 px-2 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/50 hover:border-[#F26D5B]/50 hover:text-[#F26D5B] disabled:opacity-40"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null}
                  {canApprove && requisition.approvalStatus === "approved" ? (
                    <button
                      type="button"
                      disabled={busy === requisition.id}
                      onClick={() => onDecision(requisition, "delivered")}
                      className="inline-flex min-h-8 items-center gap-1 border border-paper/20 px-2 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/50 hover:border-[#6FD3A6]/50 hover:text-[#6FD3A6] disabled:opacity-40"
                    >
                      <PackageCheck className="h-3 w-3" /> Delivered
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/25">
        Stock counts verified 22 Nov 2026 · Ubungo yard, Msasani store, Mwanza batch plant · VAT exclusive pricing
      </p>
    </div>
  );
}
