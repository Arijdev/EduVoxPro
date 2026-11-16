import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { CheckoutModal } from "@/components/CheckoutModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://eduvoxpro.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EduVoxPro | Engineering Certifications & Verifiable Credentials",
    template: "%s | EduVoxPro",
  },
  description:
    "Structured 7–10 module engineering certification tracks with rigorous 80% assessments and verifiable credentials. Includes free tracks in web and AI foundations.",
  keywords: [
    "engineering certifications",
    "verifiable credentials",
    "agentic AI certification",
    "full-stack developer certification",
    "free web development course",
    "AI prompt engineering course",
    "EduVoxPro",
  ],
  authors: [{ name: "EduVoxPro" }],
  creator: "EduVoxPro",
  publisher: "EduVoxPro",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EduVoxPro | Engineering Certifications & Verifiable Credentials",
    description:
      "Master production engineering with structured tracks, 80%+ assessments, and instantly verifiable certificates.",
    url: siteUrl,
    siteName: "EduVoxPro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduVoxPro | Engineering Certifications & Credentials",
    description:
      "Structured engineering tracks with rigorous assessments and verifiable certificates from EduVoxPro.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "education",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "EduVoxPro",
  alternateName: "EduVoxPro Institute of Technical Mastery",
  url: siteUrl,
  logo: `${siteUrl}/eduvoxpro-logo.svg`,
  description:
    "EduVoxPro delivers structured engineering certification tracks with rigorous assessments and verifiable credentials.",
  sameAs: ["https://eduvoxpro.dev", "https://eduboxpro.in"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@eduvoxpro.dev",
      availableLanguage: ["en"],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="academic"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-canvas text-ink min-h-screen flex flex-col selection:bg-accent/15 selection:text-accent antialiased"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AppContextProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AuthModal />
          <CheckoutModal />
        </AppContextProvider>
      </body>
    </html>
  );
}


