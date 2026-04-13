import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import DeleteTestimonialButton from "./DeleteTestimonialButton";

export default async function TestimonialsPage() {
  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Recenzije</h1>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Nova recenzija
        </Link>
      </div>

      {!testimonials || testimonials.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center text-gray-400">
          <p className="mb-4">Nema recenzija. Dodajte prvu!</p>
          <Link href="/admin/testimonials/new" className="text-brand-primary underline text-sm">
            Dodaj recenziju
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-xl border p-5 flex items-start gap-4 ${t.is_active ? "border-gray-100" : "border-gray-100 opacity-50"}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  {!t.is_active && (
                    <span className="text-xs text-gray-400 ml-1">skriveno</span>
                  )}
                </div>
                <p className="text-sm text-brand-text line-clamp-2 mb-2">&ldquo;{t.content}&rdquo;</p>
                <p className="text-xs text-brand-muted font-semibold">
                  {t.author_name}
                  {t.author_role && <span className="font-normal"> · {t.author_role}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/testimonials/${t.id}`}
                  className="text-xs text-brand-primary font-medium hover:underline"
                >
                  Uredi
                </Link>
                <DeleteTestimonialButton id={t.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
