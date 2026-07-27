import { requireAdmin } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase/server';
import { updateOrderStatus } from './actions';

const STATUSES = ['awaiting_verification', 'paid', 'processing', 'delivered', 'cancelled'];
const LABELS: Record<string, string> = {
  awaiting_verification: 'Awaiting Verification',
  paid: 'Paid',
  processing: 'Processing',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default async function AdminOrdersPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: orders } = await admin
    .from('orders')
    .select('*, order_items(product_name, color, quantity, unit_price)')
    .order('created_at', { ascending: false });

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-semibold mb-6">Orders</h1>
      <div className="space-y-4">
        {orders?.map((o: any) => (
          <div key={o.id} className="bg-white rounded-xl2 shadow-soft p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{o.order_number}</p>
                <p className="text-xs text-plum/50">{new Date(o.created_at).toLocaleString()}</p>
              </div>
              <span className="text-berry font-semibold">GH₵{Number(o.subtotal).toFixed(2)}</span>
            </div>

            <div className="text-sm space-y-1 mb-3">
              <p><span className="text-plum/50">Deliver to:</span> {o.full_name}, {o.phone_number}</p>
              <p>{o.exact_location}, {o.town}, {o.region}{o.landmark ? ` — near ${o.landmark}` : ''}</p>
              {o.delivery_notes && <p className="text-plum/60 italic">"{o.delivery_notes}"</p>}
            </div>

            <div className="bg-blush rounded-lg p-3 text-sm mb-3">
              <p className="font-medium text-xs mb-1">Payment to verify:</p>
              <p>Ref: <span className="font-semibold">{o.payment_reference}</span></p>
              <p>Paid from: {o.payer_number} ({o.payer_name})</p>
            </div>

            <div className="text-sm mb-3">
              {o.order_items.map((it: any, idx: number) => (
                <p key={idx}>{it.quantity}× {it.product_name}{it.color ? ` (${it.color})` : ''}</p>
              ))}
            </div>

            <form action={async (fd: FormData) => {
              'use server';
              await updateOrderStatus(o.id, String(fd.get('status')));
            }}>
              <select name="status" defaultValue={o.status} className="input text-sm"
                onChange={(e) => e.currentTarget.form?.requestSubmit()}>
                {STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
              </select>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
