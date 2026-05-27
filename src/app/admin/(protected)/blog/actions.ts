"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, NotAuthorizedError } from "@/lib/admin-auth";
import type { FaqItem } from "@/components/admin/FaqEditor";

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const blogPayloadSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().nullable(),
  content: z.string().nullable(),
  hero_image_url: z.string().nullable(),
  author: z.string(),
  reading_time: z.number().int().nullable(),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
  faq: z.array(faqItemSchema),
  is_published: z.boolean(),
  // ISO string when publishing; null on save-draft for new posts.
  published_at: z.string().nullable().optional(),
});

const saveInputSchema = z.object({
  postId: z.string().uuid().optional(),
  payload: blogPayloadSchema,
});

export type SaveBlogPostInput = z.infer<typeof saveInputSchema>;
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

function revalidateBlogPaths(slug?: string | null) {
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function saveBlogPost(
  input: SaveBlogPostInput
): Promise<ActionResult<{ id: string; slug: string }>> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin());
  } catch (e) {
    if (e instanceof NotAuthorizedError) return { ok: false, error: "Niste ovlašteni." };
    throw e;
  }

  const parsed = saveInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Neispravni podaci: " + parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const { postId, payload } = parsed.data;
  const isEdit = !!postId;

  let id: string;
  let previousSlug: string | null = null;

  if (isEdit) {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("id", postId!)
      .maybeSingle();
    previousSlug = existing?.slug ?? null;

    const { error } = await supabase
      .from("blog_posts")
      .update(payload)
      .eq("id", postId!);
    if (error) return { ok: false, error: error.message };
    id = postId!;
  } else {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    id = data.id;
  }

  if (previousSlug && previousSlug !== payload.slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
  revalidateBlogPaths(payload.slug);

  return { ok: true, data: { id, slug: payload.slug } };
}

const deleteInputSchema = z.object({
  postId: z.string().uuid(),
});

export async function deleteBlogPost(input: z.infer<typeof deleteInputSchema>): Promise<ActionResult> {
  let supabase;
  try {
    ({ supabase } = await requireAdmin(["owner", "manager"]));
  } catch (e) {
    if (e instanceof NotAuthorizedError) return { ok: false, error: "Niste ovlašteni." };
    throw e;
  }

  const parsed = deleteInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Neispravni ID." };

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("id", parsed.data.postId)
    .maybeSingle();

  const { error } = await supabase.from("blog_posts").delete().eq("id", parsed.data.postId);
  if (error) return { ok: false, error: error.message };

  revalidateBlogPaths(existing?.slug ?? null);
  return { ok: true, data: undefined };
}

export type { FaqItem };
