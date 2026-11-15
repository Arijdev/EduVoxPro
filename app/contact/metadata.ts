import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact EduVortexPro | Support & Inquiries",
  description:
    "Get in touch with EduVortexPro. Questions about certification tracks, enrollment, UPI checkout, or verifying a credential? We respond within 24 hours.",
  keywords: [
    "Contact EduVortexPro",
    "Support",
    "Enrollment Questions",
    "Certificate Verification",
  ],
  authors: [{ name: "EduVortexPro Team" }],
  openGraph: {
    title: "Contact EduVortexPro | Support & Inquiries",
    description:
      "Get in touch with EduVortexPro support. We respond within 24 hours.",
    url: "https://eduvortexpro.dev/contact",
    siteName: "EduVortexPro",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact EduVortexPro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact EduVortexPro | Support & Inquiries",
    description:
      "Questions about certification tracks, enrollment, or verifying a credential?",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://eduvortexpro.dev/contact",
  },
};
