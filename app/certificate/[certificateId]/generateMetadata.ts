import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}): Promise<Metadata> {
  const { certificateId } = await params;

  return {
    title: `Certificate Verification | ${certificateId} | EduVortexPro`,
    description: `Verify professional credential ${certificateId} issued by EduVortexPro Institute of Technical Mastery.`,
    keywords: [
      "Certificate Verification",
      certificateId,
      "Verifiable Credential",
      "EduVortexPro",
    ],
    authors: [{ name: "EduVortexPro Team" }],
    openGraph: {
      title: `Certificate Verification | ${certificateId} | EduVortexPro`,
      description: `Verify professional credential ${certificateId} issued by EduVortexPro.`,
      url: `https://eduvortexpro.dev/certificate/${certificateId}`,
      siteName: "EduVortexPro",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Certificate ${certificateId}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Certificate Verification | ${certificateId} | EduVortexPro`,
      description: `Verify professional credential ${certificateId} issued by EduVortexPro.`,
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://eduvortexpro.dev/certificate/${certificateId}`,
    },
  };
}
