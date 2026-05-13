export const CATEGORY_IMAGES: Record<string, string> = {
  "audio-video-oprema": "/Projektor-s-platnom.jpg",
  "oprema-za-evente": "/Druzenje-na-otvorenom.jpg",
  "rostilj-kuhanje": "/Kulinarski-dozivljaj.jpg",
  "kamp-outdoor": "/sator-za-kampiranje-mh100-fresh-black-za-tri-osobe-2.avif",
  "alati-ciscenje": "/kercher%20puzzi.jpg",
  "ostalo": "/Hiluckey-solarni-Powerbank-25000mAh.jpg",
};

export function getCategoryImage(slug: string): string | undefined {
  return CATEGORY_IMAGES[slug];
}

export function getCategoryImageUrl(slug: string): string | undefined {
  const path = CATEGORY_IMAGES[slug];
  return path ? `https://rentanje.com${path}` : undefined;
}
