/**
 * Pick "related product" fallbacks for a product page from its category.
 *
 * The old fallback took the first N siblings by sort_order, so the same few
 * products at the top of every category received all the internal links and
 * products at the bottom received none. Taking the N siblings that follow the
 * product in category order, wrapping around, spreads the links evenly: every
 * product is linked from the N products before it.
 *
 * @param ordered  all active products of the category, in display order,
 *                 including the product itself
 * @param selfId   the product whose page is being rendered
 * @param exclude  ids already shown (curated relations) to skip
 * @param count    how many to return
 */
export function pickNeighbors<T extends { id: string }>(
  ordered: T[],
  selfId: string,
  exclude: ReadonlySet<string>,
  count: number
): T[] {
  if (count <= 0 || ordered.length === 0) return [];
  const start = Math.max(0, ordered.findIndex((p) => p.id === selfId));
  const picked: T[] = [];
  for (let step = 1; step <= ordered.length && picked.length < count; step++) {
    const candidate = ordered[(start + step) % ordered.length];
    if (candidate.id === selfId || exclude.has(candidate.id)) continue;
    picked.push(candidate);
  }
  return picked;
}
