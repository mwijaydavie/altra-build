/** Shared formatters for the command surface. TZS-aware, hydration-safe. */

export const tzs = (value: number, decimals = 1): string => {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000) return `TZS ${(value / 1_000_000_000_000).toFixed(decimals)}T`;
  if (abs >= 1_000_000_000) return `TZS ${(value / 1_000_000_000).toFixed(decimals)}B`;
  if (abs >= 1_000_000) return `TZS ${(value / 1_000_000).toFixed(decimals)}M`;
  if (abs >= 1_000) return `TZS ${(value / 1_000).toFixed(0)}K`;
  return `TZS ${value.toFixed(0)}`;
};

export const tzsAxis = (value: number): string => {
  if (Math.abs(value) >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)}B`;
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  return `${value}`;
};

export const num = (value: number, decimals = 0): string =>
  new Intl.NumberFormat("en-TZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

export const compact = (value: number): string => {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${Math.round(value)}`;
};

export const pct = (ratio: number, decimals = 1): string => `${(ratio * 100).toFixed(decimals)}%`;

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "—";
  const date = new Date(iso.length <= 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
};

export const formatDateShort = (iso: string): string => {
  const date = new Date(iso.length <= 10 ? `${iso}T00:00:00Z` : iso);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
};

export const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
};

export const relative = (iso: string, now: number = Date.now()): string => {
  const then = new Date(iso).getTime();
  const minutes = Math.max(Math.round((now - then) / 60_000), 0);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
};

export const initials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export const daysBetween = (a: string, b: string): number => {
  const start = new Date(`${a}T00:00:00Z`).getTime();
  const end = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round((end - start) / 86_400_000);
};

export const severityTone: Record<string, string> = {
  low: "text-[#8FB8A8] border-[#8FB8A8]/30 bg-[#8FB8A8]/10",
  info: "text-[#8FB8A8] border-[#8FB8A8]/30 bg-[#8FB8A8]/10",
  medium: "text-gold border-gold/30 bg-gold/10",
  warning: "text-gold border-gold/30 bg-gold/10",
  high: "text-[#F08A4B] border-[#F08A4B]/30 bg-[#F08A4B]/10",
  severe: "text-[#F08A4B] border-[#F08A4B]/30 bg-[#F08A4B]/10",
  critical: "text-[#F26D5B] border-[#F26D5B]/40 bg-[#F26D5B]/10",
};

export const trafficTone: Record<string, { dot: string; text: string; label: string }> = {
  green: { dot: "bg-[#6FD3A6]", text: "text-[#6FD3A6]", label: "On track" },
  amber: { dot: "bg-gold", text: "text-gold", label: "Watch" },
  red: { dot: "bg-[#F26D5B]", text: "text-[#F26D5B]", label: "Intervene" },
};

export const statusLabel: Record<string, string> = {
  "pre-con": "Pre-con",
  active: "Active",
  "on-hold": "On hold",
  handover: "Handover",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  delivered: "Delivered",
  open: "Open",
  answered: "Answered",
  "pending-approval": "Awaiting approval",
  closed: "Closed",
  "under-review": "Under review",
  resolved: "Resolved",
  due: "Due",
  submitted: "Submitted",
  paid: "Paid",
  overdue: "Overdue",
  draft: "Draft",
  compliant: "Compliant",
  "action-required": "Action required",
  current: "Current",
  superseded: "Superseded",
  "for-review": "For review",
};
