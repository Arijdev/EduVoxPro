"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  TRACKS, 
  MODULES 
} from "@/data/curriculum";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  Gift,
  Zap,
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const {
    user,
    enrollments,
    certificates,
    getTrackProgress,
  } = useApp();
  const [activeTab, setActiveTab] = useState<"tracks" | "certificates">("tracks");

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-slate-700">Please sign in to view your dashboard.</p>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setActiveTab('tracks')}
            className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded"
          >
            Sign In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const enrolledTrackObjects = TRACKS.filter((track) =>
    enrollments.some((e) => e.trackId === track.id)
  );

  const totalCompletedModules = enrolledTrackObjects.reduce((acc, track) => {
    return acc + getTrackProgress(track.id).completedCount;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-background min-h-screen">
      
      {/* ─── Profile / Stats Banner ─── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6 shadow-card relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-gradient-to-tr from-accent-indigo via-accent-cyan to-accent-emerald p-[2px] shadow-lg shadow-indigo-200">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl text-accent-indigo">
              {user?.fullName ? user.fullName[0].toUpperCase() : "A"}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 break-words">
                {user?.fullName || "Alex Rivera"}
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-50 text-accent-indigo border border-indigo-200 font-bold">
                VERIFIED STUDENT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-mono mt-0.5 break-all">
              {user?.email || "alex.rivera@eduvoxpro.dev"}
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 text-center shrink-0">
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono">{enrolledTrackObjects.length}</div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Enrolled</div>
          </div>
          <div>
            <div className="text-2xl font-black text-accent-cyan font-mono">{totalCompletedModules}</div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Modules Mastered</div>
          </div>
          <div>
            <div className="text-2xl font-black text-accent-emerald font-mono">{certificates.length}</div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Certificates</div>
          </div>
        </div>
      </div>

      {/* ─── Tabs Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "tracks"
                ? "bg-indigo-50 text-accent-indigo border border-indigo-200 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Enrolled Tracks ({enrolledTrackObjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "certificates"
                ? "bg-emerald-50 text-accent-emerald border border-emerald-200 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>My Certificates ({certificates.length})</span>
          </button>
        </div>

        <Link
          href="/#catalog"
          className="text-xs font-semibold text-accent-indigo hover:underline hidden sm:flex items-center gap-1"
        >
          <span>Browse More Tracks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ─── Tab 1: Enrolled Tracks ─── */}
      {activeTab === "tracks" && (
        <div className="space-y-6">
          {enrolledTrackObjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledTrackObjects.map((track) => {
                const progress = getTrackProgress(track.id);
                const cert = certificates.find((c) => c.trackId === track.id);
                const isFinished = progress.percentage === 100;

                return (
                  <div
                    key={track.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-4 hover:border-indigo-300 hover:shadow-card-hover transition-all shadow-card"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`text-[11px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${track.colorTheme.badgeBg} ${track.colorTheme.badgeBorder}`}>
                          {track.roleBadge}
                        </span>
                        {isFinished ? (
                          <span className="text-[11px] font-bold text-accent-emerald flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Track Complete
                          </span>
                        ) : track.isFree ? (
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            100% Free Track
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-mono">
                            {track.estimatedHours}+ Hours
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        {track.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {track.tagline}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Mastery Progress</span>
                        <span className="text-accent-indigo font-mono font-bold">
                          {progress.completedCount} of {progress.totalCount} Modules ({progress.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-accent-indigo via-accent-cyan to-accent-emerald rounded-full transition-all duration-500"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
                      <Link
                        href={`/learn/${track.slug}`}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white font-semibold text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 shadow-md shadow-indigo-200 transition-all active:scale-95"
                      >
                        <span>{isFinished ? "Review Curriculum" : "Continue Learning"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      {cert && (
                        <Link
                          href={`/certificate/${cert.id}`}
                          className="py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                        >
                          <Award className="w-4 h-4" />
                          <span>Certificate</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No Enrolled Tracks Yet</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Get started immediately with our two 100% free certification tracks or enroll in deep professional tracks.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/learn/foundations-of-modern-web-technologies"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-emerald to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-200 hover:scale-105 transition-all"
                >
                  <Gift className="w-4 h-4" />
                  <span>Start Free: Web Technologies</span>
                </Link>
                <Link
                  href="/#catalog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Zap className="w-4 h-4" />
                  <span>Browse All Tracks</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Tab 2: My Certificates ─── */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 flex flex-col justify-between space-y-4 shadow-card"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                        VERIFIED CREDENTIAL
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {cert.issueDate}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {cert.trackTitle}
                    </h3>

                    <div className="text-xs font-mono text-accent-cyan break-all">
                      ID: {cert.verificationId}
                    </div>

                    <div className="pt-2 text-xs text-slate-600">
                      Awarded to <strong className="text-slate-900">{cert.studentName}</strong> for demonstrating
                      comprehensive technical mastery with a score average of {cert.scoreAverage}%.
                    </div>
                  </div>

                  <div className="pt-4 border-t border-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Link
                      href={`/certificate/${cert.id}`}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-accent-emerald to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200 hover:scale-105 transition-all"
                    >
                      <Award className="w-4 h-4" />
                      <span>View & Print Certificate</span>
                    </Link>

                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.eduvoxpro.in/certificate/${cert.verificationId}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs inline-flex items-center justify-center gap-1 transition-colors shadow-sm self-start sm:self-auto"
                      title="Share to LinkedIn"
                    >
                      <Share2 className="w-4 h-4 text-blue-600" />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                <Award className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No Certificates Earned Yet</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Complete all modules in an enrolled track and pass each module&apos;s 5-question MCQ checkpoint with â‰¥80% to generate your high-res verifiable credential.
                </p>
              </div>
              {enrolledTrackObjects.length > 0 && (
                <Link
                  href={`/learn/${enrolledTrackObjects[0].slug}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-200 hover:scale-105 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Resume Learning</span>
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

