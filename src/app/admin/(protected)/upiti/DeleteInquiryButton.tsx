"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteInquiry } from "./actions";

interface Props {
  inquiryId: string;
  inquiryNumber: string;
  /** Where to go on success. If omitted, the current view is refreshed in place. */
  redirectTo?: string;
  /** Compact icon-only button for table rows; otherwise a full labelled button. */
  iconOnly?: boolean;
}

export default function DeleteInquiryButton({
  inquiryId,
  inquiryNumber,
  redirectTo,
  iconOnly = false,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        `Obriši upit ${inquiryNumber}? Ova radnja se ne može poništiti i oslobađa rezervirane termine.`
      )
    )
      return;
    setLoading(true);
    const result = await deleteInquiry({ inquiryId });
    setLoading(false);
    if (!result.ok) {
      alert(`Greška pri brisanju: ${result.error}`);
      return;
    }
    if (redirectTo) router.push(redirectTo);
    else router.refresh();
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        aria-label={`Obriši upit ${inquiryNumber}`}
        className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 w-full justify-center border border-red-200 text-red-600 rounded-lg py-2.5 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
      Obriši upit
    </button>
  );
}
