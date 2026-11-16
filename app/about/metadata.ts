import type { Metadata } from "next";
import { siteUrl, siteName } from "../metadata";

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
  authors: [{ name: `${siteName} Team` }],
  openGraph: {
    title: "About EduVoxPro | Institute of Technical Mastery",
    description:
      "Education-first tech certification platform with verifiable credentials and free tracks.",
    url: `${siteUrl}/about`,
    siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About EduVoxPro | Institute of Technical Mastery",
    description:
      "Education-first tech certification platform with verifiable credentials.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/about",
  },
};