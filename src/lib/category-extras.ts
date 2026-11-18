/**
 * Products a category shows besides the ones whose primary category it is.
 *
 * A product has one primary category (products.category_id): it drives the
 * breadcrumb, the related products and the redirect of a deactivated product.
 * Some products belong in a second category from the visitor's point of view,
 * e.g. GoPro cameras under "Audio i video oprema", where they lived before
 * "Kamere i dronovi" existed. They are listed here by id, in display order.
 *
 * Kept in code like the brand hubs (src/lib/landing-pages.ts): a handful of
 * entries, no admin screen needed. Move to a join table if it grows.
 */
const GOPRO_13 = "77780245-5e25-413a-8526-9c522fb9c998"; // gopro-hero-13-black-najam
const GOPRO_10 = "dd891356-359f-480f-9601-fd612fe41247"; // gopro-hero-10-black-kamera-najam

export const CATEGORY_EXTRA_PRODUCT_IDS: Record<string, string[]> = {
  "audio-video-oprema": [GOPRO_13, GOPRO_10],
};

export function extraProductIdsForCategory(categorySlug: string): string[] {
  return CATEGORY_EXTRA_PRODUCT_IDS[categorySlug] ?? [];
}

/**
 * Category's own products followed by its extras in config order, skipping
 * extras that are missing (inactive) or already present.
 */
export function withExtraProducts<T extends { id: string }>(own: T[], extras: T[], extraIds: string[]): T[] {
  const seen = new Set(own.map((p) => p.id));
  const byId = new Map(extras.map((p) => [p.id, p]));
  const added: T[] = [];
  for (const id of extraIds) {
    const p = byId.get(id);
    if (p && !seen.has(id)) {
      seen.add(id);
      added.push(p);
    }
  }
  return [...own, ...added];
}
