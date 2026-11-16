import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}): Promise<Metadata> {
  const { certificateId } = await params;
  const id = decodeURIComponent(certificateId || "");

  return {
    title: `Certificate Verification | ${id} | EduVoxPro`,
    description: `Verify credential ${id} issued by EduVoxPro. View the official certificate and verification details.`,
    keywords: ["Certificate Verification", id, "Verifiable Credential", "EduVoxPro"],
    authors: [{ name: "EduVoxPro" }],
    openGraph: {
      title: `Certificate Verification | ${id} | EduVoxPro`,
      description: `Verify credential ${id} issued by EduVoxPro.`,
      url: `https://eduvoxpro.dev/certificate/${encodeURIComponent(id)}`,
      siteName: "EduVoxPro",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Certificate Verification | ${id} | EduVoxPro`,
      description: `Verify credential ${id} issued by EduVoxPro.`,
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://eduvoxpro.dev/certificate/${encodeURIComponent(id)}`,
    },
  };
}
