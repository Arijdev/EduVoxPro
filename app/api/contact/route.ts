import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const payload =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : null;
    if (!payload) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Honeypot: silently discard if populated
    const company = typeof payload.company === "string" ? payload.company : "";
    if (company.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    const token = typeof payload.turnstileToken === "string" ? payload.turnstileToken : "";
    const ok = await verifyTurnstileToken({
      token,
      ip,
      expectedAction: "contact",
    });
    if (!ok) {
      return NextResponse.json(
        { error: "Verification failed. Please confirm you are human and try again." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to verify request." }, { status: 500 });
  }
}
