/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ["images.unsplash.com", "api.qrserver.com"],
  },
  async headers() {
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      "https://checkout.razorpay.com",
      "https://cdn.razorpay.com",
      "https://*.razorpay.com",
      "https://api.qrserver.com",
    ];

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc.join(" ")}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://images.unsplash.com https://api.qrserver.com data:",
              "connect-src 'self' https://*.supabase.co https://*.razorpay.com https://lumberjack.razorpay.com",
              "frame-src 'self' https://api.razorpay.com https://*.razorpay.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "accelerometer=(self \"https://api.razorpay.com\" \"https://*.razorpay.com\"), gyroscope=(self \"https://api.razorpay.com\"), magnetometer=(), camera=(), microphone=(), geolocation=(), payment=(self \"https://api.razorpay.com\" \"https://*.razorpay.com\")",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
