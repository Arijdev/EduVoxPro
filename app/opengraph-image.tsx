import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "EduVoxPro - Engineering Certifications & Verifiable Credentials";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: "#0B1220",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            E
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em" }}>
            EduVoxPro
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            Engineering Certifications &amp; Verifiable Credentials
          </div>
          <div style={{ fontSize: 28, color: "#94A3B8", maxWidth: 880 }}>
            Structured 7–10 module tracks, rigorous 80% assessments, and
            instantly verifiable certificates.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: "#2563EB",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Start free
          </div>
          <div style={{ fontSize: 24, color: "#CBD5E1" }}>www.eduvoxpro.in</div>
        </div>
      </div>
    ),
    size
  );
}