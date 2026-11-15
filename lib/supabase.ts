import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client & Real-Time Connection
 * [SUPABASE INTEGRATION POINT]
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

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
