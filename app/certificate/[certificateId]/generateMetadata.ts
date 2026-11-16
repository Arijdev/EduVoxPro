import type { Metadata } from "next";

const siteUrl = "https://www.eduvoxpro.in";

function trim(str: string, max: number) {
  return str.length <= max ? str : `${str.slice(0, max - 1).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}): Promise<Metadata> {
  const { certificateId } = await params;
  const id = decodeURIComponent(certificateId || "").trim();
  const safeId = id || "Credential";
  const path = `/certificate/${encodeURIComponent(id)}`;
  const url = `${siteUrl}${path}`;

  const title = trim(`Verify Credential ${safeId} | EduVoxPro`, 60);
  const description = trim(
    `Verify EduVoxPro credential ${safeId}. View the official certificate, issue details, and validation status on www.eduvoxpro.in.`,
    160
  );

  return {
    title,
    description,
    keywords: [
      "certificate verification",
      safeId,
      "verifiable credential",
      "EduVoxPro",
      "engineering certification",
    ],
    authors: [{ name: "EduVoxPro" }],
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "EduVoxPro",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `EduVoxPro credential ${safeId}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}
