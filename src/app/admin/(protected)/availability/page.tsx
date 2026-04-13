import { createClient } from "@/lib/supabase/server";
import AvailabilityManager from "./AvailabilityManager";

export default async function AvailabilityPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, stock_qty")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dostupnost</h1>
        <p className="text-gray-400 text-sm mt-1">
          Upravljajte rezervacijama i blokirajte datume po proizvodu.
        </p>
      </div>

      <AvailabilityManager products={products ?? []} />
    </div>
  );
}
