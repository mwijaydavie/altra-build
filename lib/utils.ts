import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 1234567 -> "1,234,567" (deterministic, locale-free — hydration safe). */
export function formatNumber(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatTZS(value: number): string {
  if (value >= 1_000_000_000) {
    return `TZS ${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `TZS ${(value / 1_000_000).toFixed(2)}M`;
  }
  return `TZS ${formatNumber(value)}`;
}

export function usdFromTzs(value: number, rate = 2650): string {
  const usd = value / rate;
  if (usd >= 1_000_000) return `≈ US$ ${(usd / 1_000_000).toFixed(2)}M`;
  return `≈ US$ ${Math.round(usd / 1000)}k`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(d.getUTCDate()).padStart(2, "0")} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
