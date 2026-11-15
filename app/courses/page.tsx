"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TRACKS } from "@/data/curriculum";
import { TrackCard } from "@/components/TrackCard";
import {
  Award,
  ArrowRight,
  Gift,
  BookOpen,
  Filter,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function CoursesPage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "free" | "paid">("all");

  const filteredTracks = TRACKS.filter((track) => {
    if (selectedFilter === "free") return track.isFree;
    if (selectedFilter === "paid") return !track.isFree;
    return true;
  });

  const freeCount = TRACKS.filter((t) => t.isFree).length;
  const paidCount = TRACKS.filter((t) => !t.isFree).length;

  return (
    <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ─── Page Header ─── */}
      <section className="relative pt-10 sm:pt-14 pb-8 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] bg-gradient-to-tr from-indigo-100/30 via-sky-50/20 to-emerald-100/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold mb-6">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Certification Course Catalog</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.1] mb-4">
          Choose Your Certification Track
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Comprehensive 7–10 module engineering curricula. Zero video fluff. High-density
          documentation, architectural schematics, and an 80% MCQ gate to unlock every module.
        </p>

        {/* Quick stat line */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-slate-500" />
            {TRACKS.length} Tracks
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            44 Modules
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-500" />
            80% MCQ Gate
          </span>
        </div>
      </section>

      {/* ─── Filter Bar ─── */}
      <section className="max-w-4xl mx-auto">
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-sm mx-auto">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${
              selectedFilter === "all"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>All ({TRACKS.length})</span>
          </button>
          <button
            onClick={() => setSelectedFilter("free")}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${
              selectedFilter === "free"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm"
                : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <Gift className="w-3 h-3" />
            <span>Free ({freeCount})</span>
          </button>
          <button
            onClick={() => setSelectedFilter("paid")}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${
              selectedFilter === "paid"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            }`}
          >
            <Award className="w-3 h-3" />
            <span>Paid ({paidCount})</span>
          </button>
        </div>
      </section>

      {/* ─── Tracks Grid ─── */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
        {filteredTracks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-200 flex items-center justify-center text-slate-400 mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No tracks found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filter selection.</p>
          </div>
        )}
      </section>

      {/* ─── Track Structure Highlights ─── */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "7–10 Modules",
            icon: Layers,
            color: "bg-indigo-50 border-indigo-200 text-accent-indigo",
            body: "Every track is broken into focused modules with reading, code, and a mastery quiz.",
          },
          {
            title: "5 MCQs Per Module",
            icon: CheckCircle2,
            color: "bg-emerald-50 border-emerald-200 text-accent-emerald",
            body: "Five deep questions per module. Score 80%+ to unlock the next chapter.",
          },
          {
            title: "Verifiable Certificate",
            icon: Award,
            color: "bg-sky-50 border-sky-200 text-accent-cyan",
            body: "Earn a print-ready diploma with a unique Verification ID and QR code.",
          },
        ].map(({ title, icon: Icon, color, body }) => {
          const [bgCls, borderCls, textCls] = color.split(" ");
          return (
            <div key={title} className={`rounded-2xl border p-6 bg-white shadow-sm ${bgCls} ${borderCls}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${bgCls} ${textCls}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
            </div>
          );
        })}
      </section>

      {/* ─── Free Tracks Spotlight ─── */}
      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-card">
        <div className="space-y-3 max-w-xl">
          <span className="text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800">
            START FOR FREE
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            100% Free Coursework. 100% Free Certificates.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Foundations of Modern Web Technologies and AI Prompt Engineering & Ethics bypass payment
            entirely and issue permanent verifiable certificates upon passing the 80% threshold.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link
            href="/learn/foundations-of-modern-web-technologies"
            className="py-3 px-5 rounded-xl bg-gradient-to-r from-accent-emerald to-teal-500 text-white font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-200"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Web Technologies</span>
          </Link>
          <Link
            href="/learn/ai-prompt-engineering-ethics"
            className="py-3 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Ethics</span>
          </Link>
        </div>
      </section>

      <div className="text-center mt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
}
