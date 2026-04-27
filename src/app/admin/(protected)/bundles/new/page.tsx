import { createClient } from "@/lib/supabase/server";
import BundleForm from "../BundleForm";

export default async function NewBundlePage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  return <BundleForm productOptions={products ?? []} />;
}
