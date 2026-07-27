'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const STATUS_LABELS: Record<string, string> = {
  awaiting_verification: 'Awaiting Verification',
  paid: 'Paid',
  processing: 'Processing',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function AccountClient({ email, orders }: { email: string; orders: any[] }) {
  const supabase = createClient();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setMessage(error ? error.message : 'Password updated!');
    setNewPassword('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-semibold mb-1">My Account</h1>
      <p className="text-plum/60 text-sm mb-8">{email}</p>

      <h2 className="font-semibold mb-3">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-plum/50 text-sm mb-8">No orders yet.</p>
      ) : (
        <div className="space-y-2 mb-8">
          {orders.map((o) => (
            <div key={o.order_number} className="bg-white rounded-xl2 shadow-soft p-3 flex justify-between text-sm">
              <div>
                <p className="font-medium">{o.order_number}</p>
                <p className="text-plum/50 text-xs">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-berry">GH₵{Number(o.subtotal).toFixed(2)}</p>
                <p className="text-xs text-plum/60">{STATUS_LABELS[o.status]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-semibold mb-3">Change Password</h2>
      <form onSubmit={handlePasswordChange} className="space-y-3">
        <input
          type="password"
          required
          placeholder="New password"
          className="input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {message && <p className="text-sm text-berry-dark">{message}</p>}
        <button className="w-full bg-berry text-white py-3 rounded-xl2 font-semibold">Update Password</button>
      </form>

      <button onClick={handleLogout} className="mt-8 text-sm text-plum/50 underline">
        Log out
      </button>
    </div>
  );
}
