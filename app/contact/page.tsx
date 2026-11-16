"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Send,
  ShieldCheck,
  Clock,
  HelpCircle,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="space-y-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* â”€â”€â”€ Page Header â”€â”€â”€ */}
      <section className="relative pt-20 sm:pt-28 pb-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-gradient-to-tr from-indigo-100/40 via-sky-50/30 to-emerald-100/20 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold mb-8">
          <Mail className="w-3.5 h-3.5" />
          <span>Get in Touch</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.08] break-words">
          We&rsquo;d Love to Hear From You
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Questions about certification tracks, enrollment, UPI checkout, or verifying a credential?
          Reach out and we&rsquo;ll get back to you promptly.
        </p>
      </section>

      {/* â”€â”€â”€ Contact Form + Info Grid â”€â”€â”€ */}
      <section className="grid lg:grid-cols-2 gap-12">
        {/* Form Column */}
        <div className="space-y-6">
          <div className={`rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card ${submitted ? "opacity-50 pointer-events-none" : ""}`}>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">
              Send Us a Message
            </h2>
            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <ShieldCheck className="w-8 h-8 text-accent-emerald mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-600">
                  Thanks for reaching out. We&rsquo;ll respond to your inquiry as soon as possible.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2 rounded-xl bg-accent-indigo text-white text-xs font-bold hover:bg-indigo-600 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange("name")}
                      placeholder="Alex Rivera"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent-indigo transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange("email")}
                      placeholder="alex@company.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent-indigo transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject
                  </label>
                    <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange("subject")}
                    placeholder="Enrollment question, certificate verification, etc."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent-indigo transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange("message")}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-accent-indigo transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                  {formData.name && formData.email && formData.subject && formData.message
                    ? "All fields complete. Ready to send."
                    : "Please complete all fields before sending."}
                </p>
                <button
                  type="submit"
                  disabled={submitting || !formData.name || !formData.email || !formData.subject || !formData.message}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                    submitting || (!formData.name || !formData.email || !formData.subject || !formData.message)
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
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Expected Response</h3>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-accent-cyan shrink-0" />
              <div>
                <div className="text-sm font-bold text-slate-900">Within 24 Hours</div>
                <div className="text-xs text-slate-500">Our team typically responds within one business day.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">Contact Information</h2>
            <ul className="space-y-5">
              {[
                {
                  icon: Mail,
                  title: "Support Email",
                  value: "support@EduVoxPro.dev",
                  href: "mailto:support@EduVoxPro.dev",
                },
                {
                  icon: Phone,
                  title: "Student Support",
                  value: "+91 98765 43210",
                  href: "tel:+919876543210",
                },
                {
                  icon: MapPin,
                  title: "Headquarters",
                  value: "Bangalore, Karnataka, India",
                },
              ].map(({ icon: Icon, title, value, href }) => (
                <li key={title} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${title === "Support Email" ? "bg-sky-50 text-accent-cyan" : title === "Student Support" ? "bg-emerald-50 text-accent-emerald" : "bg-indigo-50 text-accent-indigo"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                      {title}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-slate-900 hover:text-accent-indigo transition-colors font-medium"
                      >
                        {value}
                      </a>
                    ) : (
                      <div className="text-sm text-slate-900 font-medium">{value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
            <ul className="space-y-4">
              {[
                {
                  q: "Are the free tracks really 100% free?",
                  a: "Yes. Foundations of Modern Web Technologies and AI Prompt Engineering & Ethics both bypass payment entirely and issue free verifiable certificates.",
                },
                {
                  q: "How do paid tracks work?",
                  a: "Paid tracks use direct UPI checkout (â‚¹79â€“â‚¹99). After payment webhook verification, you&rsquo;re instantly enrolled and module 1 unlocks.",
                },
                {
                  q: "How do I verify a certificate?",
                  a: "Every certificate has a unique Verification ID and QR code. Visit /certificate/[id] to verify any credential publicly.",
                },
                {
                  q: "Do I need an account to enroll?",
                  a: "Yes. A free account is required to track progression, save quiz results, and generate certificates.",
                },
              ].map(({ q, a }) => (
                <li key={q} className="border-b border-slate-100 pb-3 last:border-0">
                  <div className="flex items-start gap-2 mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-accent-indigo shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-slate-900">{q}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Follow Us</h3>
            <div className="flex items-center justify-center gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-accent-indigo hover:text-white transition-colors" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-sky-500 hover:text-white transition-colors" title="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-colors" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center mt-12">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Browse Certification Tracks</span>
        </Link>
      </div>
    </div>
  );
}

