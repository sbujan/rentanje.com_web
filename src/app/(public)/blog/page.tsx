import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Clock } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import { format } from "date-fns";
import { hr } from "date-fns/locale";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — rentanje.com",
  description:
    "Savjeti, ideje i vodiči za iznajmljivanje opreme, outdoor evente i roštilj u Zagrebu.",
  alternates: { canonical: "https://rentanje.com/blog" },
  openGraph: {
    title: "Blog — rentanje.com",
    description:
      "Savjeti, ideje i vodiči za iznajmljivanje opreme, outdoor evente i roštilj u Zagrebu.",
    url: "https://rentanje.com/blog",
    siteName: "rentanje.com",
    type: "website",
    locale: "hr_HR",
    images: [{ url: "/rentanje-com-hero.jpg", width: 1200, height: 630, alt: "rentanje.com" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — rentanje.com",
    description: "Savjeti, ideje i vodiči za iznajmljivanje opreme u Zagrebu.",
    images: ["/rentanje-com-hero.jpg"],
  },
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, hero_image_url, author, published_at, reading_time")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <main>
      <PageHero
        title="Blog"
        subtitle="Savjeti, vodiči i ideje za vaše sljedeće iznajmljivanje."
        breadcrumbs={[{ href: "/", label: "Početna" }, { label: "Blog" }]}
        color="#BCA7F0"
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {!posts || posts.length === 0 ? (
        <div className="py-20 text-center text-brand-muted">
          <p className="text-lg mb-2">Uskoro stiže sadržaj.</p>
          <Link href="/oprema" className="text-brand-primary underline">Pregledaj opremu</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-card transition-shadow"
            >
              {post.hero_image_url ? (
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={post.hero_image_url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-brand-light" />
              )}
              <div className="p-5">
                <h2 className="font-display font-bold text-brand-text text-base leading-snug mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-brand-muted line-clamp-2 mb-3">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-brand-muted">
                  {post.published_at && (
                    <span>{format(new Date(post.published_at), "d. MMM yyyy", { locale: hr })}</span>
                  )}
                  {post.reading_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.reading_time} min čitanja
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </main>
  );
}
