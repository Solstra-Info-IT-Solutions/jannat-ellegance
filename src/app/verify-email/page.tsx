'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setLoading(true); try { const response = await fetch('/api/auth/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code }) }); const data = await response.json(); if (!response.ok) return toast.error(data.error || 'Invalid code'); toast.success('Email verified. You can now log in.'); router.push('/login'); } finally { setLoading(false); } };
  return <main className="min-h-[80vh] bg-[#fff8fa] px-4 py-16"><form onSubmit={submit} className="mx-auto max-w-md rounded-[32px] border border-maroon-100 bg-white p-8 shadow-luxury"><h1 className="font-serif text-3xl text-maroon-950">Verify your email</h1><p className="mt-2 text-sm text-gray-500">We sent a six-digit code to {email || 'your email address'}.</p><input required inputMode="numeric" maxLength={6} pattern="[0-9]{6}" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} className="mt-6 w-full rounded-xl border border-maroon-200 px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-maroon-800" placeholder="000000" /><button disabled={loading} className="mt-5 w-full rounded-full bg-maroon-850 py-3 text-xs font-bold uppercase tracking-wider text-white">{loading ? 'Verifying…' : 'Verify email'}</button><Link href="/signup" className="mt-5 block text-center text-xs font-bold text-maroon-800 underline">Back to sign up</Link></form></main>;
}

export default function VerifyEmailPage() { return <Suspense><VerifyEmailForm /></Suspense>; }
