import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About EduVoxPro | Institute of Technical Mastery",
  description:
    "Learn about EduVoxPro, an education-first certification platform that replaces video fluff with high-density documentation, real code architectures, and an 80% MCQ progression gate. Earn verifiable, print-ready credentials.",
  keywords: [
    "About EduVoxPro",
    "Technical Mastery Institute",
    "Education First Certification",
    "Verifiable Credentials",
  ],
  authors: [{ name: "EduVoxPro Team" }],
  openGraph: {
    title: "About EduVoxPro | Institute of Technical Mastery",
    description:
      "Education-first tech certification platform with verifiable credentials and free tracks.",
    url: "https://EduVoxPro.dev/about",
    siteName: "EduVoxPro",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About EduVoxPro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About EduVoxPro | Institute of Technical Mastery",
    description:
      "Education-first tech certification platform with verifiable credentials.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://EduVoxPro.dev/about",
  },
};

