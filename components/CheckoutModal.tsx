"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";
import {
  DEFAULT_UPI_CONFIG,
  generateUPIQrUrl,
  simulateUPIWebhookVerification,
} from "@/lib/upi";

export const CheckoutModal: React.FC = () => {
  const { activeCheckoutTrack, closeCheckout, enrollTrack, user } = useApp();
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const shouldShow = isMounted && !!activeCheckoutTrack && !!user;
  const track = activeCheckoutTrack;
  const currentUser = user;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => setPaymentError("Razorpay checkout script failed to load");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      setRazorpayLoaded(false);
    };
  }, []);

  const orderPayload = {
    trackId: track?.id || "",
    trackTitle: track?.title || "",
    amountINR: track?.priceINR || 0,
    userId: currentUser?.id || "",
    userEmail: currentUser?.email || "",
    transactionRef: transactionRef || `UTR-${Date.now().toString().slice(-8)}`,
  };

  const qrImageUrl = generateUPIQrUrl(orderPayload);

  const handleCopyVpa = async () => {
    try {
      await navigator.clipboard.writeText(DEFAULT_UPI_CONFIG.merchantVpa);
      setCopiedVpa(true);
      setTimeout(() => setCopiedVpa(false), 2000);
    } catch (err) {
      console.warn("Failed to copy UPI ID", err);
    }
  };

  const handlePasteDemoUtr = () => {
    const demoUtr = `UPI/2026/${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    setTransactionRef(demoUtr);
  };

  const handleSimulateWebhookPayment = async () => {
    if (!track || !currentUser) return;
    setIsProcessing(true);
    setWebhookMessage("Dispatched UPI Webhook Event to Server...");
    setPaymentError(null);

    try {
      await simulateUPIWebhookVerification(orderPayload);
      setWebhookMessage("Webhook Verified: Unlocking Course & Generating State...");
      await enrollTrack(track, orderPayload.transactionRef);
    } catch (err) {
      setWebhookMessage("Webhook verification failed. Please try again.");
      setPaymentError("UPI webhook verification failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPay = async () => {
    if (!track || !currentUser || !razorpayLoaded) {
      setPaymentError("Razorpay checkout is still loading. Please try again.");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    setWebhookMessage(null);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: track?.priceINR * 100 || 0,
          currency: "INR",
          receipt: `rcpt_${track?.id}_${currentUser?.id}`,
          trackId: track?.id,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create Razorpay order");
      }

      const { order_id } = await res.json();

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: track?.priceINR * 100 || 0,
        currency: "INR",
        name: "EduVortexPro",
        description: `Certification: ${track?.title}`,
        order_id,
        handler: async (response: any) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                trackId: track?.id,
              }),
            });

            if (!verifyRes.ok) {
              const errData = await verifyRes.json().catch(() => ({}));
              setPaymentError(errData.error || "Payment signature verification failed");
              setIsProcessing(false);
              return;
            }

            setWebhookMessage("Razorpay payment verified. Enrollment created on server.");
            closeCheckout();
          } catch (err: any) {
            setPaymentError(err.message || "Payment verification failed");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: currentUser?.fullName || "Student",
          email: currentUser?.email || "",
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: () => {
            setPaymentError("Payment cancelled by user");
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setPaymentError(err.message || "Failed to initiate Razorpay payment");
      setIsProcessing(false);
    }
  };

  return (
    <div
      suppressHydrationWarning
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      style={{ display: shouldShow ? "block" : "none" }}
    >
      {shouldShow && (
        <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8 text-slate-900">
          {/* Close Button */}
          <button
            onClick={closeCheckout}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-indigo to-accent-cyan flex items-center justify-center text-white shadow-md shadow-accent-indigo/20">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">Enrollment & Checkout</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  DIRECT UPI & RAZORPAY
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pay with Razorpay or scan with any UPI App (GPay, PhonePe, Paytm, CRED).
              </p>
            </div>
          </div>

          {/* Payment Error */}
          {paymentError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{paymentError}</span>
            </div>
          )}

          {/* Two-Column Grid: Summary & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Order Summary */}
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-accent-indigo font-bold tracking-wider">
                  Certification Track
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {track?.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {track?.roleBadge} ({track?.modulesCount} Modules)
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Lifetime text curriculum & updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>5 MCQs per module with 80% passing unlock</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verifiable Certificate of Mastery & Verification ID</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Total Investment:</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {formatINR(track?.priceINR || 0)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Billing To</span>
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px] block">
                    {currentUser?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Payment Options */}
            <div className="space-y-4">
              {/* Razorpay Section */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-accent-indigo" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Razorpay Checkout</span>
                </div>

                <button
                  onClick={handleRazorpayPay}
                  disabled={isProcessing || !razorpayLoaded}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      Processing...
                    </span>
                  ) : razorpayLoaded ? (
                    <>
                      <Zap className="w-4 h-4" /> Pay via Razorpay
                    </>
                  ) : (
                    <span>Loading Razorpay...</span>
                  )}
                </button>
              </div>

              {/* UPI Section */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-accent-emerald" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Direct UPI Payment</span>
                </div>

                {/* UPI QR Code */}
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={qrImageUrl}
                    alt="UPI QR Code"
                    className="w-48 h-48 rounded-xl border border-slate-200 bg-white p-2"
                  />
                  <div className="mt-2 text-xs text-slate-500 font-mono">
                    Scan to pay {formatINR(track?.priceINR || 0)}
                  </div>
                </div>

                {/* UPI ID Field with Copy Button */}
                <div className="w-full">
                  <span className="text-[11px] text-slate-500 block mb-1">Copy UPI Merchant VPA:</span>
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-mono text-slate-800 font-bold truncate">
                      {DEFAULT_UPI_CONFIG.merchantVpa}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyVpa}
                      className="flex items-center gap-1 text-[11px] text-accent-indigo hover:text-indigo-800 font-bold ml-2 shrink-0"
                    >
                      {copiedVpa ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedVpa ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Transaction Reference / UTR Input */}
                <div className="w-full text-left">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Transaction Ref ID / UTR Number
                    </label>
                    <button
                      type="button"
                      onClick={handlePasteDemoUtr}
                      className="text-[10px] text-accent-indigo hover:underline font-mono font-bold"
                    >
                      Auto-fill Test UTR
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 12-digit UTR or UPI/2026/XXXX"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-accent-indigo"
                  />
                </div>

                <button
                  onClick={handleSimulateWebhookPayment}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Verify UTR & Unlock
                </button>
              </div>

              {/* Developer Integration Callout */}
              <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
                  // [RAZORPAY + UPI WEBHOOK VERIFICATION POINT] Ready for gateway webhook hookup
                </span>
                <span className="text-slate-400 hidden sm:inline font-bold">SHA256 HMAC</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
