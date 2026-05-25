import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { sanitizeHtml } from "@/lib/sanitize";
import { ChevronRight } from "lucide-react";
import { createPublicClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("seo_pages")
      .select("slug")
      .eq("is_published", true);
    if (error) {
      console.error("generateStaticParams (stranica) query failed:", error);
      return [];
    }
    return (data ?? []).map((p) => ({ slug: p.slug }));
  } catch (err) {
    console.error("generateStaticParams (stranica) threw:", err);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createPublicClient();
  const { data: page } = await supabase
    .from("seo_pages")
    .select("title, seo_title, seo_description, seo_keywords, hero_image_url, slug")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!page) return {};

  const title = page.seo_title ?? page.title;
  const description = page.seo_description ?? "";
  const canonical = `https://rentanje.com/stranica/${page.slug}`;

  return {
    title,
    description,
    keywords: page.seo_keywords ?? undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "rentanje.com",
      type: "article",
      locale: "hr_HR",
      images: page.hero_image_url
        ? [{ url: page.hero_image_url, width: 1200, height: 630, alt: page.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: page.hero_image_url ? [page.hero_image_url] : undefined,
    },
  };
}

export default async function SeoPage({ params }: Props) {
  const supabase = createPublicClient();

  const { data: page } = await supabase
    .from("seo_pages")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!page) notFound();

  return (
    <>
      {page.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.schema_json) }}
        />
      )}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <nav className="flex items-center gap-1 text-sm text-brand-muted mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-primary">Početna</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-brand-text font-medium line-clamp-1">{page.title}</span>
        </nav>

        {page.hero_image_url && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100">
            <Image
              src={page.hero_image_url}
              alt={page.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-text leading-tight">
            {page.title}
          </h1>
        </header>

        {page.content ? (
          <div
            className="prose prose-base max-w-none text-brand-text leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(page.content),
            }}
          />
        ) : (
          <p className="text-brand-muted">Sadržaj uskoro.</p>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="bg-brand-light rounded-xl p-6 text-center">
            <p className="font-display font-bold text-brand-text text-lg mb-2">
              Trebate opremu za vaš event?
            </p>
            <p className="text-brand-muted text-sm mb-4">
              Iznajmite opremu brzo i povoljno. Odgovaramo u roku od 1–2 sata.
            </p>
            <Link
              href="/oprema"
              className="inline-flex bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Pregledaj opremu
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
