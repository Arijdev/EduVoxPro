import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { TRACKS } from "@/data/curriculum";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

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

    const amount = payload.amount;
    const currency = typeof payload.currency === "string" ? payload.currency : "INR";
    const receipt = payload.receipt;
    const trackId = payload.trackId;

    if (currency !== "INR") {
      return NextResponse.json({ error: "Unsupported currency." }, { status: 400 });
    }

    const amountPaise = Number(amount);
    if (!Number.isInteger(amountPaise) || amountPaise < 100 || amountPaise > 10_000_000) {
      return NextResponse.json(
        { error: "Invalid amount." },
        { status: 400 }
      );
    }

    if (!trackId || typeof trackId !== "string" || !/^[a-z0-9_-]{1,64}$/i.test(trackId)) {
      return NextResponse.json({ error: "Invalid track." }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
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
        { error: "Amount mismatch for the selected track." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const safeReceipt =
      typeof receipt === "string" && receipt.length > 0
        ? receipt.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40)
        : `rcpt_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency,
      receipt: safeReceipt || `rcpt_${Date.now()}`,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create payment order." },
      { status: 500 }
    );
  }
}
