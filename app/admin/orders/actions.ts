'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase/server';

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from('orders').update({ status }).eq('id', orderId);
  revalidatePath('/admin/orders');
}
