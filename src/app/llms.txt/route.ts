import { createPublicClient } from "@/lib/supabase/server";

export const revalidate = 3600;

const BASE = "https://rentanje.com";

export async function GET() {
  // Cookie-free anon client so `revalidate` actually applies (cookies() would
  // force this route dynamic). Categories have a public read RLS policy.
  const supabase = createPublicClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name, seo_description")
    .order("name");

  const categoryLines = (categories ?? [])
    .map((c) => {
      const raw = c.seo_description?.trim();
      const desc = raw && raw.length > 140 ? `${raw.slice(0, 137)}...` : raw;
      return desc
        ? `- [${c.name}](${BASE}/najam/${c.slug}): ${desc}`
        : `- [${c.name}](${BASE}/najam/${c.slug})`;
    })
    .join("\n");

  const body = `# Rentanje

> Croatian equipment rental — drones, cameras, sound systems, grills, camping gear, event equipment. Pickup or delivery across Croatia.

## Browse

- [Sva oprema](${BASE}/oprema): Complete rental catalog
- [Paketi](${BASE}/paketi): Curated experience bundles
- [Blog](${BASE}/blog): Rental guides and articles

## Categories

${categoryLines}

## Information

- [O nama](${BASE}/o-nama): About Rentanje
- [Kontakt](${BASE}/kontakt): Contact information
- [Upit / rezervacija](${BASE}/upit): Booking inquiry form
- [Uvjeti korištenja](${BASE}/uvjeti-koristenja): Terms of service
- [Uvjeti odgovornosti](${BASE}/uvjeti-odgovornosti): Liability terms
- [Privatnost](${BASE}/privatnost): Privacy policy
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
