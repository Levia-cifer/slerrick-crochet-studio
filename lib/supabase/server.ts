import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Used in server components / route handlers for logged-in reads/writes
// under RLS (as the visiting user, not as admin).
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Parameters<typeof cookieStore.set>[2] }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// Admin-only client — uses the SERVICE ROLE key, which bypasses RLS.
// NEVER import this into any client component. Server-side only
// (admin dashboard route handlers). Set SUPABASE_SERVICE_ROLE_KEY as a
// server-only env var (no NEXT_PUBLIC_ prefix) so it's never bundled
// into browser code.
export function createAdminClient() {
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
