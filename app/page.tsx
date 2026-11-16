"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TRACKS } from "@/data/curriculum";
import { TrackCard } from "@/components/TrackCard";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  FileCheck,
  Building2,
  BadgeCheck,
  Brain,
  ClipboardCheck,
  Target,
} from "lucide-react";

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "free" | "paid">("all");

  const heroCertRef = useRef<HTMLDivElement | null>(null);
  const [heroCertWidth, setHeroCertWidth] = useState(800);
  const heroCertScale = heroCertWidth / 800;

  useEffect(() => {
    const el = heroCertRef.current;
    if (!el) return;
    const update = () => setHeroCertWidth(el.clientWidth || 800);
    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

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
        url: "https://www.eduvoxpro.in",
        description:
          "Structured engineering certification tracks with rigorous assessments and verifiable credentials.",
      },
      ...TRACKS.map((track) => ({
        "@type": "Course",
        name: track.title,
        description: track.description,
        url: `https://www.eduvoxpro.in/learn/${track.slug}`,
        provider: {
          "@type": "EducationalOrganization",
          name: "EduVoxPro",
          sameAs: "https://www.eduvoxpro.in",
        },
        offers: {
          "@type": "Offer",
          price: track.isFree ? "0" : track.priceINR.toString(),
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `https://www.eduvoxpro.in/learn/${track.slug}`,
        },
        educationalCredentialAwarded: {
          "@type": "EducationalOccupationalCredential",
          name: `${track.title} Certificate of Mastery`,
          credentialCategory: "Certificate",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
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

      {/* ─── Hero (asymmetric 60/40) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-20 sm:pb-24 lg:pb-28">
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

          {/* Right: 40% visual proof — proper certificate format (proportionally scaled) */}
          <div className="lg:col-span-5">
            <div className="border border-border bg-surface p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-subtle">Credential Preview</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-success border border-success/30 bg-success-soft px-2 py-0.5">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>

              <div
                ref={heroCertRef}
                className="relative w-full aspect-[1.414/1] overflow-hidden bg-[#FFFEFA] border border-[#D6C48A]"
              >
                <div
                  className="bg-[#FFFEFA] text-[#1C1917]"
                  style={{
                    width: "800px",
                    height: "566px",
                    transform: `scale(${heroCertScale})`,
                    transformOrigin: "top left",
                  }}
                >
                  {/* Fixed 800x566 layout: normal flow only, no absolutely positioned text */}
                  <div className="flex h-full w-full flex-col justify-between border border-[#E7D9A8] p-3 box-border">
                    <div className="flex h-full w-full flex-col justify-between border border-dashed border-[#EADFAF] px-10 py-8 box-border text-center">
                      {/* Top: header + title */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 text-left">
                            <Image
                              src="/eduvoxpro-mark.svg"
                              alt="EduVoxPro"
                              width={44}
                              height={44}
                              className="w-11 h-11 shrink-0"
                            />
                            <div className="leading-tight">
                              <div className="text-[18px] font-semibold tracking-tight text-[#0F172A]">
                                EduVox<span className="text-[#1D4ED8]">Pro</span>
                              </div>
                              <div className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#64748B] mt-1">
                                Institute of Technical Mastery
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#334155] border border-[#CBD5E1] bg-white/70 px-3 py-2 leading-none shrink-0">
                            Verifiable Credential
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 pt-1">
                          <h3 className="text-[32px] font-semibold tracking-[0.16em] uppercase text-[#0F172A] leading-tight">
                            Certificate of Mastery
                          </h3>
                          <p className="text-[12px] uppercase tracking-[0.14em] text-[#64748B] leading-tight">
                            This is to certify that
                          </p>
                        </div>
                      </div>

                      {/* Middle: certification statement */}
                      <div className="flex flex-1 flex-col items-center justify-center gap-2.5 py-2">
                        <p className="text-[46px] font-semibold tracking-tight text-[#0F172A] underline decoration-[#C7D2FE] underline-offset-[8px] decoration-[2px] leading-tight max-w-[700px]">
                          Alex Rivera
                        </p>
                        <p className="text-[13px] text-[#475569] leading-[1.7] max-w-[580px]">
                          has successfully completed the curriculum and met the 80% assessment requirement for
                        </p>
                        <p className="text-[18px] font-semibold text-[#0F172A] border border-[#E2E8F0] bg-white/70 px-6 py-2.5 leading-snug max-w-[640px]">
                          Agentic AI Systems Architect
                        </p>
                        <p className="text-[11px] text-[#64748B] font-mono leading-tight pt-1">
                          Modules: 10/10&nbsp;&nbsp;•&nbsp;&nbsp;Score: 94%&nbsp;&nbsp;•&nbsp;&nbsp;Issued: Nov 16, 2026
                        </p>
                      </div>

                      {/* Bottom: signatures, seal, verification */}
                      <div className="grid grid-cols-3 items-end gap-6 pt-3 border-t border-[#E2E8F0]">
                        <div className="flex flex-col items-start text-left gap-1">
                          <div className="w-[160px] border-b border-[#CBD5E1] pb-1 mb-1">
                            <Image
                              src="/signature-arij.svg"
                              alt="Arij signature"
                              width={160}
                              height={40}
                              className="h-[28px] w-auto"
                            />
                          </div>
                          <div className="text-[10px] font-mono uppercase tracking-[0.06em] text-[#334155] leading-snug">
                            Arij Chowdhury
                          </div>
                          <div className="text-[9px] text-[#64748B] leading-snug">Founder &amp; Program Director</div>
                          <div className="text-[8px] text-[#94A3B8] leading-snug">EduVoxPro</div>
                        </div>

                        <div className="flex flex-col items-center justify-end gap-1.5 pb-1">
                          <div className="w-12 h-12 rounded-full border border-[#D6C48A] bg-[#FFFDF5] flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-[#1D4ED8]" />
                          </div>
                          <div className="text-[9px] font-mono uppercase tracking-[0.1em] text-[#64748B] leading-none">
                            Verified
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-end text-right gap-1.5 pb-1">
                          <div className="p-1 bg-white border border-[#E2E8F0]">
                              <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=https://www.eduvoxpro.in/certificate/EDV-2026-AIA-8F3K2Q"
                                alt="Sample EduVoxPro credential verification QR code"
                                className="w-[64px] h-[64px] block"
                              />
                          </div>
                          <div className="text-[9px] font-mono text-[#334155] leading-snug">ID: EDV-2026-AIA-8F3K2Q</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Industry Alignment & Recognition ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-subtle">
              Industry Alignment & Recognition
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink leading-tight">
              Skills evidence that engineering leaders can verify
            </h2>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Modern hiring and internal mobility demand proof of applied capability—not just credentials claimed on a résumé.
              EduVoxPro issues cryptographically verifiable certificates tied to rigorous, module-level assessments, giving
              recruiters and engineering leaders a trustworthy signal of what a candidate can actually do.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {["Verifiable by ID/QR", "Assessment-backed", "Role-aligned tracks", "Portable proof"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1 border border-border bg-surface text-[11px] font-mono uppercase tracking-[0.08em] text-ink-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
            {[
              {
                icon: ShieldCheck,
                title: "Cryptographic verifiability",
                body: "Each credential carries a unique verification ID and public validation route, enabling independent confirmation without relying on opaque transcripts.",
              },
              {
                icon: BadgeCheck,
                title: "Competency over coursework claims",
                body: "Certificates are earned only after meeting 80%+ MCQ thresholds across modules, signaling demonstrated mastery rather than passive completion.",
              },
              {
                icon: Building2,
                title: "Recruiter & team confidence",
                body: "Hiring managers can quickly validate skills aligned to production engineering roles, reducing screening noise compared to unverified degree-only signals.",
              },
              {
                icon: Target,
                title: "Outcome-aligned curricula",
                body: "Tracks map to concrete architectural and implementation competencies, making credentials relevant to real delivery expectations in modern engineering orgs.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-surface p-6 space-y-3">
                <div className="w-9 h-9 border border-border bg-canvas flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-accent" />
                </div>
                <h3 className="text-base font-semibold text-ink tracking-tight">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Expanded Mastery Framework ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-3 mb-12 max-w-3xl">
          <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-subtle">
            Expanded Mastery Framework
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
            A pedagogical model built for durable engineering competence
          </h2>
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            EduVoxPro emphasizes depth, retention, and accountable evaluation. Every track combines dense technical material
            with structured checkpoints so learners build production-relevant understanding—not superficial familiarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              step: "01",
              title: "Active recall",
              body: "Frequent, module-level questioning forces retrieval and application of concepts, strengthening long-term retention and exposing gaps early in the learning path.",
              points: [
                "Concept checks embedded throughout progression",
                "Retrieval practice over passive reading",
                "Immediate feedback to correct misconceptions",
              ],
            },
            {
              icon: BookOpen,
              step: "02",
              title: "High-density documentation",
              body: "Curricula prioritize precise explanations, architectural patterns, and implementation detail—delivering signal-rich material that mirrors real engineering references.",
              points: [
                "Structured modules with clear technical scope",
                "Architecture-first, production-oriented content",
                "No video fluff; focused, reviewable material",
              ],
            },
            {
              icon: ClipboardCheck,
              step: "03",
              title: "Proctored evaluation design",
              body: "Assessments are designed as gated evaluations with strict pass thresholds, ensuring progression and certification reflect verified performance under defined standards.",
              points: [
                "80%+ MCQ mastery gates per module",
                "Sequential unlocks to enforce readiness",
                "Credential issuance tied to demonstrated results",
              ],
            },
          ].map(({ icon: Icon, step, title, body, points }) => (
            <div key={title} className="border border-border bg-surface p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 border border-border bg-canvas flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-[11px] font-mono tracking-[0.14em] text-accent">{step}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-ink tracking-tight">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
              </div>
              <ul className="space-y-2 pt-1">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-ink-muted">
                    <FileCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Track Catalog Section ─── */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-subtle">Curriculum Catalog</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Certification Tracks
            </h2>
            <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
              7–10 module tracks with mandatory 80% MCQ checkpoints and verifiable certificates on completion.
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
          {filteredTracks.slice(0, 3).map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface text-ink text-sm font-semibold border border-border hover:border-border-strong transition-colors"
          >
            View all tracks
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── How It Works ─── */}
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



