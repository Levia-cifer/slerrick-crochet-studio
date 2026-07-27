import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Simple MVP admin check: only this email can reach /admin/* pages.
// Swap for a proper roles table later if you ever add more admins.
const ADMIN_EMAIL = 'delaliserwa@gmail.com';

export async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/admin/login');
  }
  return user;
}
