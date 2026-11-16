"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TRACKS } from "@/data/curriculum";
import { TrackCard } from "@/components/TrackCard";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  FileCheck,
} from "lucide-react";

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "free" | "paid">("all");

  const filteredTracks = TRACKS.filter((track) => {
    if (selectedFilter === "free") return track.isFree;
    if (selectedFilter === "paid") return !track.isFree;
    return true;
  });

  const scrollToCatalog = (filter: "all" | "free" | "paid") => {
    setSelectedFilter(filter);
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        name: "EduVoxPro",
        url: "https://eduvoxpro.dev",
        description: "Structured engineering certification tracks with rigorous assessments and verifiable credentials.",
      },
      ...TRACKS.map((track) => ({
        "@type": "Course",
        name: track.title,
        description: track.description,
        provider: { "@type": "Organization", name: "EduVoxPro" },
        offers: {
          "@type": "Offer",
          price: track.isFree ? "0" : track.priceINR.toString(),
          priceCurrency: "INR",
        },
        educationalCredentialAwarded: {
          "@type": "EducationalOccupationalCredential",
          name: `${track.title} Certificate of Mastery`,
          credentialCategory: "Certificate",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseWorkload: `PT${track.estimatedHours}H`,
        },
      })),
    ],
  };

  return (
    <div className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* â”€â”€â”€ Hero (asymmetric 60/40) â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: 60% copy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center border border-border bg-surface px-3 py-1.5">
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-muted">
                Verified Engineering Tracks • Self-Paced
              </span>
            </div>

            <div className="space-y-5 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-tight text-ink leading-[1.08] max-w-2xl break-words">
                Master Production Engineering. Earn Verifiable Credentials.
              </h1>
              <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl">
                Structured 7–10 module curricula with high-density documentation and architectural patterns.
                Progress is earned through rigorous 80%+ MCQ assessments—no video fluff.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() => scrollToCatalog("all")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-contrast text-sm font-semibold border border-accent hover:bg-accent-hover hover:border-accent-hover transition-colors"
              >
                Explore Certification Tracks
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToCatalog("free")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface text-ink text-sm font-semibold border border-border hover:border-border-strong transition-colors"
              >
                Try a Free Track
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-muted border-t border-border">
              <div className="flex items-center gap-2 pt-5">
                <BookOpen className="w-4 h-4 text-ink-subtle" />
                <span><span className="font-mono text-ink">44</span> Structured Modules</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border mt-5" aria-hidden />
              <div className="flex items-center gap-2 pt-5">
                <FileCheck className="w-4 h-4 text-ink-subtle" />
                <span><span className="font-mono text-ink">80%</span> Pass Threshold</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border mt-5" aria-hidden />
              <div className="flex items-center gap-2 pt-5">
                <ShieldCheck className="w-4 h-4 text-ink-subtle" />
                <span>Instant Cryptographic Verification</span>
              </div>
            </div>
          </div>

          {/* Right: 40% visual proof â€” proper certificate format */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-surface p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-subtle">Credential Preview</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-success border border-success/30 bg-success-soft px-2 py-0.5">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="relative aspect-[1.414/1] w-full border border-[#D6C48A] bg-[#FFFEFA] text-[#1C1917] overflow-hidden">
                <div className="absolute inset-[8px] border border-[#E7D9A8] pointer-events-none" />
                <div className="absolute inset-[14px] border border-dashed border-[#EADFAF] pointer-events-none" />

                <div className="relative h-full flex flex-col px-6 py-5 text-center">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-left">
                      <Image src="/eduvoxpro-mark.svg" alt="EduVoxPro" width={26} height={26} className="w-[26px] h-[26px] shrink-0" />
                      <div className="leading-[1.2]">
                        <div className="text-[11px] font-semibold tracking-tight text-[#0F172A]">EduVox<span className="text-[#1D4ED8]">Pro</span></div>
                        <div className="text-[6px] font-mono uppercase tracking-[0.14em] text-[#64748B] mt-px">Institute of Technical Mastery</div>
                      </div>
                    </div>
                    <span className="text-[6px] font-mono uppercase tracking-[0.12em] text-[#334155] border border-[#CBD5E1] bg-white/70 px-2 py-1 leading-none shrink-0">Verifiable Credential</span>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-[15px] font-semibold tracking-[0.18em] uppercase text-[#0F172A] leading-none">Certificate of Mastery</h3>
                  </div>

                  {/* Body */}
                  <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-2">
                    <p className="text-[7px] uppercase tracking-[0.14em] text-[#64748B] leading-none">This is to certify that</p>
                    <p className="mt-2 text-[22px] font-semibold tracking-tight text-[#0F172A] underline decoration-[#C7D2FE] underline-offset-4 decoration-[1.5px] leading-none">Alex Rivera</p>
                    <p className="mt-2.5 text-[7px] text-[#475569] leading-[1.6] max-w-[88%]">has successfully completed the curriculum and met the 80% assessment requirement for</p>
                    <p className="mt-2 text-[10px] font-semibold text-[#0F172A] border border-[#E2E8F0] bg-white/70 px-3 py-1.5 leading-none">Agentic AI Systems Architect</p>
                  </div>

                  <p className="text-[6px] text-[#64748B] font-mono leading-none pb-2 shrink-0">Modules: 10/10&nbsp;&nbsp;•&nbsp;&nbsp;Score: 94%&nbsp;&nbsp;•&nbsp;&nbsp;Issued: Nov 16, 2026</p>

                  {/* Footer */}
                  <div className="grid grid-cols-3 items-end gap-3 pt-2.5 border-t border-[#E2E8F0] shrink-0">
                    <div className="text-left">
                      <div className="w-[115px] border-b border-[#CBD5E1] pb-1 mb-1.5">
                        <Image src="/signature-arij.svg" alt="Arij signature" width={115} height={28} className="h-[20px] w-auto" />
                      </div>
                      <div className="text-[6.5px] font-mono uppercase tracking-[0.06em] text-[#334155] leading-[1.3]">Arij Chowdhury</div>
                      <div className="text-[5.5px] text-[#64748B] leading-[1.4] mt-0.5">Founder &amp; Program Director</div>
                      <div className="text-[5px] text-[#94A3B8] leading-[1.3] mt-px">EduVoxPro</div>
                    </div>

                    <div className="flex flex-col items-center justify-end pb-0.5">
                      <div className="w-7 h-7 rounded-full border border-[#D6C48A] bg-[#FFFDF5] flex items-center justify-center mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" />
                      </div>
                      <div className="text-[5.5px] font-mono uppercase tracking-[0.1em] text-[#64748B] leading-none">Verified</div>
                    </div>

                    <div className="flex flex-col items-end justify-end text-right pb-0.5">
                      <div className="p-[2px] bg-white border border-[#E2E8F0] mb-1">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=https://eduvoxpro.dev/certificate/EDV-2026-AIA-8F3K2Q" alt="Verification QR" className="w-[30px] h-[30px] block" />
                      </div>
                      <div className="text-[5px] font-mono text-[#334155] leading-none">ID: EDV-2026-AIA-8F3K2Q</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ Track Catalog Section â”€â”€â”€ */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-subtle">Curriculum Catalog</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Certification Tracks
            </h2>
            <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
              7â€“10 module tracks with mandatory 80% MCQ checkpoints and verifiable certificates on completion.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3.5 py-2 text-sm border transition-colors ${
                selectedFilter === "all"
                  ? "bg-ink text-white border-ink"
                  : "bg-surface text-ink-muted border-border hover:border-border-strong hover:text-ink"
              }`}
            >
              All <span className="font-mono">({TRACKS.length})</span>
            </button>
            <button
              onClick={() => setSelectedFilter("free")}
              className={`px-3.5 py-2 text-sm border transition-colors ${
                selectedFilter === "free"
                  ? "bg-success-soft text-success border-success/30"
                  : "bg-surface text-ink-muted border-border hover:border-border-strong hover:text-ink"
              }`}
            >
              Free <span className="font-mono">(2)</span>
            </button>
            <button
              onClick={() => setSelectedFilter("paid")}
              className={`px-3.5 py-2 text-sm border transition-colors ${
                selectedFilter === "paid"
                  ? "bg-accent-soft text-accent border-accent/30"
                  : "bg-surface text-ink-muted border-border hover:border-border-strong hover:text-ink"
              }`}
            >
              Professional <span className="font-mono">(3)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      {/* â”€â”€â”€ How It Works â”€â”€â”€ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-3 mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-subtle">Process</p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
            From structured study to verifiable proof
          </h2>
          <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
            A clear progression model designed for working engineers and serious learners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {[
            { step: "01", title: "Select a track", body: "Choose a role-aligned curriculum mapped to concrete engineering competencies." },
            { step: "02", title: "Enroll & study", body: "Start free tracks instantly or enroll in professional tracks with secure checkout." },
            { step: "03", title: "Pass 80% assessments", body: "Each module requires an 80%+ MCQ score to unlock the next chapter." },
            { step: "04", title: "Receive credential", body: "Earn a certificate with a unique verification ID for independent validation." },
          ].map(({ step, title, body }) => (
            <div key={step} className="bg-surface p-6 sm:p-8 space-y-3">
              <div className="text-[11px] font-mono tracking-[0.14em] text-accent">{step}</div>
              <h3 className="text-base font-semibold text-ink tracking-tight">{title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}



