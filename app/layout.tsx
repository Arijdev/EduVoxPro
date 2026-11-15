import type { Metadata } from "next";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { CheckoutModal } from "@/components/CheckoutModal";

export const metadata: Metadata = {
  title: "EduVortexPro | Deep Tech Mastery & Verifiable Certifications",
  description: "Comprehensive 7-10 module tech certification tracks with 2 completely free tracks. High-density documentation, code architectures, 80% MCQ checkpoints, and verifiable credentials.",
  keywords: [
    "Tech Certifications",
    "Agentic AI Developer",
    "Generative AI Specialist",
    "Full-Stack Architect",
    "Free Web Development Certification",
    "AI Prompt Engineering & Ethics",
    "EduVortexPro"
  ],
  authors: [{ name: "EduVortexPro Team" }],
  openGraph: {
    title: "EduVortexPro | High-Impact Tech Certifications",
    description: "Deep, education-first technical certifications with 2 completely free tracks. Verified on Supabase.",
    url: "https://eduvortexpro.dev",
    siteName: "EduVortexPro",
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
    <html lang="en">
      <body className="bg-background text-slate-900 min-h-screen flex flex-col selection:bg-accent-indigo/15 selection:text-accent-indigo antialiased">
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
