import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EduVoxPro | Deep Tech Mastery & Verifiable Certifications",
  description:
    "Comprehensive 7â€“10 module tech certification tracks with 2 completely free tracks. High-density documentation, code architectures, 80% MCQ checkpoints, and verifiable credentials. Free Web Development and AI Prompt Engineering certifications.",
  keywords: [
    "Tech Certifications",
    "Agentic AI Developer",
    "Generative AI Specialist",
    "Full-Stack Architect",
    "Free Web Development Certification",
    "AI Prompt Engineering & Ethics",
    "EduVoxPro",
    "Verifiable Certificates",
  ],
  authors: [{ name: "EduVoxPro Team" }],
  openGraph: {
    title: "EduVoxPro | High-Impact Tech Certifications",
    description:
      "Deep, education-first technical certifications with 2 completely free tracks. Verified on Supabase.",
    url: "https://EduVoxPro.dev",
    siteName: "EduVoxPro",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EduVoxPro - Deep Technical Mastery & Verifiable Certifications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduVoxPro | Deep Tech Mastery & Verifiable Certifications",
    description:
      "Comprehensive 7â€“10 module tech certification tracks with 2 completely free tracks.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://EduVoxPro.dev/",
  },
};

