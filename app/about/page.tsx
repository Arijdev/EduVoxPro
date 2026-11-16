"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TRACKS } from "@/data/curriculum";
import { formatINR } from "@/lib/utils";
import {
  Terminal,
  Award,
  BookOpen,
  LayoutDashboard,
  Users,
  Globe,
  ShieldCheck,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Gift,
  Download,
  Smartphone,
} from "lucide-react";

export default function AboutPage() {
  const [activeStat, setActiveStat] = useState<string>("tracks");

  const stats = [
    { id: "tracks", label: "Certification Tracks", value: TRACKS.length.toString(), icon: BookOpen },
    { id: "modules", label: "Deep Mastery Modules", value: "44", icon: LayoutDashboard },
    { id: "certs", label: "Verifiable Certificates", value: "2 Free Tracks", icon: Award },
    { id: "free", label: "100% Free Tracks", value: TRACKS.filter((t) => t.isFree).length.toString(), icon: Sparkles },
  ];

  return (
    <div className="space-y-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-20 sm:pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-gradient-to-tr from-indigo-100/40 via-sky-50/30 to-emerald-100/20 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold mb-8">
          <Terminal className="w-3.5 h-3.5" />
          <span>EduVoxPro Institute of Technical Mastery</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.08] break-words">
          Built for Deep Technical Mastery
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          EduVoxPro is an education-first certification platform that replaces video fluff with
          high-density documentation, real code architectures, and an 80% MCQ progression gate.
          Earn verifiable, print-ready credentials trusted by hiring teams.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/courses"
            className="px-8 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>All Courses</span>
          </Link>
        </div>

        {/* Stat Highlights */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-card-hover transition-shadow group ${activeStat === stat.id ? "border-accent-indigo bg-indigo-50" : ""}`}
              onClick={() => setActiveStat(stat.id)}
              onKeyDown={(e) => e.key === "Enter" && setActiveStat(stat.id)}
              role="button"
              tabIndex={0}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                activeStat === stat.id ? "bg-indigo-100 text-accent-indigo" : "bg-slate-50 text-slate-500"
              }`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-3">
                {stat.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Mission & Approach ─── */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-mono uppercase text-accent-indigo font-bold tracking-wider">
            Our Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Mastery over memorization
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Most platforms teach you to watch videos. EduVoxPro teaches you to read, write,
            and reason like an engineer. Every track is built around deep documentation, architectural
            schematics, and code patterns you can copy, modify, and ship.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
              <span>7–10 module curricula per certification track</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
              <span>5 MCQs per module with an 80% progression gate</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
              <span>2 completely free tracks with free verifiable certificates</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
              <span>Direct UPI checkout — zero gateway markup on paid tracks</span>
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-50/40 pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-accent-indigo flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Global Access</div>
                <div className="text-xs text-slate-500">Learn from anywhere, on any device.</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-accent-emerald flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Verifiable Credentials</div>
                <div className="text-xs text-slate-500">Unique verification ID + QR code per certificate.</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-accent-cyan flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Engineer-Built</div>
                <div className="text-xs text-slate-500">Curricula authored by working practitioners.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Track Highlight ─── */}
      <section className="border border-slate-200 rounded-3xl bg-white p-8 sm:p-12 shadow-sm">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Start with a 100% Free Track
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Both <strong>Foundations of Modern Web Technologies</strong> (8 modules) and{" "}
              <strong>AI Prompt Engineering & Ethics</strong> (7 modules) are completely free —
              including enrollment and the verifiable certificate upon passing.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRACKS.filter((t) => t.isFree).map((track) => (
              <Link
                key={track.id}
                href={`/learn/${track.slug}`}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-accent-indigo transition-colors">
                    {track.title}
                  </div>
                  <div className="text-xs text-slate-500">{track.modulesCount} modules · Free</div>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-accent-indigo transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Download App ─── */}
      <section id="download" className="border border-slate-200 rounded-3xl bg-white p-8 sm:p-12 shadow-sm">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase text-accent-indigo font-bold tracking-wider">
              Mobile App
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Download the EduVoxPro App
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Learn on the go with structured modules, 80% MCQ assessments, and verifiable credentials—optimized for mobile study sessions.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>Access your enrolled tracks and track progress anywhere</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>Fast, distraction-free reading and module quizzes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>View and verify earned certificates</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              <a
                href="/eduvoxpro-app.apk"
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download for Android (APK)</span>
              </a>
              <span className="text-xs text-slate-500 font-mono">
                iOS version coming soon
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Smartphone className="w-8 h-8 text-accent-indigo" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">EduVoxPro Mobile</div>
              <div className="text-sm text-slate-500 mt-1">Engineering certifications in your pocket</div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs text-xs text-slate-600 pt-2">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="font-mono font-bold text-slate-900">44</div>
                <div className="mt-0.5 text-slate-500">Modules</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="font-mono font-bold text-slate-900">80%</div>
                <div className="mt-0.5 text-slate-500">Gate</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="font-mono font-bold text-slate-900">QR</div>
                <div className="mt-0.5 text-slate-500">Verify</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center mt-12">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <span>Browse All Certification Tracks</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

