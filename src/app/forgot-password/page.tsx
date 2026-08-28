'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() })
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        toast.success('If an account exists, a password reset link has been sent.');
      } else {
        toast.error(data.error || 'Failed to request recovery link');
        setLoading(false);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-[#fff8fa] flex items-center justify-center px-4 font-sans py-12">
      <div className="bg-white rounded-[32px] border border-maroon-100/50 p-8 sm:p-10 max-w-md w-full shadow-luxury relative animate-fadeUp">
        
        {/* Back Link */}
        <Link
          href="/login"
          className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-maroon-800 transition flex items-center gap-1.5"
        >
          <ArrowLeft size={13} /> Back to Login
        </Link>

        {/* Header Logo */}
        <div className="text-center mt-4 mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-maroon-200 shadow-sm mx-auto relative mb-3">
            <Image
              src="/images/logo.jpeg"
              alt="Jannat Elegance Logo"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon-950">Reset Password</h1>
          <p className="text-xs text-gray-400 mt-1">We will send you a recovery link to access your account</p>
        </div>

        {submitted ? (
          <div className="text-center py-4 font-sans">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-serif text-xl font-medium text-maroon-950">Email Dispatched</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              If an account is associated with <strong>{email}</strong>, a secure password reset link has been sent. Check your inbox and spam folder.
            </p>
            <div className="mt-8 flex flex-col gap-2">
              <button
                onClick={() => setSubmitted(false)}
                className="w-full border border-maroon-200 text-maroon-850 hover:bg-maroon-50 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition"
              >
                Resend link
              </button>
              <Link
                href="/login"
                className="text-xs font-bold uppercase text-pink-650 hover:underline mt-2 inline-block"
              >
                Return to sign-in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase text-maroon-950 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your registered email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-maroon-100 outline-none focus:border-maroon-800 text-sm font-sans"
                />
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" />
              </div>
              {error && <p className="text-red-500 text-[10px] mt-1 font-bold">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon-850 hover:bg-maroon-950 disabled:bg-maroon-300 text-white py-3.5 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg shadow-maroon-800/15 transition flex items-center justify-center gap-2"
            >
              {loading ? 'Requesting Link...' : 'Request Reset Link'}
            </button>
          </form>
        )}

      </div>
    </main>
  );
}
