"use client";

import { CloudUpload, FileText, ShieldAlert } from "lucide-react";

import { relative } from "@/lib/ops/format";
import type { QueueItem } from "@/lib/field/queue";

export function FieldSyncList({ items }: { items: QueueItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border border-gold/30 bg-gold/[0.05] p-3">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
          <CloudUpload className="h-3.5 w-3.5" /> On this device · {items.length}
        </p>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-paper/55">Auto-sync on signal</span>
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item.queueId} className="flex items-center gap-2 border-b border-paper/[0.08] pb-1.5 last:border-0 last:pb-0">
            {item.kind === "log" ? (
              <FileText className="h-3.5 w-3.5 shrink-0 text-paper/55" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-[#F08A4B]" />
            )}
            <span className="min-w-0 flex-1 truncate text-[11.5px] text-paper/65">
              {item.kind === "log"
                ? `Daily log · ${item.payload.logDate}`
                : `Safety · ${item.payload.title}`}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-paper/55">
              {relative(item.queuedAt)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.08em] text-paper/55">
        Records remain on this device until the server confirms receipt. Do not clear browser storage before syncing.
      </p>
    </section>
  );
}
