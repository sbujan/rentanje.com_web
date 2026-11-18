import { anchorPriceText } from "@/lib/anchor-price";

interface Props {
  /** "YYYY-MM-DD"; nothing renders without it. */
  date: string | null | undefined;
  amount: number | null | undefined;
  /** e.g. "/dan" */
  unit?: string;
  className?: string;
}

/** The small "Cijena na 10.09.2026: 30 €/dan" line that sits under a price. */
export default function AnchorPriceNote({ date, amount, unit, className = "" }: Props) {
  if (!date || amount == null || !Number.isFinite(amount)) return null;
  return (
    <span className={`block text-[11px] leading-tight text-brand-muted ${className}`}>
      {anchorPriceText(date, amount, unit)}
    </span>
  );
}
