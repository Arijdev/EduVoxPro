import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client & Real-Time Connection
 * [SUPABASE INTEGRATION POINT]
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ulwxniobhvykxtinbywn.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_gzPFE0T4hm9o7ZJwlXR8og_yWHt-zaR";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface SupabaseUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface SupabaseSession {
  user: SupabaseUser;
  accessToken: string;
}
