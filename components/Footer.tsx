"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ShieldCheck, Gift, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 py-12 px-4 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-cyan flex items-center justify-center text-white font-bold shadow-sm">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight">EduVortex<span className="text-accent-indigo">Pro</span></span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            High-impact, education-first tech certification platform. Built for deep mastery through comprehensive 7-10 module tracks, code architectures, and verifiable credentials.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700 font-bold">
            <Gift className="w-4 h-4 text-accent-emerald" />
            <span>2 Completely Free Certification Tracks</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-3">100% Free Certifications</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/learn/foundations-of-modern-web-technologies" className="text-emerald-700 font-semibold hover:underline transition-colors flex items-center gap-1.5">
                <span>Modern Web Technologies</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded border border-emerald-200 font-bold">FREE</span>
              </Link>
            </li>
            <li>
              <Link href="/learn/ai-prompt-engineering-ethics" className="text-emerald-700 font-semibold hover:underline transition-colors flex items-center gap-1.5">
                <span>AI Prompt Engineering & Ethics</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded border border-emerald-200 font-bold">FREE</span>
              </Link>
            </li>
          </ul>

          <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase mt-5 mb-3">Professional Tracks</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/learn/agentic-ai-developer" className="hover:text-accent-indigo text-slate-600 transition-colors">
                Agentic AI Developer (₹99)
              </Link>
            </li>
            <li>
              <Link href="/learn/generative-ai-specialist" className="hover:text-accent-indigo text-slate-600 transition-colors">
                Generative AI Specialist (₹89)
              </Link>
            </li>
            <li>
              <Link href="/learn/modern-fullstack-architect" className="hover:text-accent-indigo text-slate-600 transition-colors">
                Modern Full-Stack Architect (₹79)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-3">Mastery Architecture</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
              <span>7 to 10 Modules per Track</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
              <span>5 MCQs with 80% Lock Gate</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Zero-Fee Free Enrollments</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Verifiable Print-Ready Certs</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase mb-3">Backend & Database</h4>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-medium">Database Engine</span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">Supabase PostgreSQL</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-medium">Security Policies</span>
              <span className="text-[11px] font-mono text-indigo-700 font-bold">Row Level Security (RLS)</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-medium">Payment Gateway</span>
              <span className="text-[11px] font-mono text-slate-800 font-bold">Direct UPI / Webhooks</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} EduVortexPro. Education-first tech certifications with verifiable credentials.
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-700 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-4 h-4 text-accent-emerald" />
            <span>Supabase Verified RLS Engine</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
