"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TRACKS } from "@/data/curriculum";
import { TrackCard } from "@/components/TrackCard";
import { 
  Award, 
  ArrowRight, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  Gift,
  BookOpen,
  Code2,
  GraduationCap
} from "lucide-react";

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "free" | "paid">("all");

  const filteredTracks = TRACKS.filter((track) => {
    if (selectedFilter === "free") return track.isFree;
    if (selectedFilter === "paid") return !track.isFree;
    return true;
  });

  // schema.org JSON-LD Structured Data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "name": "EduVortexPro",
        "url": "https://eduvortexpro.dev",
        "description": "High-impact, education-first tech certification platform."
      },
      ...TRACKS.map((track) => ({
        "@type": "Course",
        "name": track.title,
        "description": track.description,
        "provider": { "@type": "Organization", "name": "EduVortexPro" },
        "offers": {
          "@type": "Offer",
          "price": track.isFree ? "0" : track.priceINR.toString(),
          "priceCurrency": "INR",
        },
        "educationalCredentialAwarded": {
          "@type": "EducationalOccupationalCredential",
          "name": `${track.title} Certificate of Mastery`,
          "credentialCategory": "Certificate",
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "Online",
          "courseWorkload": `PT${track.estimatedHours}H`
        }
      }))
    ]
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* ─── Hero Section ─── */}
      <section className="relative pt-10 sm:pt-14 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Ambient glow (very subtle on light bg — anchors top per 60-30-10) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] bg-gradient-to-tr from-indigo-100/30 via-sky-50/20 to-emerald-100/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.1] mb-4">
          Deep Technical Mastery &{" "}
          <span className="bg-gradient-to-r from-accent-indigo via-accent-cyan to-accent-emerald bg-clip-text text-transparent">
            Verifiable Credentials
          </span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Comprehensive 7–10 module engineering curricula. Zero video fluff. High-density
          documentation, architectural schematics, code patterns, and an 80% MCQ gate.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/courses"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Browse All Tracks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              setSelectedFilter("free");
              const el = document.getElementById("catalog");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            <span>View Free Tracks</span>
          </button>
        </div>
      </section>

      {/* ─── Metrics Strip ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center shadow-card">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-accent-emerald font-mono">2 FREE</div>
            <div className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">Tracks & Free Certs</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">44 Total</div>
            <div className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">Deep Modules</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-accent-cyan font-mono">80% Gate</div>
            <div className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">5 MCQs Per Module</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-accent-indigo font-mono">Print</div>
            <div className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">Verifiable Credentials</div>
          </div>
        </div>
      </section>

      {/* ─── Track Catalog Section ─── */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent-indigo text-xs font-mono uppercase tracking-wider font-bold">
              <Award className="w-4 h-4" />
              <span>CURRICULUM ARCHITECTURE CATALOG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Select Your Tech Certification Track
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Comprehensive 7–10 module courses with mandatory 80% MCQ checkpoints and verifiable certificates.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto text-xs font-medium">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                selectedFilter === "all"
                  ? "bg-white text-slate-900 font-bold shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Tracks ({TRACKS.length})
            </button>
            <button
              onClick={() => setSelectedFilter("free")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                selectedFilter === "free"
                  ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-sm"
                  : "text-slate-500 hover:text-emerald-700"
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Free Certifications (2)</span>
            </button>
            <button
              onClick={() => setSelectedFilter("paid")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                selectedFilter === "paid"
                  ? "bg-white text-slate-900 font-bold shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Professional Tracks (3)
            </button>
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      {/* ─── Free Tracks Spotlight Banner ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-card">
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800">
              DEMOCRATIZING TECH MASTERY
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              100% Free Coursework. 100% Free Verifiable Certificates.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We believe foundational web engineering and ethical AI literacy should be accessible to
              all developers worldwide. Both <strong>Foundations of Modern Web Technologies</strong> (8
              modules) and <strong>AI Prompt Engineering & Ethics</strong> (7 modules) bypass payment
              entirely and issue permanent verifiable certificates upon passing the 80% threshold.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/learn/foundations-of-modern-web-technologies"
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-accent-emerald to-teal-500 text-white font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-200"
            >
              Enroll Free: Web Technologies
            </Link>
            <Link
              href="/learn/ai-prompt-engineering-ethics"
              className="py-3 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
            >
              Enroll Free: AI Ethics
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono uppercase text-accent-cyan font-bold tracking-wider">
            STEP-BY-STEP FLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            From Deep Study to Verifiable Industry Proof
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            A structured, distraction-free learning pipeline designed around developer efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              color: "bg-indigo-50 border-indigo-200 text-accent-indigo",
              title: "Select Certification",
              body: "Target a specific career role like Autonomous Agent Engineer, Prompt Specialist, or Systems Architect.",
            },
            {
              step: "02",
              color: "bg-emerald-50 border-emerald-200 text-accent-emerald",
              title: "Instant Enrollment",
              body: "Free tracks enroll instantly with zero fee. Professional tracks feature transparent direct UPI checkout (₹79–₹99).",
            },
            {
              step: "03",
              color: "bg-sky-50 border-sky-200 text-accent-cyan",
              title: "80% MCQ Progression Gate",
              body: "Every single module features 5 deep questions with explanations. Scoring 80%+ is required to unlock the next chapter.",
            },
            {
              step: "04",
              color: "bg-purple-50 border-purple-200 text-purple-700",
              title: "Verifiable Certificate",
              body: "Receive a print-ready landscape certificate featuring a unique Verification ID, verification QR code, and LinkedIn sharing.",
            },
          ].map(({ step, color, title, body }) => (
            <div key={step} className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-card hover:shadow-card-hover transition-shadow">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-bold ${color}`}>
                {step}
              </div>
              <h4 className="text-base font-bold text-slate-900">{title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
