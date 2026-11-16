import type { MetadataRoute } from "next";
import { TRACKS } from "@/data/curriculum";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eduvoxpro.dev";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/courses`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];

  const trackRoutes: MetadataRoute.Sitemap = TRACKS.map((track) => ({
    url: `${baseUrl}/learn/${track.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...trackRoutes];
}

