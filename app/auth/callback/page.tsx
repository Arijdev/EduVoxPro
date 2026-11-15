"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(errorDescription || error)}`);
      return;
    }

    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ data, error: exchangeError }) => {
          if (exchangeError || !data.session) {
            router.replace(
              `/login?error=${encodeURIComponent(
                exchangeError?.message || "OAuth session exchange failed"
              )}`
            );
            return;
          }
          router.replace("/dashboard");
        });
    } else {
      router.replace("/login?error=No authorization code received");
    }
  }, [router]);

  return null;
}
