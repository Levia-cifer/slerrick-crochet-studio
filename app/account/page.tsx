import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AccountClient from './account-client';

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/account/login?next=/account');

  const { data: orders } = await supabase
    .from('orders')
    .select('order_number, subtotal, status, created_at')
    .order('created_at', { ascending: false });

  return <AccountClient email={user.email!} orders={orders ?? []} />;
}
