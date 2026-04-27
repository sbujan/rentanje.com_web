import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SeoPageForm from "../SeoPageForm";

interface Props {
  params: { id: string };
}

export default async function EditSeoPagePage({ params }: Props) {
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("seo_pages")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!page) notFound();

  return (
    <SeoPageForm
      initial={{
        id: page.id,
        title: page.title,
        slug: page.slug,
        content: page.content ?? "",
        hero_image_url: page.hero_image_url ?? "",
        is_published: page.is_published,
        seo_title: page.seo_title ?? "",
        seo_description: page.seo_description ?? "",
        seo_keywords: (page.seo_keywords ?? []).join(", "),
        schema_json: page.schema_json ? JSON.stringify(page.schema_json, null, 2) : "",
      }}
    />
  );
}
