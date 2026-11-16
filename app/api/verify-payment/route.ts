import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { TRACKS } from "@/data/curriculum";

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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { persistSession: false },
        global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in again." }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, trackId } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification details." },
        { status: 400 }
      );
    }

    if (!trackId || typeof trackId !== "string") {
      return NextResponse.json({ error: "Track is required." }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Payment gateway is not configured." }, { status: 500 });
    }

    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
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
          { error: enrollError.message || "Enrollment failed. Please contact support." },
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
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}
