import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { TRACKS } from "@/data/curriculum";

export async function POST(req: Request) {
  try {
    // Rate limiting: 10 orders per minute per IP
    const ip = getClientIp(req);
    const rl = rateLimit(ip, 10, 60000);
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

    const { amount, currency = "INR", receipt, trackId } = await req.json();

    const amountPaise = Number(amount);
    if (!Number.isInteger(amountPaise) || amountPaise < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Amount must be an integer in paise (minimum ₹1.00)." },
        { status: 400 }
      );
    }

    if (!trackId || typeof trackId !== "string") {
      return NextResponse.json({ error: "Track is required." }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Payment gateway is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Resolve track: prefer DB, fallback to local curriculum (handles unseeded DB)
    let trackPriceINR: number | null = null;
    let trackIsFree = false;
    const { data: dbTrack } = await supabase
      .from("tracks")
      .select("id, price_inr, is_free")
      .eq("id", trackId)
      .maybeSingle();

    if (dbTrack) {
      trackPriceINR = Number(dbTrack.price_inr);
      trackIsFree = !!dbTrack.is_free;
    } else {
      const localTrack = TRACKS.find((t) => t.id === trackId);
      if (localTrack) {
        trackPriceINR = localTrack.priceINR;
        trackIsFree = localTrack.isFree;
      }
    }

    if (trackPriceINR == null || !Number.isFinite(trackPriceINR)) {
      return NextResponse.json({ error: "Invalid or unavailable track." }, { status: 400 });
    }

    if (trackIsFree || trackPriceINR <= 0) {
      return NextResponse.json({ error: "This track does not require payment." }, { status: 400 });
    }

    const expectedAmount = Math.round(trackPriceINR * 100); // paise
    if (amountPaise !== expectedAmount) {
      return NextResponse.json(
        { error: `Amount mismatch. Expected ₹${trackPriceINR} for this track.` },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency,
      receipt: String(receipt || `rcpt_${Date.now()}`).slice(0, 40),
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: any) {
    if (err?.statusCode === 401 || err?.statusCode === 403) {
      return NextResponse.json(
        { error: "Payment gateway authentication failed." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: err?.error?.description || err?.message || "Failed to create payment order." },
      { status: 500 }
    );
  }
}
