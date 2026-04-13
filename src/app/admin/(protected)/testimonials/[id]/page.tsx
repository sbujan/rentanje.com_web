import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TestimonialForm from "../TestimonialForm";

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", params.id).single();
  if (!data) notFound();
  return <TestimonialForm initial={data} />;
}
