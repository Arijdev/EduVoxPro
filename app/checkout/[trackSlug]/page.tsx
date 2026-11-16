"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import { TRACKS } from "@/data/curriculum";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const trackSlug = params?.trackSlug as string;
  const { user, isEnrolled, openAuthModal } = useApp();

  const track = useMemo(
    () => TRACKS.find((t) => t.slug === trackSlug || t.id === trackSlug),
    [trackSlug]
  );

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [agreed, setAgreed] = useState(true);

  useEffect(() => {
    if (user) {
      setBillingName((v) => v || user.fullName || "");
      setBillingEmail((v) => v || user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setRazorpayLoaded(true));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => setError("Failed to load payment gateway. Please refresh and try again.");
    document.body.appendChild(script);
  }, []);

  if (!track) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Track not found</h1>
        <p className="text-slate-600">The checkout link is invalid or the track is unavailable.</p>
        <Link href="/courses" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-indigo text-white font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </Link>
      </div>
    );
  }

  if (track.isFree || track.priceINR === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">This track is free</h1>
        <p className="text-slate-600">No payment is required. You can enroll directly from the course page.</p>
        <Link href={`/learn/${track.slug}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-indigo text-white font-semibold">
          Go to course
        </Link>
      </div>
    );
  }

  const enrolled = isEnrolled(track.id);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail.trim());
  const nameValid = billingName.trim().length >= 2;
  const canPay = !!user && !enrolled && razorpayLoaded && !isProcessing && emailValid && nameValid && agreed;

  const handlePay = async () => {
    setError(null);

    if (!user) {
      openAuthModal("login");
      return;
    }
    if (enrolled) {
      router.push(`/learn/${track.slug}`);
      return;
    }
    if (!nameValid) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!emailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!agreed) {
      setError("Please confirm the billing details to continue.");
      return;
    }
    if (!razorpayLoaded || !window.Razorpay) {
      setError("Payment gateway is still loading. Please wait a moment and try again.");
      return;
    }

    setIsProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const amountPaise = Math.round(track.priceINR * 100);
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: "INR",
          receipt: `rcpt_${track.id}_${user.id}`.slice(0, 40),
          trackId: track.id,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Could not start payment. Please try again.");
      }
      if (!data.order_id) {
        throw new Error("Payment order was not created. Please try again.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountPaise,
        currency: "INR",
        name: "EduVoxPro",
        description: `Enrollment: ${track.title}`,
        order_id: data.order_id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                trackId: track.id,
              }),
            });
            const verifyData = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed. If amount was deducted, contact support.");
            }
            router.push(`/learn/${track.slug}?enrolled=1`);
          } catch (err: any) {
            setError(err.message || "Payment verification failed.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: billingName.trim(),
          email: billingEmail.trim(),
        },
        notes: {
          trackId: track.id,
          userId: user.id,
        },
        theme: { color: "#4F46E5" },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError("Payment was cancelled. You can try again anytime.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setIsProcessing(false);
        setError(resp?.error?.description || "Payment failed. Please try again or use another method.");
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Failed to start payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link href={`/learn/${track.slug}`} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-accent-indigo font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to course
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit">
          <ShieldCheck className="w-3.5 h-3.5" /> Secure checkout
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <section className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
            <p className="text-sm text-slate-600 mt-1">Complete your enrollment with a secure card payment via Razorpay.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!user ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
              <p className="text-sm text-amber-900 font-medium">You need to sign in to complete payment.</p>
              <button
                onClick={() => openAuthModal("login")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-indigo text-white font-semibold text-sm"
              >
                <User className="w-4 h-4" /> Sign in to continue
              </button>
            </div>
          ) : enrolled ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-5 h-5" /> You are already enrolled in this track.
              </div>
              <Link href={`/learn/${track.slug}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-sm">
                Continue learning
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Billing details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700">Full name</span>
                    <input
                      type="text"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      placeholder="Your full name"
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${nameValid || !billingName ? "border-slate-200 focus:border-accent-indigo" : "border-red-300"}`}
                      autoComplete="name"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700">Email address</span>
                    <input
                      type="email"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${emailValid || !billingEmail ? "border-slate-200 focus:border-accent-indigo" : "border-red-300"}`}
                      autoComplete="email"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">These details are used for your receipt and certificate records.</p>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Payment method</h2>
                <div className="rounded-xl border-2 border-indigo-300 bg-indigo-50/50 p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-indigo-200 flex items-center justify-center text-accent-indigo shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 text-sm">Card / UPI / Netbanking (Razorpay)</div>
                    <div className="text-xs text-slate-600 mt-0.5">Pay securely using credit/debit card, UPI, wallets, or netbanking in the Razorpay checkout.</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-accent-indigo shrink-0" />
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-slate-300 text-accent-indigo focus:ring-indigo-200" />
                <span>I confirm the billing details are correct and I want to enroll in <strong>{track.title}</strong> for {formatINR(track.priceINR)}.</span>
              </label>

              <button
                onClick={handlePay}
                disabled={!canPay}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : !razorpayLoaded ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Pay {formatINR(track.priceINR)}
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Payments are processed securely. We do not store your card details.
              </p>
            </>
          )}
        </section>

        <aside className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-4 sticky top-24">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Order summary</h2>
            <div>
              <div className="text-xs font-mono text-accent-indigo font-bold uppercase tracking-wider">{track.roleBadge}</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{track.title}</div>
              <div className="text-sm text-slate-600 mt-1">{track.modulesCount} modules · {track.estimatedHours}+ hours</div>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /> Lifetime access to curriculum & updates</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /> Module quizzes with 80% mastery gate</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /> Verifiable certificate on completion</li>
            </ul>
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm text-slate-600">Total</span>
              <span className="text-2xl font-black font-mono text-slate-900">{formatINR(track.priceINR)}</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800">Having trouble?</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Ensure you are signed in with a valid session.</li>
              <li>Disable pop-up blockers if the payment window doesn’t open.</li>
              <li>If you see an error, it will be shown above so you can retry.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

