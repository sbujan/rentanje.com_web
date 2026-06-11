import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Strip Croatian diacritics and generate a URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[šŠ]/g, "s")
    .replace(/[čČ]/g, "c")
    .replace(/[žŽ]/g, "z")
    .replace(/[ćĆ]/g, "c")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Format a Date as YYYY-MM-DD using its LOCAL calendar day (no UTC shift). */
export function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Format a number as EUR currency. By default renders 0–2 decimals as needed
 * ("10 €", "10,5 €"). Pass `fractionDigits` to force a fixed number of
 * decimals (0 → "10 €" rounded, 2 → "10,00 €").
 */
export function formatPrice(amount: number, fractionDigits?: number): string {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: fractionDigits ?? 0,
    maximumFractionDigits: fractionDigits ?? 2,
  }).format(amount);
}

/**
 * Format a date string for hr-HR display ("5. lip 2026.").
 * Date-only strings ("YYYY-MM-DD") parse as UTC midnight, which can roll back
 * a day in negative-UTC timezones — anchor them at local noon. Legacy ISO
 * datetime values (older records) pass through unchanged.
 */
export function formatDate(value: string): string {
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value;
  return new Date(iso).toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
