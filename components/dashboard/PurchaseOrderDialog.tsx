"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Check, FileText, Minus, Plus, Printer, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Chip, Eyebrow } from "@/components/dashboard/ui";
import { formatDate, num, tzs } from "@/lib/ops/format";
import { cn } from "@/lib/utils";
import type { InventoryItem, ProjectSummary } from "@/types/construction";

type Line = { id: string; itemName: string; sku: string; unit: string; unitCost: number; quantity: number };

const VAT_RATE = 0.18;
const DELIVERY_TERMS = "DDP site · 50% on delivery, 50% on 30-day terms";
const VALIDITY_DAYS = 14;

export function PurchaseOrderDialog({
  projects,
  inventory,
  defaultProjectId,
}: {
  projects: ProjectSummary[];
  inventory: InventoryItem[];
  defaultProjectId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects[0]?.id ?? "");
  const [supplier, setSupplier] = useState("Steel Centre Tanzania");
  const [requiredBy, setRequiredBy] = useState("2026-12-08");
  const lowStock = inventory.filter((item) => item.stockLevel <= item.reorderPoint);
  const [lines, setLines] = useState<Line[]>(() =>
    lowStock.slice(0, 3).map((item) => ({
      id: item.id,
      itemName: item.itemName,
      sku: item.sku,
      unit: item.unit,
      unitCost: item.unitCost,
      quantity: Math.max(Math.ceil(item.reorderPoint - item.stockLevel), 1),
    })),
  );
  const [reference] = useState(() => `PO-2026-${Math.floor(1000 + Math.random() * 8999)}`);
  const [copied, setCopied] = useState(false);

  const project = projects.find((entry) => entry.id === projectId) ?? projects[0];
  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + line.unitCost * line.quantity, 0), [lines]);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  const toggleLine = (item: InventoryItem) => {
    setLines((current) => {
      if (current.some((line) => line.id === item.id)) {
        return current.filter((line) => line.id !== item.id);
      }
      return [
        ...current,
        {
          id: item.id,
          itemName: item.itemName,
          sku: item.sku,
          unit: item.unit,
          unitCost: item.unitCost,
          quantity: Math.max(Math.ceil(item.reorderPoint - item.stockLevel), 1),
        },
      ];
    });
  };

  const adjust = (id: string, delta: number) => {
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line,
      ),
    );
  };

  const onPrint = () => {
    window.print();
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex min-h-10 items-center gap-2 border border-gold/50 bg-gold px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold-soft"
        >
          <FileText className="h-3.5 w-3.5" /> Generate PO
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm print:hidden" />
        <Dialog.Content className="fixed inset-0 z-[90] overflow-y-auto bg-[#0B0D13] p-3 sm:p-6 print:static print:overflow-visible print:bg-white print:p-0">
          <div className="mx-auto max-w-6xl">
            <header className="mb-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div>
                <Eyebrow>Purchase order generator</Eyebrow>
                <Dialog.Title className="mt-1 font-display text-xl font-semibold tracking-tight text-paper">
                  Raise a purchase order
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-[12px] text-paper/45">
                  Select site, supplier and quantities. Preview updates live, then print or save as PDF.
                </Dialog.Description>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(reference).then(() => {
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 1800);
                    });
                  }}
                  className="inline-flex min-h-9 items-center gap-1.5 border border-paper/20 px-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/60 hover:border-paper/40 hover:text-paper"
                >
                  {copied ? <Check className="h-3 w-3" /> : null} {copied ? "Copied" : reference}
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close purchase order"
                    className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/60 hover:text-paper"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>
            </header>

            <div className="grid gap-3 lg:grid-cols-[380px_minmax(0,1fr)] print:block">
              {/* Controls */}
              <div className="space-y-3 print:hidden">
                <div className="border border-paper/12 bg-[#14161E] p-3">
                  <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/40" htmlFor="po-project">
                    Deliver to site
                  </label>
                  <select
                    id="po-project"
                    value={projectId}
                    onChange={(event) => setProjectId(event.target.value)}
                    className="mt-1.5 h-10 w-full border border-paper/15 bg-[#0F1117] px-2.5 text-[12.5px] text-paper focus:border-gold/60 focus:outline-none"
                  >
                    {projects.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.name}
                      </option>
                    ))}
                  </select>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/40" htmlFor="po-supplier">
                        Supplier
                      </label>
                      <input
                        id="po-supplier"
                        value={supplier}
                        onChange={(event) => setSupplier(event.target.value)}
                        className="mt-1.5 h-10 w-full border border-paper/15 bg-[#0F1117] px-2.5 text-[12px] text-paper focus:border-gold/60 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/40" htmlFor="po-required">
                        Required by
                      </label>
                      <input
                        id="po-required"
                        type="date"
                        value={requiredBy}
                        onChange={(event) => setRequiredBy(event.target.value)}
                        className="mt-1.5 h-10 w-full border border-paper/15 bg-[#0F1117] px-2.5 text-[12px] text-paper focus:border-gold/60 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-paper/12 bg-[#14161E]">
                  <div className="flex items-center justify-between border-b border-paper/10 px-3 py-2">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/40">Line items</p>
                    <Chip tone="gold" className="px-1.5 py-0">{lines.length} selected</Chip>
                  </div>
                  <ul className="max-h-[260px] overflow-y-auto">
                    {inventory.map((item) => {
                      const selected = lines.some((line) => line.id === item.id);
                      const low = item.stockLevel <= item.reorderPoint;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => toggleLine(item)}
                            aria-pressed={selected}
                            className={cn(
                              "flex w-full items-center gap-2.5 border-b border-paper/[0.06] px-3 py-2 text-left transition-colors",
                              selected ? "bg-gold/[0.07]" : "hover:bg-paper/[0.04]",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-4 w-4 shrink-0 items-center justify-center border",
                                selected ? "border-gold bg-gold text-ink" : "border-paper/25",
                              )}
                            >
                              {selected ? <Check className="h-3 w-3" /> : null}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[12px] text-paper/80">{item.itemName}</span>
                              <span className="block font-mono text-[8.5px] uppercase tracking-[0.1em] text-paper/30">
                                {item.sku} · {num(item.stockLevel)} {item.unit} on hand
                              </span>
                            </span>
                            {low ? <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#F08A4B]">Low</span> : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={onPrint}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 border border-gold bg-gold px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink hover:bg-gold-soft"
                  >
                    <Printer className="h-4 w-4" /> Print / save PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center justify-center border border-paper/20 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/60 hover:text-paper print:hidden"
                  >
                    Close
                  </button>
                </div>
                <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-paper/30 print:hidden">
                  PDF output uses the browser print dialog (Choose “Save as PDF”). PO is not committed until issued by
                  procurement.
                </p>
              </div>

              {/* Document */}
              <div className="min-w-0">
                <div id="po-document" className="bg-[#FFFDF7] px-5 py-6 text-[#14161E] sm:px-8 sm:py-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#14161E] pb-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/brand/altra-wordmark.svg"
                        alt="Altra Build"
                        width={150}
                        height={40}
                        className="h-9 w-auto"
                        unoptimized
                      />
                      <span className="border-l border-[#14161E]/20 pl-3 font-mono text-[8px] uppercase leading-tight tracking-[0.16em] text-[#14161E]/60">
                        Altra Build Co. Ltd
                        <br />
                        BRELA 104-882-TZ
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#C88F12]">Purchase order</p>
                      <p className="mt-1 font-mono text-[15px] font-semibold tracking-[0.04em]">{reference}</p>
                      <p className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[#14161E]/50">
                        Issued 23 Nov 2026 · Valid {VALIDITY_DAYS} days
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#14161E]/40">Vendor</p>
                      <p className="mt-1 text-[11.5px] font-semibold">{supplier || "—"}</p>
                      <p className="mt-0.5 text-[9.5px] leading-relaxed text-[#14161E]/55">
                        Supplier of record
                        <br />
                        TIN pending verification
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#14161E]/40">Deliver to</p>
                      <p className="mt-1 text-[11.5px] font-semibold">{project?.name ?? "Alt ra site"}</p>
                      <p className="mt-0.5 text-[9.5px] leading-relaxed text-[#14161E]/55">
                        {project?.address ?? "Dar es Salaam"}
                        <br />
                        Attn: {project?.manager ?? "Site manager"}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#14161E]/40">Terms</p>
                      <p className="mt-1 text-[9.5px] leading-relaxed text-[#14161E]/70">
                        {DELIVERY_TERMS}
                        <br />
                        Required by {formatDate(requiredBy)}
                        <br />
                        Currency TZS
                      </p>
                    </div>
                  </div>

                  <table className="mt-5 w-full border-collapse text-left">
                    <thead>
                      <tr className="border-y border-[#14161E]/20 font-mono text-[8px] uppercase tracking-[0.14em] text-[#14161E]/50">
                        <th className="py-2 pr-2 font-normal">#</th>
                        <th className="py-2 pr-2 font-normal">Description</th>
                        <th className="py-2 pr-2 text-right font-normal">Qty</th>
                        <th className="py-2 pr-2 font-normal">Unit</th>
                        <th className="py-2 pr-2 text-right font-normal">Rate</th>
                        <th className="py-2 text-right font-normal">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line, index) => (
                        <tr key={line.id} className="border-b border-[#14161E]/10 align-top">
                          <td className="py-2 pr-2 font-mono text-[9px] text-[#14161E]/40">{String(index + 1).padStart(2, "0")}</td>
                          <td className="py-2 pr-2 text-[10.5px]">
                            {line.itemName}
                            <span className="block font-mono text-[8px] uppercase tracking-[0.1em] text-[#14161E]/40">
                              {line.sku}
                            </span>
                          </td>
                          <td className="py-2 pr-2 text-right font-mono text-[10px] tabular-nums">{num(line.quantity)}</td>
                          <td className="py-2 pr-2 text-[9.5px] text-[#14161E]/60">{line.unit}</td>
                          <td className="py-2 pr-2 text-right font-mono text-[9.5px] tabular-nums">{tzs(line.unitCost, 0)}</td>
                          <td className="py-2 text-right font-mono text-[10px] tabular-nums">{tzs(line.unitCost * line.quantity, 0)}</td>
                        </tr>
                      ))}
                      {lines.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-[#14161E]/40">
                            Select at least one line item
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>

                  <div className="mt-4 flex justify-end">
                    <dl className="w-full max-w-[260px] space-y-1.5 font-mono text-[10px]">
                      <div className="flex justify-between">
                        <dt className="text-[#14161E]/50">Subtotal</dt>
                        <dd className="tabular-nums">{tzs(subtotal, 0)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[#14161E]/50">VAT (18%)</dt>
                        <dd className="tabular-nums">{tzs(vat, 0)}</dd>
                      </div>
                      <div className="flex justify-between border-t border-[#14161E] pt-1.5 text-[12px] font-semibold">
                        <dt>Total</dt>
                        <dd className="tabular-nums">{tzs(total, 0)}</dd>
                      </div>
                    </dl>
                  </div>

                  <p className="mt-5 border-t border-[#14161E]/15 pt-3 text-[8.5px] leading-relaxed text-[#14161E]/55">
                    This order is subject to Altra Build&apos;s standard conditions of purchase. Deliveries must be
                    accompanied by a delivery note quoting {reference}; materials will be inspected and counted on
                    receipt. Invoices to procurement@altrabuild.co.tz quoting the PO reference. Late deliveries may be
                    rejected without prejudice. Site safety induction and PPE are mandatory for all delivery personnel.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-8">
                    <div>
                      <div className="h-8 border-b border-[#14161E]/40" />
                      <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#14161E]/45">
                        Approved — procurement
                      </p>
                    </div>
                    <div>
                      <div className="h-8 border-b border-[#14161E]/40" />
                      <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#14161E]/45">
                        Accepted — supplier
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#14161E]/15 pt-2 font-mono text-[7.5px] uppercase tracking-[0.14em] text-[#14161E]/40">
                    <span>Plot 1482 Msasani Peninsula, Dar es Salaam · +255 22 550 0148</span>
                    <span>{reference}</span>
                  </div>
                </div>

                {lines.length > 0 ? (
                  <div className="mt-2 flex items-center justify-between gap-3 border border-paper/12 bg-[#14161E] px-3 py-2 print:hidden">
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/40">
                      Adjust quantities inline
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {lines.map((line) => (
                        <span key={line.id} className="flex items-center gap-1 border border-paper/12">
                          <button
                            type="button"
                            aria-label={`Decrease ${line.itemName}`}
                            onClick={() => adjust(line.id, -1)}
                            className="flex h-7 w-7 items-center justify-center text-paper/50 hover:text-paper"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center font-mono text-[10px] tabular-nums text-paper/70">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${line.itemName}`}
                            onClick={() => adjust(line.id, 1)}
                            className="flex h-7 w-7 items-center justify-center text-paper/50 hover:text-paper"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
