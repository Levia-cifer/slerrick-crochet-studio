'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';

const REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta',
  'Northern', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo',
  'Western North', 'Oti', 'Savannah', 'North East',
];

export default function CheckoutPage() {
  const { items, subtotal, refresh } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '', phoneNumber: '', whatsappNumber: '', region: '', town: '',
    exactLocation: '', landmark: '', deliveryNotes: '',
    paymentReference: '', payerNumber: '', payerName: '',
  });

  const set = (key: string) => (e: any) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong. Please try again.');
      setSubmitting(false);
      return;
    }
    await refresh();
    router.push(`/order-confirmation?order=${data.orderNumber}`);
  };

  if (items.length === 0) {
    return <p className="p-6 text-center text-plum/60">Your cart is empty.</p>;
  }

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-semibold mb-6">Checkout</h1>

      {/* Payment instructions */}
      <div className="bg-blush rounded-xl2 p-4 mb-6">
        <p className="font-semibold text-sm mb-1">1. Send payment via MTN Mobile Money</p>
        <p className="text-sm">Number: <span className="font-semibold">0549 402 696</span></p>
        <p className="text-sm">Name: <span className="font-semibold">Delali Serwa / Slerrick</span></p>
        <p className="text-sm mt-2">Amount: <span className="font-semibold text-berry">GH₵{subtotal.toFixed(2)}</span></p>
        <p className="text-xs text-plum/60 mt-2">
          Once sent, fill in the reference number and details below to submit your order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="space-y-3">
          <legend className="font-semibold text-sm mb-1">Delivery details</legend>
          <input required placeholder="Full Name" value={form.fullName} onChange={set('fullName')} className="input" />
          <input required placeholder="Phone Number" value={form.phoneNumber} onChange={set('phoneNumber')} className="input" />
          <input placeholder="WhatsApp Number (if different)" value={form.whatsappNumber} onChange={set('whatsappNumber')} className="input" />
          <select required value={form.region} onChange={set('region')} className="input">
            <option value="">Select Region</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <input required placeholder="Town/City" value={form.town} onChange={set('town')} className="input" />
          <input required placeholder="Exact Delivery Location" value={form.exactLocation} onChange={set('exactLocation')} className="input" />
          <input placeholder="Landmark" value={form.landmark} onChange={set('landmark')} className="input" />
          <textarea placeholder="Additional Delivery Notes" value={form.deliveryNotes} onChange={set('deliveryNotes')} className="input" rows={2} />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-semibold text-sm mb-1">Payment verification</legend>
          <input required placeholder="Payment Reference / Transaction ID" value={form.paymentReference} onChange={set('paymentReference')} className="input" />
          <input required placeholder="Number you paid from" value={form.payerNumber} onChange={set('payerNumber')} className="input" />
          <input required placeholder="Name on that MoMo account" value={form.payerName} onChange={set('payerName')} className="input" />
        </fieldset>

        {error && <p className="text-berry-dark text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-berry text-white py-3 rounded-xl2 font-semibold shadow-soft disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
}
