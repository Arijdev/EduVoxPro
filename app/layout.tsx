import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { siteUrl, siteName, siteTitle, siteDescription } from "./metadata";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "engineering certifications",
    "verifiable credentials",
    "agentic AI certification",
    "full-stack developer certification",
    "free web development course",
    "AI prompt engineering course",
    "EduVoxPro",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description:
      "Master production engineering with structured tracks, 80%+ assessments, and instantly verifiable certificates.",
    url: siteUrl,
    siteName,
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
  name: siteName,
  alternateName: "EduVoxPro Institute of Technical Mastery",
  url: siteUrl,
  logo: `${siteUrl}/eduvoxpro-logo.svg`,
  description:
    "EduVoxPro delivers structured engineering certification tracks with rigorous assessments and verifiable credentials.",
  sameAs: [siteUrl, "https://eduboxpro.in"],
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


