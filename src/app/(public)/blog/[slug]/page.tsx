import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ChevronRight, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { hr } from "date-fns/locale";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, seo_title, seo_description, excerpt, hero_image_url, slug")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!post) return {};

  const title = post.seo_title ?? post.title;
  const description = post.seo_description ?? post.excerpt ?? "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://rentanje.com/blog/${post.slug}`,
      siteName: "rentanje.com",
      type: "article",
      images: post.hero_image_url
        ? [{ url: post.hero_image_url, width: 1200, height: 630, alt: post.title }]
        : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  // JSON-LD Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? post.title,
    image: post.hero_image_url ? [post.hero_image_url] : undefined,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "rentanje.com",
      url: "https://rentanje.com",
    },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url: `https://rentanje.com/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-brand-muted mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-primary">Početna</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/blog" className="hover:text-brand-primary">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-brand-text font-medium line-clamp-1">{post.title}</span>
        </nav>

        {/* Hero image */}
        {post.hero_image_url && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100">
            <Image
              src={post.hero_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-text leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-brand-muted flex-wrap">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            {post.published_at && (
              <span>{format(new Date(post.published_at), "d. MMMM yyyy", { locale: hr })}</span>
            )}
            {post.reading_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.reading_time} min čitanja
              </span>
            )}
          </div>
        </header>

        {/* Content */}
        {post.content ? (
          <div
            className="prose prose-base max-w-none text-brand-text leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-brand-muted">Sadržaj uskoro.</p>
        )}

        {/* CTA */}
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
