/**
 * Which products represent a category in the homepage category boxes.
 *
 * Each box shows up to three product photos: the first is the large one. The
 * picks are the products people recognise the category by, not simply the
 * first in admin order (for games that would be two water pistols).
 * A product that is inactive or has no photo is skipped, and the box is
 * topped up from the category's featured products, then the rest in order,
 * so a box never ends up empty because a pick was switched off.
 */
export const CATEGORY_SHOWCASE_PRODUCT_IDS: Record<string, string[]> = {
  "kamere-i-dronovi": [
    "77780245-5e25-413a-8526-9c522fb9c998", // gopro-hero-13-black-najam
    "34eae4aa-b521-4b8c-a701-7d825219c01f", // dji-mini-2-dron-fly-more-najam
    "6a8d2c0d-7466-410d-8f4e-779021cf6b67", // insta360-x5-360-kamera-najam
  ],
  "audio-video-oprema": [
    "8bf63234-375e-41f5-8f7d-d9421620fe5c", // jbl-partybox-stage-320-prijenosni-party-zvucnik-s-kotacima
    "aa60bbe0-242d-4cf8-b82d-17610675f16a", // epson-eb-fh52-profesionalni-projektor-najam
    "f6abe189-594a-4836-8a9f-b057dbd31c85", // jbl-bezicni-mikrofoni-par-najam
  ],
  "igre-na-otvorenom": [
    "1b0dd6c2-78e3-41c9-b6f6-e9ef3245a376", // cornhole-igra-najam
    "084b1529-a760-49ce-9b64-1280c48f02bb", // velika-jenga-giant-jenga-igra-najam
    "ae8d85ef-eab5-4317-8f23-a2ea32a38601", // beer-pong-stol-case-najam
  ],
  "aparati-za-hranu-i-pice": [
    "4ea8cc9d-09c4-48b1-9f6e-1faecf9e6540", // aparat-za-kokice-s-kolicima-vevor-najam
    "86c076d0-b93f-4919-b02b-926d6760ce78", // ledomat-aparat-za-led-najam
    "aeb82f4f-e482-4cce-ad2d-3804ae0184f2", // tocionik-za-pivu-5l-najam
  ],
  "oprema-za-evente": [
    "7759b345-c53a-4d2d-a8c9-ffa39b36a59a", // prijenosni-ratan-stol-klupe-8-osoba-najam
    "8fecf552-235d-4664-a04c-2aed37b7f093", // paviljon-sator-3x3m-najam
    "04a6c46e-4efd-4010-9501-826761d421fe", // blumfeldt-dark-wave-infracrvena-grijalica-najam
  ],
  "rostilj-kuhanje": [
    "6a028c8b-9986-4695-b830-b4c3f5727e5c", // ooni-koda-16-plinska-pec-pizza-najam
    "0fec688a-5289-4226-811b-c9c7b0565d8d", // kotlovina-73cm-najam
    "9a295c15-4b46-4f52-9e30-15f973aec6b1", // weber-traveler-prijenosni-plinski-rostilj-najam
  ],
  "kamp-outdoor": [
    "072fb062-c844-421b-9f69-ce7a647d5813", // sator-za-kampiranje-za-4-osobe-madraci-pumpa-najam
    "c1805402-8ada-4f40-9051-77f92b8a3c8c", // solo-stove-bonfire-firepit-najam
    "9ae06c1b-9817-4857-85aa-9e3dffba7364", // sup-stand-up-paddle-najam
  ],
  "alati-ciscenje": [
    "bb36f85a-4f87-4981-9074-ae9ba57e4ce8", // karcher-puzzi-mokro-suhi-usisavac-najam
  ],
};

export const SHOWCASE_SIZE = 3;

interface ShowcaseCandidate {
  id: string;
  hero_image_url: string | null;
  is_featured: boolean;
}

/**
 * Up to `max` products with a photo for a category box: configured picks
 * first (in config order), then featured ones, then the rest in the given
 * order. `products` are the category's active products.
 */
export function pickShowcaseProducts<T extends ShowcaseCandidate>(
  categorySlug: string,
  products: T[],
  max: number = SHOWCASE_SIZE
): T[] {
  const withPhoto = products.filter((p) => Boolean(p.hero_image_url));
  const byId = new Map(withPhoto.map((p) => [p.id, p]));
  const picked: T[] = [];
  const seen = new Set<string>();
  const take = (p: T | undefined) => {
    if (p && !seen.has(p.id) && picked.length < max) {
      seen.add(p.id);
      picked.push(p);
    }
  };
  for (const id of CATEGORY_SHOWCASE_PRODUCT_IDS[categorySlug] ?? []) take(byId.get(id));
  for (const p of withPhoto) if (p.is_featured) take(p);
  for (const p of withPhoto) take(p);
  return picked;
}
