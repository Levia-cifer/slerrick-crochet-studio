import { createBrowserClient } from '@supabase/ssr';

// Public keys only — safe to expose. Security comes from Row Level Security
// policies (see supabase/schema.sql), not from hiding these values.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
