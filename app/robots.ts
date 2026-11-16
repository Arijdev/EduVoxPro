import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://eduvoxpro.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/courses", "/contact", "/learn/", "/certificate/"],
        disallow: ["/dashboard", "/login", "/signup", "/checkout/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

