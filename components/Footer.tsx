"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Gift, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-surface text-ink-muted py-12 px-4 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <Image src="/eduvoxpro-mark.svg" alt="EduVoxPro" width={32} height={32} className="w-8 h-8" />
            <span className="font-semibold text-ink text-base tracking-tight">EduVox<span className="text-accent">Pro</span></span>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            High-impact, education-first tech certification platform. Built for deep mastery through comprehensive 7-10 module tracks, code architectures, and verifiable credentials.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-success font-medium">
            <Gift className="w-4 h-4" />
            <span>2 completely free certification tracks</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-ink text-xs tracking-[0.12em] uppercase mb-3 font-mono">Free Certifications</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/learn/foundations-of-modern-web-technologies" className="text-ink-muted hover:text-ink transition-colors flex items-center gap-1.5">
                <span>Modern Web Technologies</span>
                <span className="text-[10px] font-mono bg-success-soft text-success px-1.5 py-0.5 border border-success/30">FREE</span>
              </Link>
            </li>
            <li>
              <Link href="/learn/ai-prompt-engineering-ethics" className="text-ink-muted hover:text-ink transition-colors flex items-center gap-1.5">
                <span>AI Prompt Engineering & Ethics</span>
                <span className="text-[10px] font-mono bg-success-soft text-success px-1.5 py-0.5 border border-success/30">FREE</span>
              </Link>
            </li>
          </ul>

          <h4 className="font-semibold text-ink text-xs tracking-[0.12em] uppercase mt-5 mb-3 font-mono">Professional Tracks</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/learn/agentic-ai-developer" className="hover:text-ink transition-colors">Agentic AI Developer (₹99)</Link></li>
            <li><Link href="/learn/generative-ai-specialist" className="hover:text-ink transition-colors">Generative AI Specialist (₹89)</Link></li>
            <li><Link href="/learn/modern-fullstack-architect" className="hover:text-ink transition-colors">Modern Full-Stack Architect (₹79)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-ink text-xs tracking-[0.12em] uppercase mb-3 font-mono">Mastery Architecture</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-ink-subtle" /><span>7 to 10 modules per track</span></li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-ink-subtle" /><span>5 MCQs with 80% lock gate</span></li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-ink-subtle" /><span>Zero-fee free enrollments</span></li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-ink-subtle" /><span>Verifiable, print-ready certificates</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-ink text-xs tracking-[0.12em] uppercase mb-3 font-mono">Platform</h4>
          <div className="bg-surface-alt border border-border p-3.5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-3"><span className="shrink-0">Database</span><span className="font-mono text-ink text-right break-words">Supabase PostgreSQL</span></div>
            <div className="flex items-center justify-between gap-3"><span className="shrink-0">Security</span><span className="font-mono text-ink text-right break-words">Row Level Security</span></div>
            <div className="flex items-center justify-between gap-3"><span className="shrink-0">Payments</span><span className="font-mono text-ink text-right break-words">Razorpay Checkout</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-xs text-ink-subtle gap-4 text-center sm:text-left">
        <div>© {new Date().getFullYear()} EduVoxPro. Education-first tech certifications with verifiable credentials.</div>
        <div className="flex items-center justify-center sm:justify-end gap-4">
          <span className="text-ink-muted flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Supabase-backed verification</span>
          </span>
        </div>
      </div>
    </footer>
  );
};


