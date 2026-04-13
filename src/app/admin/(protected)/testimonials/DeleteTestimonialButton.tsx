"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

export default function DeleteTestimonialButton({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm("Obrisati ovu recenziju?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-gray-400 hover:text-red-500 transition-colors"
      aria-label="Obriši"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
