"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "./actions";

export default function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Obriši proizvod "${name}"? Ova radnja se ne može poništiti.`)) return;
    setLoading(true);
    const result = await deleteProduct({ productId: id });
    setLoading(false);
    if (!result.ok) {
      alert(`Greška pri brisanju: ${result.error}`);
      return;
    }
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-600 hover:border-red-200"
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  );
}
