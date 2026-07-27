import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase/server';

export default async function AdminHome() {
  await requireAdmin();
  const admin = createAdminClient();

  const [{ count: productCount }, { count: pendingCount }] = await Promise.all([
    admin.from('products').select('*', { count: 'exact', head: true }),
    admin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'awaiting_verification'),
  ]);

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl2 shadow-soft p-4">
          <p className="text-plum/50 text-xs">Products</p>
          <p className="text-2xl font-semibold">{productCount ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl2 shadow-soft p-4">
          <p className="text-plum/50 text-xs">Awaiting Verification</p>
          <p className="text-2xl font-semibold text-berry">{pendingCount ?? 0}</p>
        </div>
      </div>
      <div className="space-y-3">
        <Link href="/admin/products" className="block bg-berry text-white text-center py-3 rounded-xl2 font-semibold">
          Manage Products
        </Link>
        <Link href="/admin/orders" className="block bg-plum text-white text-center py-3 rounded-xl2 font-semibold">
          View Orders
        </Link>
      </div>
    </div>
  );
}
