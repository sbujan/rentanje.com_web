"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function handleChange(value: string) {
    if (!isInquiryStatus(value)) return;
    setSaving(true);
    setStatus(value);
    await supabase.from("inquiries").update({ status: value }).eq("id", inquiryId);
    setSaving(false);
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
