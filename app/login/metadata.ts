import type { Metadata } from "next";
import { siteUrl, siteName } from "../metadata";

export const metadata: Metadata = {
  title: "Sign In | EduVoxPro",
  description:
    "Sign in to your EduVoxPro account. Access your courses, progression checkpoints, and verifiable certificates.",
  keywords: ["Login", "Sign In", "EduVoxPro Account"],
  authors: [{ name: `${siteName} Team` }],
  openGraph: {
    title: "Sign In | EduVoxPro",
    description: "Access your courses, progression checkpoints, and certificates.",
    url: `${siteUrl}/login`,
    siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign In | EduVoxPro",
    description:
      "Access your courses, progression checkpoints, and certificates.",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/login",
  },
};