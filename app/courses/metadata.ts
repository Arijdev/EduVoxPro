import type { Metadata } from "next";
import { siteUrl, siteName } from "../metadata";

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
  authors: [{ name: `${siteName} Team` }],
  openGraph: {
    title: "Certification Course Catalog | EduVoxPro",
    description:
      "Browse all certification tracks with verifiable credentials and free options.",
    url: `${siteUrl}/courses`,
    siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Certification Course Catalog | EduVoxPro",
    description:
      "Browse all certification tracks with verifiable credentials and free options.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/courses",
  },
};