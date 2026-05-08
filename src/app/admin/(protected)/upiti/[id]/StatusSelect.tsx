"use client";

import { useState, useTransition } from "react";
import { setInquiryStatus } from "../actions";

const STATUSES = [
  { value: "new", label: "Novi" },
  { value: "read", label: "Pročitan" },
  { value: "replied", label: "Odgovoreno" },
  { value: "confirmed", label: "Potvrđen" },
  { value: "cancelled", label: "Otkazan" },
] as const;

type InquiryStatus = (typeof STATUSES)[number]["value"];

function isInquiryStatus(v: string): v is InquiryStatus {
  return STATUSES.some((s) => s.value === v);
}

interface Props {
  inquiryId: string;
  currentStatus: string;
}

export default function StatusSelect({ inquiryId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleChange(value: string) {
    if (!isInquiryStatus(value)) return;
    const previous = status;
    setStatus(value);
    setError(null);
    startTransition(async () => {
      const result = await setInquiryStatus({ inquiryId, status: value });
      if (!result.ok) {
        setStatus(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={pending}
        className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-60"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-md px-2 py-1.5">{error}</p>
      )}
      {status === "cancelled" && !error && (
        <p className="text-xs text-gray-500">
          Datumi su oslobođeni u kalendaru dostupnosti.
        </p>
      )}
      {status !== "cancelled" && !error && (
        <p className="text-xs text-gray-500">
          Datumi su rezervirani u kalendaru dostupnosti.
        </p>
      )}
    </div>
  );
}
