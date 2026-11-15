"use client";

import React, { useState } from "react";
import { 
  X, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  CreditCard
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/utils";
import { 
  DEFAULT_UPI_CONFIG, 
  generateUPIQrUrl, 
  simulateUPIWebhookVerification 
} from "@/lib/upi";

export const CheckoutModal: React.FC = () => {
  const { activeCheckoutTrack, closeCheckout, enrollTrack, user } = useApp();
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState<string | null>(null);

  if (!activeCheckoutTrack || !user) return null;

  const orderPayload = {
    trackId: activeCheckoutTrack.id,
    trackTitle: activeCheckoutTrack.title,
    amountINR: activeCheckoutTrack.priceINR,
    userId: user.id,
    userEmail: user.email,
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
    setIsProcessing(true);
    setWebhookMessage("Dispatched UPI Webhook Event to Server...");

    try {
      await simulateUPIWebhookVerification(orderPayload);
      setWebhookMessage("Webhook Verified: Unlocking Course & Generating State...");
      await enrollTrack(activeCheckoutTrack, orderPayload.transactionRef);
    } catch (err) {
      setWebhookMessage("Webhook verification failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
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
              <h2 className="text-xl font-black text-slate-900">Enrollment & Direct UPI Checkout</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                ZERO GATEWAY FEE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Scan with any UPI App (GPay, PhonePe, Paytm, CRED) or trigger test simulation.
            </p>
          </div>
        </div>

        {/* Two-Column Grid: Summary & UPI Scanner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Order Summary */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-accent-indigo font-bold tracking-wider">
                Certification Track
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {activeCheckoutTrack.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeCheckoutTrack.roleBadge} ({activeCheckoutTrack.modulesCount} Modules)
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
                  {formatINR(activeCheckoutTrack.priceINR)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Billing To</span>
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px] block">
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct UPI Payment Box */}
          <div className="space-y-4 flex flex-col items-center text-center">
            {/* Dynamic QR Code Card */}
            <div className="relative p-2.5 rounded-2xl bg-white shadow-md border border-slate-200">
              <img
                src={qrImageUrl}
                alt="Direct UPI QR Code"
                className="w-44 h-44 object-contain rounded-lg"
              />
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                <QrCode className="w-3 h-3 text-accent-cyan" />
                <span>UPI FastScan</span>
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
          </div>
        </div>

        {/* Status Message */}
        {webhookMessage && (
          <div className="mt-4 p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-accent-indigo text-xs flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
            <span>{webhookMessage}</span>
          </div>
        )}

        {/* Action Buttons: Simulator & Submit */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleSimulateWebhookPayment}
            disabled={isProcessing}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-accent-indigo hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all active:scale-98 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2 text-white font-bold">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Triggering Webhook...
              </span>
            ) : (
              <>
                <Zap className="w-4 h-4 text-white fill-current" />
                <span>Simulate Payment Success (Webhook Trigger)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSimulateWebhookPayment}
            disabled={isProcessing}
            className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            Verify UTR & Unlock
          </button>
        </div>

        {/* Developer Integration Callout */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
            // [UPI WEBHOOK VERIFICATION POINT] Ready for gateway webhook hookup
          </span>
          <span className="text-slate-400 hidden sm:inline font-bold">SHA256 HMAC</span>
        </div>
      </div>
    </div>
  );
};
