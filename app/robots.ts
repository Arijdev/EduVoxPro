import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.eduvoxpro.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/courses", "/contact", "/learn/", "/certificate/"],
        disallow: ["/dashboard", "/login", "/signup", "/checkout/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: "www.eduvoxpro.in",
  };
}

