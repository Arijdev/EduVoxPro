import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Dashboard | EduVortexPro",
  description:
    "Your EduVortexPro student dashboard. Track enrolled courses, module progress, and verifiable certificates.",
  keywords: ["Student Dashboard", "My Courses", "Certificate Progress"],
  authors: [{ name: "EduVortexPro Team" }],
  openGraph: {
    title: "Student Dashboard | EduVortexPro",
    description:
      "Track enrolled courses, module progress, and verifiable certificates.",
    url: "https://eduvortexpro.dev/dashboard",
    siteName: "EduVortexPro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Student Dashboard | EduVortexPro",
    description:
      "Track enrolled courses, module progress, and verifiable certificates.",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://eduvortexpro.dev/dashboard",
  },
};
