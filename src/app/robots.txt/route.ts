const BODY = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /upit
Disallow: /hvala
Disallow: /api/
Content-Signal: ai-train=yes, search=yes, ai-input=yes

Sitemap: https://rentanje.com/sitemap.xml
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
