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

export const metadata: Metadata = {
  title: "EduVoxPro | Deep Tech Mastery & Verifiable Certifications",
  description: "Comprehensive 7-10 module tech certification tracks with 2 completely free tracks. High-density documentation, code architectures, 80% MCQ checkpoints, and verifiable credentials.",
  keywords: [
    "Tech Certifications",
    "Agentic AI Developer",
    "Generative AI Specialist",
    "Full-Stack Architect",
    "Free Web Development Certification",
    "AI Prompt Engineering & Ethics",
    "EduVoxPro"
  ],
  authors: [{ name: "EduVoxPro Team" }],
  openGraph: {
    title: "EduVoxPro | High-Impact Tech Certifications",
    description: "Deep, education-first technical certifications with 2 completely free tracks. Verified on Supabase.",
    url: "https://eduvoxpro.dev",
    siteName: "EduVoxPro",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="academic" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-canvas text-ink min-h-screen flex flex-col selection:bg-accent/15 selection:text-accent antialiased">
        <AppContextProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <AuthModal />
          <CheckoutModal />
        </AppContextProvider>
      </body>
    </html>
  );
}


