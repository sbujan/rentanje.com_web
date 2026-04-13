import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/upit", "/hvala", "/api/"],
      },
    ],
    sitemap: "https://rentanje.com/sitemap.xml",
  };
}
