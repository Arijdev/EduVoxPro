import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | EduVoxPro",
  description:
    "Sign in to your EduVoxPro account. Access your courses, progression checkpoints, and verifiable certificates.",
  keywords: ["Login", "Sign In", "EduVoxPro Account"],
  authors: [{ name: "EduVoxPro Team" }],
  openGraph: {
    title: "Sign In | EduVoxPro",
    description: "Access your courses, progression checkpoints, and certificates.",
    url: "https://EduVoxPro.dev/login",
    siteName: "EduVoxPro",
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
    canonical: "https://EduVoxPro.dev/login",
  },
};

