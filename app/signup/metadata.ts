import type { Metadata } from "next";
import { siteUrl, siteName } from "../metadata";

export const metadata: Metadata = {
  title: "Create Account | EduVoxPro",
  description:
    "Join EduVoxPro. Access 2 completely free tracks and professional certifications with verifiable credentials.",
  keywords: ["Sign Up", "Create Account", "EduVoxPro", "Free Certification"],
  authors: [{ name: `${siteName} Team` }],
  openGraph: {
    title: "Create Account | EduVoxPro",
    description:
      "Join EduVoxPro. Access 2 completely free tracks and professional certifications.",
    url: `${siteUrl}/signup`,
    siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Create Account | EduVoxPro",
    description:
      "Join EduVoxPro. Access 2 completely free tracks and professional certifications.",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/signup",
  },
};