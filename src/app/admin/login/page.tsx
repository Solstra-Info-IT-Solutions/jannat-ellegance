'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock, Mail, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const { user, status, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && user?.role === 'admin') window.location.assign('/admin');
  }, [user, status]);

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (!result.ok) {
      setError(result.error || 'Invalid email or password.');
      setLoading(false);
      return;
    }

    const signedInUser = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' }).then((response) => response.json());
    if (signedInUser?.user?.role !== 'admin') {
      await logout();
      window.location.assign('/?unauthorized=1');
      return;
    }
    window.location.assign('/admin');
  }

  return (
    <main className="min-h-[85vh] bg-[#fff8fa] flex items-center justify-center px-4 py-12 font-sans">
      <div className="bg-white rounded-[32px] border border-maroon-100/50 p-8 sm:p-10 max-w-md w-full shadow-luxury relative animate-fadeUp">
        <Link href="/" className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-maroon-800 transition flex items-center gap-1.5"><ArrowLeft size={13} /> Home</Link>
        <div className="text-center mt-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-maroon-200 shadow-sm mx-auto relative mb-3"><Image src="/images/logo.jpeg" alt="Jannat Elegance Logo" fill className="object-cover" /></div>
          <h1 className="font-serif text-2xl font-semibold text-maroon-950">Jannat Admin</h1>
          <p className="text-[10px] text-pink-650 tracking-[3px] uppercase font-bold mt-0.5">Secure staff sign-in</p>
        </div>
        {error && <div role="alert" className="bg-[#fff0f3] border border-maroon-100 rounded-xl p-3 mb-5 text-xs text-maroon-900 font-bold text-center">{error}</div>}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <label className="block text-[10px] font-bold uppercase text-maroon-950">Email<span className="relative block mt-1.5"><Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" /><input required autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="staff@jannatelegance.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-maroon-100 outline-none focus:border-maroon-800 text-sm font-normal" /></span></label>
          <label className="block text-[10px] font-bold uppercase text-maroon-950">Password<span className="relative block mt-1.5"><Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" /><input required autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-maroon-100 outline-none focus:border-maroon-800 text-sm font-normal" /></span></label>
          <button type="submit" disabled={loading} className="w-full mt-6 bg-maroon-850 hover:bg-maroon-950 disabled:bg-maroon-300 text-white py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg shadow-maroon-800/15 transition flex items-center justify-center gap-2"><ShieldCheck size={14} /> {loading ? 'Authorizing…' : 'Enter Console'}</button>
        </form>
      </div>
    </main>
  );
}
