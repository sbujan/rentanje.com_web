import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import CategoryForm from "../CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!category) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-text mb-6">
        Uredi kategoriju
      </h1>
      <CategoryForm category={category} />
    </div>
  );
}
