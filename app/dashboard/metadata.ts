import type { Metadata } from "next";
import { siteUrl, siteName } from "../metadata";

export const metadata: Metadata = {
  title: "Student Dashboard | EduVoxPro",
  description:
    "Your EduVoxPro student dashboard. Track enrolled courses, module progress, and verifiable certificates.",
  keywords: ["Student Dashboard", "My Courses", "Certificate Progress"],
  authors: [{ name: `${siteName} Team` }],
  openGraph: {
    title: "Student Dashboard | EduVoxPro",
    description:
      "Track enrolled courses, module progress, and verifiable certificates.",
    url: `${siteUrl}/dashboard`,
    siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Student Dashboard | EduVoxPro",
    description:
      "Track enrolled courses, module progress, and verifiable certificates.",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/dashboard",
  },
};