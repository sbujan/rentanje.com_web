"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { resyncInquiryAvailability } from "./actions";

interface Props {
  inquiryId: string;
}

export default function ResyncAvailabilityButton({ inquiryId }: Props) {
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    setMessage(null);
    startTransition(async () => {
      const result = await resyncInquiryAvailability({ inquiryId });
      if (!result.ok) {
        setMessage({ ok: false, text: result.error });
        return;
      }
      setMessage({ ok: true, text: "Termini su ponovno blokirani u kalendaru." });
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="flex items-center gap-2 w-full justify-center border border-gray-200 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        <CalendarCheck className="h-4 w-4" />
        Ponovno blokiraj termine
      </button>
      {message && (
        <p
          className={`text-xs rounded-md px-2 py-1.5 ${
            message.ok ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
