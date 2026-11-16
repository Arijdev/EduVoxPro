import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certification Course Catalog | EduVoxPro",
  description:
    "Browse all EduVoxPro certification tracks. Comprehensive 7–10 module engineering curricula with 80% MCQ checkpoints and verifiable credentials. 2 completely free tracks available.",
  keywords: [
    "Certification Courses",
    "Tech Certification Tracks",
    "Web Development Certification",
    "AI Prompt Engineering Certification",
    "Agentic AI Developer",
    "Generative AI Specialist",
    "Full-Stack Architect",
  ],
  authors: [{ name: "EduVoxPro Team" }],
  openGraph: {
    title: "Certification Course Catalog | EduVoxPro",
    description:
      "Browse all certification tracks with verifiable credentials and free options.",
    url: "https://EduVoxPro.dev/courses",
    siteName: "EduVoxPro",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Certification Course Catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certification Course Catalog | EduVoxPro",
    description:
      "Browse all certification tracks with verifiable credentials and free options.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://EduVoxPro.dev/courses",
  },
};

