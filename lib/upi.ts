/**
 * UPI Payment Engine & Webhook Verification Layer
 * 
 * [UPI WEBHOOK VERIFICATION POINT]
 * This module handles:
 * 1. Building compliant UPI Deep Links (upi://pay?...)
 * 2. Generating dynamic QR codes for GPay, PhonePe, Paytm, CRED
 * 3. Handling simulated webhook callbacks and structuring production webhook endpoints
 */

export interface UPIConfig {
  merchantVpa: string;
  merchantName: string;
}

export const DEFAULT_UPI_CONFIG: UPIConfig = {
  merchantVpa: "eduvox.mastery@icici",
  merchantName: "EduVox Pro Tech Certifications",
};

export interface UPIOrderPayload {
  trackId: string;
  trackTitle: string;
  amountINR: number;
  userId: string;
  userEmail: string;
  transactionRef: string;
}

export function buildUPIDeepLink(payload: UPIOrderPayload, config: UPIConfig = DEFAULT_UPI_CONFIG): string {
  const note = `Certification: ${payload.trackTitle.substring(0, 20)}`;
  const params = new URLSearchParams({
    pa: config.merchantVpa,
    pn: config.merchantName,
    am: payload.amountINR.toString(),
    cu: "INR",
    tn: note,
    tr: payload.transactionRef,
  });

  return `upi://pay?${params.toString()}`;
}

export function generateUPIQrUrl(payload: UPIOrderPayload, config: UPIConfig = DEFAULT_UPI_CONFIG): string {
  const deepLink = buildUPIDeepLink(payload, config);
  // Using public high-availability QR image generation for instant testing without server overhead
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(deepLink)}&bgcolor=ffffff&color=090d16&margin=10`;
}

/**
 * [UPI WEBHOOK VERIFICATION POINT]
 * In production, your payment gateway (Razorpay / Cashfree / PhonePe / Decentro) calls an API route
 * like `/api/webhooks/upi` with a signed HMAC payload.
 * 
 * Example server-side verification:
 * ```ts
 * import crypto from 'crypto';
 * 
 * export async function POST(req: Request) {
 *   const signature = req.headers.get('x-webhook-signature');
 *   const body = await req.text();
 *   const expectedSignature = crypto
 *     .createHmac('sha256', process.env.PAYMENT_WEBHOOK_SECRET!)
 *     .update(body)
 *     .digest('hex');
 * 
 *   if (signature !== expectedSignature) {
 *     return new Response('Invalid Signature', { status: 401 });
 *   }
 * 
 *   const event = JSON.parse(body);
 *   if (event.status === 'PAYMENT_SUCCESS') {
 *     // Unlock track in Supabase:
 *     // await supabase.from('enrollments').insert({ ... })
 *   }
 * }
 * ```
 */
export async function simulateUPIWebhookVerification(payload: UPIOrderPayload): Promise<{
  success: boolean;
  paymentId: string;
  timestamp: string;
  message: string;
}> {
  console.log("[UPI WEBHOOK VERIFICATION POINT] Simulating incoming payment gateway webhook...", payload);

  // Simulate network roundtrip latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const paymentId = `PAY-UPI-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return {
    success: true,
    paymentId,
    timestamp: new Date().toISOString(),
    message: `Payment of ₹${payload.amountINR} confirmed via UPI gateway webhook. Transaction ID: ${payload.transactionRef}`,
  };
}
