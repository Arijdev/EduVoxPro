"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  Mail,
  ArrowRight,
  Send,
  Clock,
  MapPin,
  Shield,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

type FormFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const RATE_LIMIT_MS = 30_000;

const LIMITS: Record<keyof FormFields, number> = {
  name: 80,
  email: 120,
  subject: 120,
  message: 2000,
};

function sanitizeInput(value: string, max: number): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormFields>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSubmitAt = useRef<number>(0);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleChange =
    (key: keyof FormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setError(null);
      setSubmitted(false);
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Honeypot: silently abort if a bot filled the hidden field
    if (honeypot.trim().length > 0) {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      return;
    }

    // Client-side throttling
    const now = Date.now();
    if (now - lastSubmitAt.current < RATE_LIMIT_MS) {
      setError("Please wait a moment before sending another message.");
      return;
    }

    // Sanitize and trim inputs
    const payload: FormFields = {
      name: sanitizeInput(formData.name, LIMITS.name),
      email: sanitizeInput(formData.email, LIMITS.email).toLowerCase(),
      subject: sanitizeInput(formData.subject, LIMITS.subject),
      message: sanitizeInput(formData.message, LIMITS.message),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setError("Please complete all fields with valid information.");
      return;
    }
    if (!isValidEmail(payload.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!TURNSTILE_SITE_KEY) {
      setError("Security verification is not configured. Please try again later.");
      return;
    }
    if (!turnstileToken) {
      setError("Please complete the verification check.");
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setError(
        "Our contact service is temporarily unavailable. Please try again later."
      );
      return;
    }

    setSubmitting(true);
    try {
      // Server-side rate limit, bot verification, and honeypot gate
      const verifyRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          company: honeypot,
        }),
      });
      if (!verifyRes.ok) {
        const data = await verifyRes.json().catch(() => ({}));
        throw new Error(
          data.error || "Verification failed. Please try again."
        );
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: payload.name,
          email: payload.email,
          subject: payload.subject,
          message: payload.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      lastSubmitAt.current = Date.now();
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setHoneypot("");
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } catch (err: any) {
      setError(
        err?.message || "We couldn’t send your message right now. Please try again shortly."
      );
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setSubmitting(false);
    }
  };

  const allFilled =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.subject.trim() &&
    formData.message.trim();

  const disabled = submitting || !allFilled || !turnstileToken || !TURNSTILE_SITE_KEY;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12">
      {/* ─── Page Header ─── */}
      <section className="relative text-center mb-6 sm:mb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[180px] bg-gradient-to-tr from-indigo-100/40 via-sky-50/30 to-emerald-100/20 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Contact EduVoxPro</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
          Send Us a Message
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Have a question about certification tracks, enrollment, or credential verification? Share the details below and our team will respond promptly and professionally.
        </p>
      </section>

      {/* ─── Contact Form ─── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-card">
        {submitted && (
          <div
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 flex items-start gap-3"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-emerald-900">Message sent successfully</h2>
              <p className="text-sm text-emerald-800 mt-0.5">
                Thank you for reaching out. We&rsquo;ve received your message and will respond as soon as possible.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-3"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-red-900">Unable to send message</h2>
              <p className="text-sm text-red-800 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Honeypot field: visually hidden to trap bots */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              top: "auto",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                maxLength={LIMITS.name}
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Your full name"
                autoComplete="name"
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-indigo-100 transition-colors disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                maxLength={LIMITS.email}
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={submitting}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-indigo-100 transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-bold text-slate-700 mb-1.5">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              required
              maxLength={LIMITS.subject}
              value={formData.subject}
              onChange={handleChange("subject")}
              placeholder="How can we assist you?"
              disabled={submitting}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-indigo-100 transition-colors disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={LIMITS.message}
              value={formData.message}
              onChange={handleChange("message")}
              rows={5}
              placeholder="Please provide as much detail as needed so we can assist you effectively."
              disabled={submitting}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-indigo-100 transition-colors disabled:opacity-60 resize-y"
            />
          </div>

          {TURNSTILE_SITE_KEY ? (
            <div className="flex justify-center pt-1">
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                options={{ action: "contact" }}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
              />
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              Security verification is not configured. Set <code className="font-mono">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code>.
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
            <p className="text-xs text-slate-500 flex items-start gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent-emerald shrink-0 mt-0.5" />
              <span>
                Your information is kept private and used only to respond to your inquiry. We do not share your details with third parties.
              </span>
            </p>
            <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider shrink-0">
              {allFilled ? "Ready to send" : "All fields required"}
            </p>
          </div>

          <button
            type="submit"
            disabled={disabled}
            className={`w-full py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
              disabled
                ? "bg-slate-200 text-slate-500 border border-slate-200"
                : "bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white shadow-indigo-200 border border-transparent"
            }`}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* ─── Location & Response Info ─── */}
      <section className="mt-5 sm:mt-6 grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-accent-indigo flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Headquarters
              </h2>
              <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                EduVoxPro Headquarters, Kolkata, West Bengal, India
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Our team operates from Kolkata and supports learners globally through our online platform.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-accent-cyan flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Response Time
              </h2>
              <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                Typically within 24 hours
              </p>
              <p className="text-xs text-slate-600 mt-1">
                We review every message carefully and aim to provide clear, helpful responses within one business day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center mt-6">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Browse Certification Tracks</span>
        </Link>
      </div>
    </div>
  );
}
