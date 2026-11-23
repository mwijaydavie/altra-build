"use client";

import { CheckCircle2, CloudOff, Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";

import { cn } from "@/lib/utils";

export function OfflineSyncBadge({
  online,
  queued,
  syncing,
  lastSynced,
  onSync,
}: {
  online: boolean;
  queued: number;
  syncing: boolean;
  lastSynced: string | null;
  onSync: () => void;
}) {
  const tone = !online ? "gold" : queued > 0 ? "gold" : "green";
  const label = syncing
    ? "Syncing"
    : !online
      ? "Offline"
      : queued > 0
        ? `${queued} queued`
        : "Synced";

  return (
    <button
      type="button"
      onClick={onSync}
      disabled={syncing || queued === 0 || !online}
      aria-label={`${label}. ${queued} records in the offline queue. Tap to sync now.`}
      className={cn(
        "flex min-h-11 items-center gap-2 border px-2.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors disabled:cursor-default",
        tone === "green"
          ? "border-[#6FD3A6]/35 bg-[#6FD3A6]/10 text-[#6FD3A6]"
          : "border-gold/40 bg-gold/10 text-gold",
      )}
    >
      {syncing ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : !online ? (
        <CloudOff className="h-3.5 w-3.5" />
      ) : queued > 0 ? (
        <RefreshCw className="sync-arrow h-3.5 w-3.5" />
      ) : (
        <CheckCircle2 className="h-3.5 w-3.5" />
      )}
      <span>{label}</span>
      <span className="flex items-center gap-1 border-l border-current/30 pl-2">
        {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
      </span>
      {lastSynced ? (
        <span className="hidden font-mono text-[8px] text-paper/35 lg:inline">· {lastSynced}</span>
      ) : null}
    </button>
  );
}
