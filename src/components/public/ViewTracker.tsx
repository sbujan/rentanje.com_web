"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/gtag";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  };
}

export default function ViewTracker({ product }: Props) {
  useEffect(() => {
    // Internal product-view counter.
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    }).catch(() => {});

    // GA4 ecommerce funnel.
    trackViewItem(product);
  }, [product]);

  return null;
}
