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
import { supabase } from "@/lib/supabase";
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
    } catch {
      // Clipboard not available
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        throw new Error("Please log in again to continue with payment.");
      }

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
        name: "EduVoxPro",
        description: `Certification: ${track?.title}`,
        order_id,
        handler: async (response: any) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
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
      rzp.on("payment.failed", (resp: any) => {
        setIsProcessing(false);
        setPaymentError(resp?.error?.description || "Payment failed. Please try again.");
      });
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Card Payment */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-accent-indigo" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Card</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mb-1 border-b border-slate-100 pb-1">
                  Credit/Debit, Net Banking & Wallets
                </div>
                <button
                  onClick={handleRazorpayPay}
                  disabled={isProcessing || !razorpayLoaded}
                  className="w-full py-3 px-3 rounded-lg bg-gradient-to-r from-accent-indigo to-indigo-700 hover:from-indigo-500 hover:to-indigo-800 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-1.5 text-[10px]">
                      <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                      Pay
                    </span>
                  ) : razorpayLoaded ? (
                    <>
                      <CreditCard className="w-3.5 h-3.5" /> Pay with Card
                    </>
                  ) : (
                    <span className="text-[10px]">Loading...</span>
                  )}
                </button>
              </div>

              {/* Option 2: UPI Payment */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-accent-emerald" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">UPI</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mb-1 border-b border-slate-100 pb-1">
                  GPay, PhonePe, Paytm, CRED
                </div>
                <div className="flex-1 flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono font-bold">VPA:</span>
                    <span className="font-mono text-slate-800 truncate text-xs">{DEFAULT_UPI_CONFIG.merchantVpa}</span>
                  </div>
                  <button
                    onClick={handleCopyVpa}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-bold text-[10px] transition-colors hover:bg-slate-100"
                  >
                    {copiedVpa ? <Check className="w-3 h-3 text-accent-emerald" /> : <Copy className="w-3 h-3" />}
                    {copiedVpa ? " Copied" : " Copy VPA"}
                  </button>
                  <input
                    type="text"
                    placeholder="UTR / Transaction Ref"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-accent-indigo"
                  />
                </div>
                <button
                  onClick={handleSimulateWebhookPayment}
                  disabled={isProcessing}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-[10px] transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-emerald-500/20"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-1 text-[10px]">
                      <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Processing
                    </span>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" /> Verify & Unlock
                    </>
                  )}
                </button>
              </div>

              {/* Option 3: QR Code */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col items-center space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="w-4 h-4 text-accent-cyan" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">QR Code</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mb-1 border-b border-slate-100 pb-1">
                  Scan with any UPI app
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <img
                    src={qrImageUrl}
                    alt="UPI QR Code"
                    className="w-40 h-40 rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <div className="text-[10px] text-slate-500 font-mono text-center">
                    Scan to pay {formatINR(track?.priceINR || 0)}
                  </div>
                </div>
              </div>
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
      )}
    </div>
  );
};

