"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Track } from "@/data/curriculum";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";
import { 
  Clock, 
  Layers, 
  Award, 
  ArrowRight, 
  Zap, 
  Gift
} from "lucide-react";

interface TrackCardProps {
  track: Track;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  const { isEnrolled, handleEnrollClick, getTrackProgress, getCertificateByTrackId } = useApp();
  const [enrolling, setEnrolling] = useState(false);

  const enrolled = isEnrolled(track.id);
  const progress = getTrackProgress(track.id);
  const certificate = getCertificateByTrackId(track.id);

  const difficultyColors = {
    Beginner: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Intermediate: "border-sky-200 bg-sky-50 text-sky-800",
    Advanced: "border-indigo-200 bg-indigo-50 text-indigo-800",
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await handleEnrollClick(track);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="relative group rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between transition-all duration-300 hover:border-indigo-300 hover:shadow-xl shadow-sm">
      {/* Background Subtle Gradient Glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-indigo-50/50 via-transparent to-sky-50/50"
      />

      <div className="relative space-y-4">
        {/* Top Badges: Role, Difficulty & Free Tag */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${track.colorTheme.badgeBg} ${track.colorTheme.badgeBorder}`}>
            {track.roleBadge}
          </span>
          <div className="flex items-center gap-1.5">
            {track.isFree && (
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 flex items-center gap-1 shadow-xs">
                <Gift className="w-3 h-3 text-emerald-600" />
                100% Free
              </span>
            )}
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${difficultyColors[track.difficulty]}`}>
              {track.difficulty}
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-accent-indigo transition-colors tracking-tight">
            {track.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {track.tagline}
          </p>
        </div>

        {/* Track Meta Stats */}
        <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent-cyan" />
            <span>{track.estimatedHours}+ Hours Mastery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-accent-indigo" />
            <span>{track.modulesCount} Core Modules</span>
          </div>
        </div>

        {/* Skills Tag Pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Mastery Skills:</span>
          <div className="flex flex-wrap gap-1.5">
            {track.skillsCovered.map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Pricing & Action CTA */}
      <div className="relative pt-6 mt-6 border-t border-slate-100 space-y-3">
        {enrolled ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Track Progression</span>
              <span className="text-accent-indigo font-mono font-bold">
                {progress.completedCount}/{progress.totalCount} Modules ({progress.percentage}%)
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-accent-indigo via-accent-cyan to-accent-emerald transition-all duration-500 rounded-full"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/learn/${track.slug}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 shadow-md shadow-accent-indigo/25 transition-all active:scale-95"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {certificate && (
                <Link
                  href={`/certificate/${certificate.id}`}
                  className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                  title="View Certificate"
                >
                  <Award className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-wider">
                {track.isFree ? "100% Free Track" : "Direct UPI Access"}
              </div>
              <div className="text-2xl font-black font-mono flex items-baseline gap-1">
                {track.isFree ? (
                  <span className="text-emerald-700 font-extrabold">FREE</span>
                ) : (
                  <>
                    <span className="text-slate-900">{formatINR(track.priceINR)}</span>
                    <span className="text-xs font-normal text-slate-400 line-through">
                      {formatINR(track.priceINR * 10)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                track.isFree
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20"
                  : "bg-gradient-to-r from-accent-indigo to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 text-white shadow-accent-indigo/25"
              }`}
            >
              {enrolling ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Enrolling...</span>
                </span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{track.isFree ? "Enroll Free Now" : "Enroll Now"}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
