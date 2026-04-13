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

/** Format a number as EUR currency */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
