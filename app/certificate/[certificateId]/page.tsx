"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { TRACKS, type Certificate } from "@/data/curriculum";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabase";
import {
  Printer,
  Share2,
  ArrowLeft,
  Check,
  Copy,
  ShieldCheck,
  ShieldAlert,
  Loader2,
} from "lucide-react";

function mapDbCertificate(c: any): Certificate {
  return {
    id: c.id,
    verificationId: c.verification_id,
    trackId: c.track_id,
    userId: c.user_id,
    studentName: c.student_name,
    trackTitle: c.track_title,
    issueDate: c.issue_date,
    scoreAverage: c.score_average ?? 0,
    skillsCertified: Array.isArray(c.skills_certified) ? c.skills_certified : [],
    badgeRole: c.badge_role || "Certified Specialist",
    isFreeTrack: !!c.is_free_track,
  };
}

export default function CertificatePage() {
  const params = useParams();
  const certParamId = decodeURIComponent((params?.certificateId as string) || "");
  const { certificates } = useApp();

  const [certificate, setCertificate] = useState<Certificate | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState("https://www.eduvoxpro.in");

  // Fixed-resolution proportional scaling (800x566 reference canvas)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const scale = containerWidth / 800;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || 800;
      setContainerWidth(w);
    };
    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    if (typeof window !== "undefined") window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      if (typeof window !== "undefined") window.removeEventListener("resize", update);
    };
  }, [loading, notFound, certificate]);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function resolveCertificate() {
      if (!certParamId) {
        if (!cancelled) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      setNotFound(false);

      // 1) Local context (current user session)
      const local = certificates.find(
        (c) => c.id === certParamId || c.verificationId === certParamId
      );
      if (local && !cancelled) {
        setCertificate(local);
        setLoading(false);
        return;
      }

      // 2) Public verification lookup (Supabase RLS allows public read)
      try {
        const byVerification = await supabase
          .from("certificates")
          .select("*")
          .eq("verification_id", certParamId)
          .maybeSingle();

        let row = byVerification.data;
        if (!row) {
          const byId = await supabase
            .from("certificates")
            .select("*")
            .eq("id", certParamId)
            .maybeSingle();
          row = byId.data;
        }

        if (cancelled) return;
        if (row) {
          setCertificate(mapDbCertificate(row));
        } else {
          setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    resolveCertificate();
    return () => {
      cancelled = true;
    };
  }, [certParamId, certificates]);

  const track = useMemo(
    () => (certificate ? TRACKS.find((t) => t.id === certificate.trackId) : undefined),
    [certificate]
  );

  const verifyUrl = certificate
    ? `${origin}/certificate/${encodeURIComponent(certificate.verificationId)}`
    : `${origin}/certificate/${encodeURIComponent(certParamId)}`;

  const credentialJsonLd = certificate
    ? {
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalCredential",
        name: `${certificate.trackTitle} Certificate of Mastery`,
        description: `Verifiable EduVoxPro credential issued to ${certificate.studentName} for ${certificate.trackTitle}.`,
        credentialCategory: "Certificate",
        url: verifyUrl,
        identifier: {
          "@type": "PropertyValue",
          name: "Verification ID",
          value: certificate.verificationId,
        },
        recognizedBy: {
          "@type": "EducationalOrganization",
          name: "EduVoxPro",
          url: "https://www.eduvoxpro.in",
        },
        educationalLevel: "Professional certification",
        competencyRequired: track?.skillsCovered?.length ? track.skillsCovered : undefined,
        validIn: { "@type": "Place", name: "Worldwide" },
      }
    : null;

  const handlePrint = () => window.print();

  const handleCopyVerificationLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-ink-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verifying credential…</span>
        </div>
      </div>
    );
  }

  if (notFound || !certificate) {
    return (
      <div className="min-h-screen py-16 px-4 bg-background">
        <div className="max-w-xl mx-auto border border-border bg-surface p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border border-red-200 bg-red-50 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-ink tracking-tight">Certificate not verified</h1>
          <p className="text-sm text-ink-muted">
            No certificate was found for ID{" "}
            <span className="font-mono text-ink">{certParamId || "—"}</span>. Check the verification
            ID or QR code and try again.
          </p>
          <p className="text-xs text-ink-muted">
            If you recently completed this course, open your dashboard to get the current certificate.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="px-4 py-2 text-sm font-medium border border-border text-ink hover:bg-surface-alt">
              Go to home
            </Link>
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium border border-border text-ink hover:bg-surface-alt">
              Go to dashboard
            </Link>
            <Link
              href="/courses"
              className="px-4 py-2 text-sm font-medium bg-accent text-accent-contrast border border-accent hover:bg-accent-hover"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verifyUrl)}`;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-6 bg-background print:min-h-0 print:p-0 print:space-y-0 print:bg-white">
      {credentialJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(credentialJsonLd) }}
        />
      )}
      {/* Top Action Bar (hidden in print) */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print pb-4 border-b border-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
          <div className="inline-flex items-center gap-1.5 px-3 py-2 border border-success/30 bg-success-soft text-success text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified on EduVoxPro</span>
          </div>
          <button
            onClick={handleCopyVerificationLink}
            className="px-3.5 py-2 border border-border bg-surface hover:bg-surface-alt text-ink text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Link copied" : "Copy verification link"}</span>
          </button>
          <a
            href={linkedInShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 border border-border bg-surface hover:bg-surface-alt text-ink text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </a>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-accent-contrast font-semibold text-xs sm:text-sm flex items-center gap-2 border border-accent transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Download / Print</span>
          </button>
        </div>
      </div>

      {/* Certificate (saved format for all candidates) — 800×566 fixed canvas, proportionally scaled */}
      <div className="max-w-5xl w-full mx-auto">
        <div
          ref={containerRef}
          className="certificate-scale-wrapper relative w-full aspect-[1.414/1] overflow-hidden bg-[#FFFEFA] border border-[#D6C48A]"
        >
          <div
            className="certificate-canvas bg-[#FFFEFA] text-[#1C1917]"
            style={{
              width: "800px",
              height: "566px",
              transform: `scale(${scale})`,
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
                    <h1 className="text-[32px] font-semibold tracking-[0.16em] uppercase text-[#0F172A] leading-tight">
                      Certificate of Mastery
                    </h1>
                    <p className="text-[12px] uppercase tracking-[0.14em] text-[#64748B] leading-tight">
                      This is to certify that
                    </p>
                  </div>
                </div>

                {/* Middle: certification statement */}
                <div className="flex flex-1 flex-col items-center justify-center gap-2.5 py-2">
                  <p className="text-[46px] font-semibold tracking-tight text-[#0F172A] underline decoration-[#C7D2FE] underline-offset-[8px] decoration-[2px] leading-tight max-w-[700px]">
                    {certificate.studentName}
                  </p>
                  <p className="text-[13px] text-[#475569] leading-[1.7] max-w-[580px]">
                    has successfully completed the curriculum and met the 80% assessment requirement for
                  </p>
                  <p className="text-[18px] font-semibold text-[#0F172A] border border-[#E2E8F0] bg-white/70 px-6 py-2.5 leading-snug max-w-[640px]">
                    {certificate.trackTitle}
                  </p>
                  <p className="text-[11px] text-[#64748B] font-mono leading-tight pt-1">
                    Modules: {track?.modulesCount ?? "—"}&nbsp;&nbsp;•&nbsp;&nbsp;Score:{" "}
                    {certificate.scoreAverage}%&nbsp;&nbsp;•&nbsp;&nbsp;Issued: {certificate.issueDate}
                  </p>
                </div>

                {/* Bottom: signatures, seal, verification */}
                <div className="grid grid-cols-3 items-end gap-6 pt-3 border-t border-[#E2E8F0]">
                  <div className="flex flex-col items-start text-left gap-1">
                    <div className="w-[160px] border-b border-[#CBD5E1] pb-1 mb-1">
                      <Image
                        src="/signature-arij.svg"
                        alt="Arij Chowdhury signature"
                        width={160}
                        height={40}
                        className="h-[28px] w-auto"
                      />
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.06em] text-[#334155] leading-snug">
                      Arij Chowdhury
                    </div>
                    <div className="text-[9px] text-[#64748B] leading-snug">
                      Founder &amp; Program Director
                    </div>
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
                      <img src={qrSrc} alt="Verification QR code" className="w-[64px] h-[64px] block" />
                    </div>
                    <div className="text-[9px] font-mono text-[#334155] leading-snug max-w-[180px] break-all">
                      ID: {certificate.verificationId}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification details (hidden in print) */}
      <div className="max-w-5xl mx-auto no-print">
        <div className="border border-border bg-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2 text-xs text-ink-muted">
            <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <div>
                Verification ID:{" "}
                <span className="font-mono font-semibold text-ink">{certificate.verificationId}</span>
              </div>
              <div className="mt-0.5">
                Verify at: <span className="font-mono text-ink break-all">{verifyUrl}</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-ink-muted font-mono">
            Score: <strong className="text-ink">{certificate.scoreAverage}%</strong> · Issued:{" "}
            {certificate.issueDate}
          </div>
        </div>
      </div>
    </div>
  );
}
