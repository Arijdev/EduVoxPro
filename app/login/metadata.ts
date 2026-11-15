import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | EduVortexPro",
  description:
    "Sign in to your EduVortexPro account. Access your courses, progression checkpoints, and verifiable certificates.",
  keywords: ["Login", "Sign In", "EduVortexPro Account"],
  authors: [{ name: "EduVortexPro Team" }],
  openGraph: {
    title: "Sign In | EduVortexPro",
    description: "Access your courses, progression checkpoints, and certificates.",
    url: "https://eduvortexpro.dev/login",
    siteName: "EduVortexPro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign In | EduVortexPro",
    description:
      "Access your courses, progression checkpoints, and certificates.",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://eduvortexpro.dev/login",
  },
};
