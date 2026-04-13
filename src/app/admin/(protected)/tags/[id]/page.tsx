import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TagForm from "../TagForm";

export default async function EditTagPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: tag } = await supabase
    .from("tags")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!tag) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-text mb-6">
        Uredi oznaku
      </h1>
      <TagForm tag={tag} />
    </div>
  );
}
