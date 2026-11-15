import type { Metadata } from "next";
import { TRACKS } from "@/data/curriculum";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trackId: string }>;
}): Promise<Metadata> {
  const { trackId } = await params;
  const track = TRACKS.find(
    (t) => t.slug === trackId || t.id === trackId
  );

  if (!track) {
    return {
      title: "Track Not Found | EduVortexPro",
      description: "The certification track you requested does not exist.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${track.title} | EduVortexPro`,
    description: track.description,
    keywords: [
      track.title,
      track.roleBadge,
      "Certification Track",
      "Technical Mastery",
      "Verifiable Certificate",
    ],
    authors: [{ name: "EduVortexPro Team" }],
    openGraph: {
      title: `${track.title} | EduVortexPro`,
      description: track.description,
      url: `https://eduvortexpro.dev/learn/${track.slug}`,
      siteName: "EduVortexPro",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: track.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${track.title} | EduVortexPro`,
      description: track.description,
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://eduvortexpro.dev/learn/${track.slug}`,
    },
  };
}
