import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, trackId } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    if (!trackId) {
      return NextResponse.json({ error: "trackId is required" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    // Verify track exists and get price for enrollment record
    const { data: track, error: trackError } = await supabase
      .from("tracks")
      .select("price_inr")
      .eq("id", trackId)
      .single();

    if (trackError || !track) {
      return NextResponse.json({ error: "Invalid track" }, { status: 400 });
    }

    // Insert enrollment server-side (fulfillment)
    const { error: enrollError } = await supabase.from("enrollments").insert({
      user_id: user.id,
      track_id: trackId,
      status: "active",
      payment_reference: razorpay_order_id,
      amount_paid_inr: track.price_inr,
      enrolled_at: new Date().toISOString(),
    });

    if (enrollError) {
      return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and enrollment created",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
