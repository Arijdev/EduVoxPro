import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { TRACKS } from "@/data/curriculum";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

function safeEqualHex(a: string, b: string): boolean {
  if (!/^[a-f0-9]+$/i.test(a) || !/^[a-f0-9]+$/i.test(b)) return false;
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length === 0 || bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  try {
    // Rate limiting: 20 verification attempts per minute per IP
    const ip = getClientIp(req);
    const rl = rateLimit(ip, 20, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnon) {
      return NextResponse.json(
        { error: "Service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnon, {
      auth: { persistSession: false },
      global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in again." },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }
    const payload =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : null;
    if (!payload) {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const razorpay_order_id = payload.razorpay_order_id;
    const razorpay_payment_id = payload.razorpay_payment_id;
    const razorpay_signature = payload.razorpay_signature;
    const trackId = payload.trackId;

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !/^order_[A-Za-z0-9]+$/.test(razorpay_order_id) ||
      !/^pay_[A-Za-z0-9]+$/.test(razorpay_payment_id) ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
      return NextResponse.json(
        { error: "Invalid payment verification details." },
        { status: 400 }
      );
    }

    if (!trackId || typeof trackId !== "string" || !/^[a-z0-9_-]{1,64}$/i.test(trackId)) {
      return NextResponse.json({ error: "Invalid track." }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: "Payment gateway is not configured." },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (!safeEqualHex(generatedSignature, razorpay_signature)) {
      return NextResponse.json(
        { error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    // Resolve track price for enrollment record (DB or local fallback)
    let amountPaidINR = 0;
    const { data: dbTrack } = await supabase
      .from("tracks")
      .select("price_inr")
      .eq("id", trackId)
      .maybeSingle();
    if (dbTrack) {
      amountPaidINR = Number(dbTrack.price_inr) || 0;
    } else {
      const localTrack = TRACKS.find((t) => t.id === trackId);
      if (!localTrack) {
        return NextResponse.json({ error: "Invalid track." }, { status: 400 });
      }
      amountPaidINR = localTrack.priceINR;
    }

    // Insert enrollment server-side (fulfillment). Omit id to let DB default (uuid/text) apply.
    const { error: enrollError } = await supabase.from("enrollments").insert({
      user_id: user.id,
      track_id: trackId,
      status: "active",
      payment_reference: razorpay_order_id,
      amount_paid_inr: amountPaidINR,
      enrolled_at: new Date().toISOString(),
    });

    if (enrollError) {
      // Ignore duplicate enrollment; treat as success if already enrolled
      const msg = String(enrollError.message || "").toLowerCase();
      const code = String((enrollError as any).code || "");
      if (code !== "23505" && !msg.includes("duplicate") && !msg.includes("unique")) {
        return NextResponse.json(
          { error: "Enrollment could not be completed. Please contact support." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and enrollment created",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch {
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 500 }
    );
  }
}
