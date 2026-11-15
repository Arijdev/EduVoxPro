"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Certificate, 
  TRACKS 
} from "@/data/curriculum";
import { useApp } from "@/context/AppContext";
import { 
  Printer, 
  Share2, 
  ArrowLeft, 
  Check, 
  Copy, 
  Award, 
  ShieldCheck, 
  Terminal,
  Gift
} from "lucide-react";

export default function CertificatePage() {
  const params = useParams();
  const certParamId = params?.certificateId as string;
  const { getCertificateById, certificates, user } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);

  let certificate: Certificate | undefined = getCertificateById(certParamId);

  // Fallback demo certificate for instant testing
  if (!certificate) {
    if (certificates.length > 0) {
      certificate = certificates[0];
    } else {
      certificate = {
        id: certParamId || "cert_demo_mastery",
        verificationId: `EDV-2026-WEB-9841F`,
        trackId: "track-web-foundations",
        userId: user?.id || "usr_alex_dev",
        studentName: user?.fullName || "Alex Rivera",
        trackTitle: "Foundations of Modern Web Technologies",
        issueDate: "November 14, 2026",
        scoreAverage: 96,
        skillsCertified: [
          "Semantic HTML5 & Accessible DOM Architecture",
          "Modern Responsive CSS Grid & Flexbox",
          "Git Distributed Version Control & CLI",
          "Browser Critical Rendering Path & Optimization",
          "Web Security (XSS, CSRF & CSP Defenses)"
        ],
        badgeRole: "Junior Web Systems Engineer",
        isFreeTrack: true,
      };
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyVerificationLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.warn("Failed to copy link", e);
    }
  };

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : "https://eduvortexpro.dev"
  )}`;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-6 bg-background">
      
      {/* ─── Top Action Bar (Hidden in Print) ─── */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 no-print pb-4 border-b border-slate-200">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleCopyVerificationLink}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Link Copied!" : "Copy Verification Link"}</span>
          </button>

          <a
            href={linkedInShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share to LinkedIn</span>
          </a>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* ─── Certificate Container (intentionally dark — premium diploma aesthetic) ─── */}
      <div className="max-w-5xl mx-auto certificate-container">
        <div className="relative w-full aspect-[16/10] sm:aspect-[1.414/1] rounded-3xl border-2 border-indigo-400/40 bg-[#070B14] p-8 sm:p-14 shadow-2xl overflow-hidden flex flex-col justify-between text-center select-none">
          
          {/* Decorative borders */}
          <div className="absolute inset-4 rounded-2xl border border-indigo-400/20 pointer-events-none" />
          <div className="absolute inset-6 rounded-xl border border-dashed border-sky-400/15 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Certificate Header */}
          <div className="relative space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-indigo via-accent-cyan to-accent-emerald p-[1.5px] shadow-lg">
                <div className="w-full h-full bg-[#070B14] rounded-xl flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-accent-cyan" />
                </div>
              </div>
              <div className="text-left">
                <span className="font-black text-base tracking-wider text-white">
                  EduVortex<span className="text-indigo-400">Pro</span>
                </span>
                <span className="block text-[10px] font-mono uppercase text-slate-400 tracking-widest">
                  INSTITUTE OF TECHNICAL MASTERY
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-widest uppercase bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">
                Certificate of Mastery
              </h2>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono tracking-widest uppercase text-sky-400 font-bold">
                  VERIFIABLE PROFESSIONAL CREDENTIAL
                </span>
                {certificate.isFreeTrack && (
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-400 border border-emerald-500/40">
                    100% Free Merit Credential
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Student & Track Body */}
          <div className="relative space-y-4 my-auto py-4">
            <p className="text-xs sm:text-sm font-sans tracking-wide uppercase text-slate-400">
              This officially certifies that
            </p>

            <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight underline decoration-indigo-400/40 decoration-2 underline-offset-8">
              {certificate.studentName}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-1">
              has completed rigorous coursework, code architectures, and satisfied the 80% passing threshold for the technical role:
            </p>

            <div className="inline-block px-4 py-2 rounded-xl bg-white/10 border border-indigo-400/30 text-white font-bold text-base sm:text-xl">
              {certificate.trackTitle}
            </div>

            {/* Skills Certified */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto pt-1">
              {certificate.skillsCertified.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/20"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Signatures & Verification Footer */}
          <div className="relative pt-6 border-t border-white/20 grid grid-cols-3 items-end text-center">
            {/* Left: Signature */}
            <div className="space-y-1">
              <div className="font-serif italic text-lg sm:text-xl text-slate-300 border-b border-slate-600 pb-1 max-w-[140px] mx-auto">
                Eleni Vance
              </div>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Chief Technology Architect
              </div>
              <div className="text-[9px] text-slate-500">EduVortexPro Academic Board</div>
            </div>

            {/* Center: Stamp */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-[2px] shadow-xl shadow-amber-500/20 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#070B14] flex flex-col items-center justify-center text-amber-300">
                  <Award className="w-6 h-6" />
                  <span className="text-[8px] font-mono font-bold uppercase tracking-tighter">VERIFIED</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">
                Issued: {certificate.issueDate}
              </span>
            </div>

            {/* Right: QR & ID */}
            <div className="space-y-1 flex flex-col items-center sm:items-end">
              <div className="p-1 rounded bg-white shadow">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(
                    `https://eduvortexpro.dev/certificate/${certificate.verificationId}`
                  )}`}
                  alt="Verification QR Code"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              </div>
              <div className="text-[10px] font-mono text-sky-400 font-bold tracking-wider">
                ID: {certificate.verificationId}
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                SHA-256 Authenticated
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Verification Info (below certificate, hidden in print) ─── */}
      <div className="max-w-5xl mx-auto no-print">
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between flex-wrap gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-accent-emerald" />
            <span>Verification ID: <span className="font-mono font-bold text-accent-indigo">{certificate.verificationId}</span></span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Score Average: <strong className="text-slate-800">{certificate.scoreAverage}%</strong> · Issued: {certificate.issueDate}
          </div>
        </div>
      </div>
    </div>
  );
}
