"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Track } from "@/data/curriculum";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";
import { Clock, Layers, Award, ArrowRight } from "lucide-react";

interface TrackCardProps {
  track: Track;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  const { user, isEnrolled, enrollTrack, openAuthModal, getTrackProgress, getCertificateByTrackId } = useApp();
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);

  const enrolled = isEnrolled(track.id);
  const progress = getTrackProgress(track.id);
  const certificate = getCertificateByTrackId(track.id);

  const difficultyStyles = {
    Beginner: "text-success border-success/30 bg-success-soft",
    Intermediate: "text-accent border-accent/30 bg-accent-soft",
    Advanced: "text-ink border-border-strong bg-surface-alt",
  } as const;

  const handleEnroll = async () => {
    if (!user) {
      openAuthModal("signup");
      return;
    }

    if (track.isFree || track.priceINR === 0) {
      setEnrolling(true);
      try {
        await enrollTrack(track, "100%_FREE_ENROLLMENT");
      } finally {
        setEnrolling(false);
      }
      return;
    }

    router.push(`/checkout/${track.slug}`);
  };

  return (
    <div className="group border border-border bg-surface p-6 flex flex-col justify-between transition-colors duration-200 hover:border-border-strong">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <span className="text-[11px] font-mono font-medium uppercase tracking-[0.12em] px-2 py-1 border border-border text-ink-muted bg-surface-alt">
            {track.roleBadge}
          </span>
          <div className="flex items-center gap-1.5">
            {track.isFree && (
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.08em] px-2 py-1 border border-success/30 bg-success-soft text-success">
                Free
              </span>
            )}
            <span className={`text-[11px] font-medium px-2 py-1 border ${difficultyStyles[track.difficulty]}`}>
              {track.difficulty}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-ink tracking-tight leading-snug group-hover:text-accent transition-colors">
            {track.title}
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed">
            {track.tagline}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-ink-subtle" />
            <span><span className="font-mono text-ink">{track.estimatedHours}+</span> hrs</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-ink-subtle" />
            <span><span className="font-mono text-ink">{track.modulesCount}</span> modules</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-ink-subtle">Core skills</span>
          <div className="flex flex-wrap gap-1.5">
            {track.skillsCovered.map((skill, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 border border-border bg-surface-alt text-ink-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-border space-y-3">
        {enrolled ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-muted">Progress</span>
              <span className="text-ink font-mono">
                {progress.completedCount}/{progress.totalCount} ({progress.percentage}%)
              </span>
            </div>

            <div className="w-full h-2 bg-surface-alt border border-border">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/learn/${track.slug}`}
                className="flex-1 py-2.5 px-4 bg-accent hover:bg-accent-hover text-accent-contrast font-semibold text-sm text-center inline-flex items-center justify-center gap-2 border border-accent transition-colors"
              >
                <span>Continue learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {certificate && (
                <Link
                  href={`/certificate/${certificate.id}`}
                  className="p-2.5 border border-border bg-surface hover:border-border-strong text-ink transition-colors"
                  title="View Certificate"
                >
                  <Award className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-[11px] text-ink-subtle uppercase font-mono tracking-[0.12em]">
                {track.isFree ? "Enrollment" : "Tuition"}
              </div>
              <div className="text-xl font-semibold font-mono text-ink">
                {track.isFree ? "Free" : formatINR(track.priceINR)}
              </div>
            </div>

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="py-2.5 px-4 bg-accent hover:bg-accent-hover text-accent-contrast font-semibold text-sm inline-flex items-center gap-2 border border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrolling ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-accent-contrast/30 border-t-accent-contrast rounded-full animate-spin" />
                  <span>Enrolling…</span>
                </span>
              ) : (
                <span>{track.isFree ? "Enroll free" : "Enroll"}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
