"use client";

import { useEffect } from "react";
import { trackBlogRead } from "@/lib/gtag";

interface Props {
  slug: string;
  readingTime?: number | null;
}

// Fires a GA4 `blog_read` event when a blog post page mounts.
export default function BlogReadTracker({ slug, readingTime }: Props) {
  useEffect(() => {
    trackBlogRead(slug, readingTime);
  }, [slug, readingTime]);

  return null;
}
