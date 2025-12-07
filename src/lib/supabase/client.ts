// Client-side Supabase client (untuk browser)
// Digunakan di Client Components yang ada 'use client'
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Export singleton instance untuk convenience
export const supabase = createClient();