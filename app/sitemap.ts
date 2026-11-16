import type { MetadataRoute } from "next";
import { TRACKS } from "@/data/curriculum";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://EduVoxPro.dev";

  const staticRoutes = [
    "",
    "/about",
    "/courses",
    "/contact",
    "/dashboard",
    "/login",
    "/signup",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.7,
  }));

  const trackRoutes = TRACKS.map((track) => ({
    url: `${baseUrl}/learn/${track.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...trackRoutes];
}

