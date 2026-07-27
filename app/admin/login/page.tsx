'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword(form);
    setLoading(false);
    if (error) return setError(error.message);
    router.push('/admin');
  };

  return (
    <div className="px-4 py-16 max-w-sm mx-auto">
      <h1 className="font-display text-2xl font-semibold mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required type="email" placeholder="Admin email" className="input"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password" className="input"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-berry-dark text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-plum text-white py-3 rounded-xl2 font-semibold">
          {loading ? 'Logging in…' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
