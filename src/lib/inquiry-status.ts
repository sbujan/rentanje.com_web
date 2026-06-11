/**
 * Single source of truth for inquiry statuses: the value list (drives the
 * zod enum in server actions) and the per-status display metadata used by
 * the admin list/detail badges and the dashboard pills.
 */

export const INQUIRY_STATUSES = ["new", "read", "replied", "confirmed", "cancelled"] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface InquiryStatusMeta {
  label: string;
  /** Combined badge classes for the admin upiti list/detail pages. */
  className: string;
  /** Dashboard pill text color (intentionally different palette). */
  color: string;
  /** Dashboard pill background. */
  bg: string;
}

export const INQUIRY_STATUS_META: Record<InquiryStatus, InquiryStatusMeta> = {
  new:       { label: "Novi",       className: "bg-red-100 text-red-700",       color: "text-amber-700",  bg: "bg-amber-100"  },
  read:      { label: "Pročitan",   className: "bg-blue-100 text-blue-700",     color: "text-blue-700",   bg: "bg-blue-100"   },
  replied:   { label: "Odgovoreno", className: "bg-yellow-100 text-yellow-700", color: "text-violet-700", bg: "bg-violet-100" },
  confirmed: { label: "Potvrđen",   className: "bg-green-100 text-green-700",   color: "text-green-700",  bg: "bg-green-100"  },
  cancelled: { label: "Otkazan",    className: "bg-gray-100 text-gray-500",     color: "text-gray-500",   bg: "bg-gray-100"   },
};
