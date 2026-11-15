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
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(errorDescription || error)}`);
      return;
    }

    // Supabase handles OAuth code exchange internally via cookies on its /auth/v1/callback
    // endpoint, then redirects here. Just check if a session now exists.
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError || !session) {
        router.replace("/login?error=No authorization code received");
        return;
      }
      router.replace("/dashboard");
    });
  }, [router]);

  return null;
}
