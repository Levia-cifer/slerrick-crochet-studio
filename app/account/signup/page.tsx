'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    });
    setLoading(false);
    if (error) return setError(error.message);
    router.push('/account');
  };

  return (
    <div className="px-4 py-12 max-w-sm mx-auto">
      <h1 className="font-display text-2xl font-semibold mb-6">Create Your Account</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required placeholder="Full Name" className="input"
          value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input required type="email" placeholder="Email" className="input"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password" className="input"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-berry-dark text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-berry text-white py-3 rounded-xl2 font-semibold">
          {loading ? 'Creating…' : 'Sign Up'}
        </button>
      </form>
      <p className="text-sm text-plum/60 mt-4">
        Already have an account? <Link href="/account/login" className="text-berry font-semibold">Log in</Link>
      </p>
    </div>
  );
}
