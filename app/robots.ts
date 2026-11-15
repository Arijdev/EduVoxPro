import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/courses", "/contact", "/learn", "/certificate"],
      disallow: ["/dashboard", "/login", "/signup", "/api/", "/_next/"],
    },
    sitemap: "https://eduvortexpro.dev/sitemap.xml",
  };
}
