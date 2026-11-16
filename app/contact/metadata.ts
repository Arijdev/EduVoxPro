import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact EduVoxPro | Support & Inquiries",
  description:
    "Get in touch with EduVoxPro. Questions about certification tracks, enrollment, UPI checkout, or verifying a credential? We respond within 24 hours.",
  keywords: [
    "Contact EduVoxPro",
    "Support",
    "Enrollment Questions",
    "Certificate Verification",
  ],
  authors: [{ name: "EduVoxPro Team" }],
  openGraph: {
    title: "Contact EduVoxPro | Support & Inquiries",
    description:
      "Get in touch with EduVoxPro support. We respond within 24 hours.",
    url: "https://EduVoxPro.dev/contact",
    siteName: "EduVoxPro",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact EduVoxPro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact EduVoxPro | Support & Inquiries",
    description:
      "Questions about certification tracks, enrollment, or verifying a credential?",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://EduVoxPro.dev/contact",
  },
};

