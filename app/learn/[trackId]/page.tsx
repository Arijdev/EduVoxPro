"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  TRACKS, 
  MODULES, 
  Module, 
  Track 
} from "@/data/curriculum";
import { useApp } from "@/context/AppContext";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { QuizModule } from "@/components/QuizModule";
import { formatINR } from "@/lib/utils";
import { 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  ChevronRight, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Menu, 
  X,
  Gift,
  Zap
} from "lucide-react";

export default function LearnWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackSlug = params?.trackId as string;

  const { 
    user,
    openAuthModal,
    isEnrolled, 
    enrollTrack,
    isModuleUnlocked, 
    isModuleCompleted, 
    getTrackProgress,
    getCertificateByTrackId,
    refreshUserData,
  } = useApp();

  const track = TRACKS.find((t) => t.slug === trackSlug || t.id === trackSlug);
  const trackModules = track ? (MODULES[track.slug] || []) : [];

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!track || !user) return;
    if (searchParams.get("enrolled") !== "1") return;
    let cancelled = false;
    (async () => {
      await refreshUserData();
      if (!cancelled) {
        router.replace(`/learn/${track.slug}`);
      }
    })();
    return () => { cancelled = true; };
  }, [track, user, searchParams, refreshUserData, router]);

  if (!track) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Track Not Found</h1>
        <p className="text-slate-600">The certification track you requested does not exist.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-accent-indigo text-white rounded-lg font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const enrolled = isEnrolled(track.id);
  const activeModule: Module | undefined = trackModules[activeModuleIndex];
  const progress = getTrackProgress(track.id);
  const certificate = getCertificateByTrackId(track.id);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": track.title,
    "description": track.description,
    "provider": { "@type": "Organization", "name": "EduVoxPro" },
    "educationalCredentialAwarded": {
      "@type": "EducationalOccupationalCredential",
      "name": `${track.title} Certificate of Mastery`,
      "credentialCategory": "Certificate"
    },
    "offers": {
      "@type": "Offer",
      "price": track.isFree ? "0" : track.priceINR.toString(),
      "priceCurrency": "INR"
    }
  };

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

  // â”€â”€ Enrollment Gate â”€â”€
  if (!enrolled) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-16 sm:py-24"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />

        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-6 shadow-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 to-transparent pointer-events-none" />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-accent-indigo">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className={`text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded border ${track.colorTheme.badgeBg} ${track.colorTheme.badgeBorder}`}>
                {track.roleBadge}
              </span>
              {track.isFree && (
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800">
                  100% Free Track
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mt-2 break-words">
              {track.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {track.description}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto grid grid-cols-2 gap-3 text-xs text-slate-700">
            <div>
              <span className="text-slate-500 block font-mono">Curriculum</span>
              <strong className="text-slate-900 text-sm font-mono">{track.modulesCount} Core Modules</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-mono">Est. Time</span>
              <strong className="text-slate-900 text-sm font-mono">{track.estimatedHours}+ Hours</strong>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 ${
                track.isFree
                  ? "bg-gradient-to-r from-accent-emerald to-teal-500 text-white shadow-emerald-200 hover:scale-105"
                  : "bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white shadow-indigo-200"
              }`}
            >
              {enrolling ? (
                <span>Enrolling...</span>
              ) : (
                <>
                  {track.isFree ? <Gift className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />}
                  <span>{track.isFree ? "Enroll Free Now (Instant Access)" : `Enroll via Direct UPI (${formatINR(track.priceINR)})`}</span>
                </>
              )}
            </button>
            <Link
              href="/"
              className="px-6 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold transition-colors"
            >
              Browse Other Tracks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Learning Workspace â”€â”€
  return (
    <div
      className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]"
      suppressHydrationWarning
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden p-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-accent-indigo bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200"
        >
          <Menu className="w-4 h-4" />
          <span>Curriculum Tree ({activeModuleIndex + 1}/{trackModules.length})</span>
        </button>
        <span className="text-xs text-slate-500 font-mono">
          {progress.percentage}% Complete
        </span>
      </div>

      {/* â”€â”€â”€ Left Sidebar: Curriculum Tree â”€â”€â”€ */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-30 w-80 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 shadow-lg lg:shadow-none ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-accent-indigo transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Track Title & Progress */}
        <div className="p-4 border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-accent-cyan font-bold tracking-wider">
              {track.roleBadge}
            </span>
            {track.isFree && (
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Free
              </span>
            )}
          </div>
          <h2 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
            {track.title}
          </h2>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Progression</span>
              <span className="text-accent-indigo font-mono font-bold">
                {progress.completedCount}/{progress.totalCount} ({progress.percentage}%)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-accent-indigo via-accent-cyan to-accent-emerald rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Module List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {trackModules.map((module, idx) => {
            const isUnlocked = idx === 0 || isModuleUnlocked(track.id, module.id);
            const isCompleted = isModuleCompleted(track.id, module.id);
            const isActive = idx === activeModuleIndex;

            return (
              <button
                key={module.id}
                disabled={!isUnlocked}
                onClick={() => {
                  setActiveModuleIndex(idx);
                  setMobileSidebarOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                  isActive
                    ? "border-indigo-300 bg-indigo-50 text-accent-indigo shadow-sm font-medium"
                    : isUnlocked
                    ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    : "border-slate-100 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                  ) : isUnlocked ? (
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-mono ${
                      isActive ? "border-accent-indigo text-accent-indigo font-bold" : "border-slate-400 text-slate-500"
                    }`}>
                      {idx + 1}
                    </div>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                    <span>MODULE {idx + 1}</span>
                    <span>{module.estimatedMinutes}m</span>
                  </div>
                  <div className={`font-semibold line-clamp-2 leading-snug ${isActive ? "text-accent-indigo" : "text-slate-800"}`}>
                    {module.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Certificate shortcut */}
        {certificate && (
          <div className="p-3 border-t border-slate-200 bg-emerald-50">
            <Link
              href={`/certificate/${certificate.id}`}
              className="w-full py-2 px-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between hover:bg-emerald-200 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Certificate Ready</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </aside>

      {/* Sidebar overlay for mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* â”€â”€â”€ Main Content Viewer â”€â”€â”€ */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10 min-w-0">
        {activeModule ? (
          <article className="space-y-10">
            {/* Module Header */}
            <header className="space-y-3 pb-6 border-b border-slate-200">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Link href="/dashboard" className="hover:text-accent-cyan transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-slate-700">{track.roleBadge}</span>
                <span>/</span>
                <span className="text-accent-indigo font-semibold">Module {activeModuleIndex + 1} of {trackModules.length}</span>
              </nav>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight break-words">
                {activeModule.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-accent-cyan" />
                  {activeModule.estimatedMinutes} Minutes Reading
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
                  Progression Gate: 80% MCQ
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-2">
                {activeModule.summary}
              </p>
            </header>

            {/* Content Sections */}
            <div className="space-y-6 text-slate-700">
              {activeModule.contentSections.map((section, sIdx) => {
                if (section.type === "text") {
                  return (
                    <div key={sIdx} className="space-y-3">
                      {section.heading && (
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-2">
                          {section.heading}
                        </h2>
                      )}
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                        {section.body}
                      </p>
                    </div>
                  );
                }

                if (section.type === "code" && section.code) {
                  return (
                    <CodeBlock
                      key={sIdx}
                      code={section.code}
                      language={section.language || "typescript"}
                      filename={section.filename}
                      explanation={section.explanation}
                    />
                  );
                }

                if (section.type === "callout" && section.title && section.message) {
                  return (
                    <Callout
                      key={sIdx}
                      type={section.calloutType || "tip"}
                      title={section.title}
                      message={section.message}
                    />
                  );
                }

                if (section.type === "diagram") {
                  return (
                    <ArchitectureDiagram
                      key={sIdx}
                      title={section.title || "Architecture Topology"}
                      description={section.description || ""}
                      caption={section.caption || "System architecture schematic"}
                      svgVariant={section.svgVariant || "agent-loop"}
                      imageUrl={section.imageUrl}
                    />
                  );
                }

                if (section.type === "keytakeaways" && section.items) {
                  return (
                    <div key={sIdx} className="my-6 p-6 rounded-2xl border border-indigo-200 bg-indigo-50 space-y-3">
                      <span className="text-xs font-mono uppercase font-bold text-accent-indigo tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        KEY ARCHITECTURAL TAKEAWAYS
                      </span>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2">
                            <span className="text-accent-indigo font-bold mt-0.5">â€¢</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Quiz Module */}
            <QuizModule
              quiz={activeModule.quiz}
              trackSlug={track.slug}
              isCompleted={isModuleCompleted(track.id, activeModule.id)}
              onModuleUnlocked={() => {}}
            />

            {/* Prev / Next Navigation */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <button
                disabled={activeModuleIndex === 0}
                onClick={() => {
                  setActiveModuleIndex(prev => prev - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Module</span>
              </button>

              {activeModuleIndex + 1 < trackModules.length ? (
                <button
                  disabled={!isModuleUnlocked(track.id, trackModules[activeModuleIndex + 1]?.id)}
                  onClick={() => {
                    setActiveModuleIndex(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Next: Module {activeModuleIndex + 2}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                certificate && (
                  <Link
                    href={`/certificate/${certificate.id}`}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-emerald to-teal-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 hover:scale-105 transition-all"
                  >
                    <Award className="w-4 h-4 fill-current" />
                    <span>View Your Verifiable Certificate</span>
                  </Link>
                )
              )}
            </div>
          </article>
        ) : (
          <div className="text-center py-20 text-slate-500">
            Select a module from the sidebar to begin learning.
          </div>
        )}
      </main>
    </div>
  );
}

