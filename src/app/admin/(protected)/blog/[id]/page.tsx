import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlogForm from "../BlogForm";

interface Props {
  params: { id: string };
}

export default async function EditBlogPostPage({ params }: Props) {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!post) notFound();

  return (
    <BlogForm
      initial={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content ?? "",
        hero_image_url: post.hero_image_url ?? "",
        author: post.author,
        is_published: post.is_published,
        reading_time: post.reading_time,
        seo_title: post.seo_title ?? "",
        seo_description: post.seo_description ?? "",
        faq: (post as any).faq ?? [],
      }}
    />
  );
}
