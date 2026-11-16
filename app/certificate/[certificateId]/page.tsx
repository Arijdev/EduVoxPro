"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  const { getCertificateById } = useApp();

  const [certificate, setCertificate] = useState<Certificate | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState("https://eduvoxpro.dev");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function resolveCertificate() {
      if (!certParamId) {
        if (!cancelled) { setNotFound(true); setLoading(false); }
        return;
      }
      setLoading(true);
      setNotFound(false);

      // 1) Local context (current user session)
      const local = getCertificateById(certParamId);
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
    return () => { cancelled = true; };
  }, [certParamId, getCertificateById]);

  const track = useMemo(
    () => (certificate ? TRACKS.find((t) => t.id === certificate.trackId) : undefined),
    [certificate]
  );

  const skills = useMemo(() => {
    if (!certificate) return [];
    if (certificate.skillsCertified?.length) return certificate.skillsCertified;
    return track?.skillsCovered || [];
  }, [certificate, track]);

  const verifyUrl = certificate
    ? `${origin}/certificate/${encodeURIComponent(certificate.verificationId)}`
    : `${origin}/certificate/${encodeURIComponent(certParamId)}`;

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
            No certificate was found for ID <span className="font-mono text-ink">{certParamId || "—"}</span>. Check the verification ID or QR code and try again.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link href="/" className="px-4 py-2 text-sm font-medium border border-border text-ink hover:bg-surface-alt">Go to home</Link>
            <Link href="/courses" className="px-4 py-2 text-sm font-medium bg-accent text-accent-contrast border border-accent hover:bg-accent-hover">Browse courses</Link>
          </div>
        </div>
      </div>
    );
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verifyUrl)}`;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-6 bg-background">
      {/* Top Action Bar (hidden in print) */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print pb-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
          <div className="inline-flex items-center gap-1.5 px-3 py-2 border border-success/30 bg-success-soft text-success text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified on EduVoxPro</span>
          </div>
          <button onClick={handleCopyVerificationLink} className="px-3.5 py-2 border border-border bg-surface hover:bg-surface-alt text-ink text-xs font-medium flex items-center gap-1.5 transition-colors">
            {copiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Link copied" : "Copy verification link"}</span>
          </button>
          <a href={linkedInShareUrl} target="_blank" rel="noopener noreferrer" className="px-3.5 py-2 border border-border bg-surface hover:bg-surface-alt text-ink text-xs font-medium flex items-center gap-1.5 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </a>
          <button onClick={handlePrint} className="px-4 py-2 bg-accent hover:bg-accent-hover text-accent-contrast font-semibold text-xs sm:text-sm flex items-center gap-2 border border-accent transition-colors">
            <Printer className="w-4 h-4" />
            <span>Download / Print</span>
          </button>
        </div>
      </div>

      {/* Certificate (saved format for all candidates) */}
      <div className="max-w-5xl mx-auto certificate-container overflow-x-auto sm:overflow-visible pb-2">
        <div className="relative aspect-[1.414/1] w-full min-w-[640px] sm:min-w-0 border border-[#D6C48A] bg-[#FFFEFA] text-[#1C1917] overflow-hidden">
          <div className="absolute inset-[8px] border border-[#E7D9A8] pointer-events-none" />
          <div className="absolute inset-[14px] border border-dashed border-[#EADFAF] pointer-events-none" />

          <div className="relative h-full flex flex-col px-6 sm:px-10 py-5 sm:py-7 text-center">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-left">
                <Image src="/eduvoxpro-mark.svg" alt="EduVoxPro" width={30} height={30} className="w-[30px] h-[30px] shrink-0" />
                <div className="leading-[1.2]">
                  <div className="text-[12px] sm:text-[13px] font-semibold tracking-tight text-[#0F172A]">EduVox<span className="text-[#1D4ED8]">Pro</span></div>
                  <div className="text-[6.5px] font-mono uppercase tracking-[0.14em] text-[#64748B] mt-px">Institute of Technical Mastery</div>
                </div>
              </div>
              <span className="text-[6.5px] font-mono uppercase tracking-[0.12em] text-[#334155] border border-[#CBD5E1] bg-white/70 px-2 py-1 leading-none shrink-0">Verifiable Credential</span>
            </div>

            <div className="mt-4 sm:mt-5">
              <h1 className="text-[18px] sm:text-[22px] font-semibold tracking-[0.18em] uppercase text-[#0F172A] leading-none">Certificate of Mastery</h1>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-3">
              <p className="text-[8px] uppercase tracking-[0.14em] text-[#64748B] leading-none">This is to certify that</p>
              <p className="mt-3 text-[26px] sm:text-[34px] font-semibold tracking-tight text-[#0F172A] underline decoration-[#C7D2FE] underline-offset-[6px] decoration-[1.5px] leading-none">{certificate.studentName}</p>
              <p className="mt-3 text-[8px] sm:text-[9px] text-[#475569] leading-[1.7] max-w-[78%]">
                has successfully completed the prescribed curriculum and satisfied the 80% assessment requirement for
              </p>
              <p className="mt-2.5 text-[11px] sm:text-[13px] font-semibold text-[#0F172A] border border-[#E2E8F0] bg-white/70 px-4 py-2 leading-none">{certificate.trackTitle}</p>
              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-[85%]">
                  {skills.slice(0, 5).map((skill, i) => (
                    <span key={i} className="text-[6px] sm:text-[6.5px] font-mono px-1.5 py-0.5 border border-[#E2E8F0] bg-white/60 text-[#334155]">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[7px] text-[#64748B] font-mono leading-none pb-3 shrink-0">
              Modules: {track?.modulesCount ?? "—"}&nbsp;&nbsp;•&nbsp;&nbsp;Score: {certificate.scoreAverage}%&nbsp;&nbsp;•&nbsp;&nbsp;Issued: {certificate.issueDate}
            </p>

            {/* Footer */}
            <div className="grid grid-cols-3 items-end gap-4 pt-3 border-t border-[#E2E8F0] shrink-0">
              <div className="text-left">
                <div className="w-[130px] border-b border-[#CBD5E1] pb-1 mb-1.5">
                  <Image src="/signature-arij.svg" alt="Arij Chowdhury signature" width={130} height={32} className="h-[22px] w-auto" />
                </div>
                <div className="text-[7px] font-mono uppercase tracking-[0.06em] text-[#334155] leading-[1.3]">Arij Chowdhury</div>
                <div className="text-[6px] text-[#64748B] leading-[1.4] mt-0.5">Founder &amp; Program Director</div>
                <div className="text-[5.5px] text-[#94A3B8] leading-[1.3] mt-px">EduVoxPro</div>
              </div>

              <div className="flex flex-col items-center justify-end pb-0.5">
                <div className="w-8 h-8 rounded-full border border-[#D6C48A] bg-[#FFFDF5] flex items-center justify-center mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
                </div>
                <div className="text-[6px] font-mono uppercase tracking-[0.1em] text-[#64748B] leading-none">Verified</div>
                {certificate.isFreeTrack && (
                  <div className="text-[5px] font-mono uppercase tracking-[0.08em] text-[#047857] mt-1">Free Track</div>
                )}
              </div>

              <div className="flex flex-col items-end justify-end text-right pb-0.5">
                <div className="p-[3px] bg-white border border-[#E2E8F0] mb-1.5">
                  <img src={qrSrc} alt="Verification QR code" className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] block" />
                </div>
                <div className="text-[5.5px] sm:text-[6px] font-mono text-[#334155] leading-none break-all max-w-[160px]">ID: {certificate.verificationId}</div>
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
              <div>Verification ID: <span className="font-mono font-semibold text-ink">{certificate.verificationId}</span></div>
              <div className="mt-0.5">Verify at: <span className="font-mono text-ink break-all">{verifyUrl}</span></div>
            </div>
          </div>
          <div className="text-xs text-ink-muted font-mono">
            Score: <strong className="text-ink">{certificate.scoreAverage}%</strong> · Issued: {certificate.issueDate}
          </div>
        </div>
      </div>
    </div>
  );
}
