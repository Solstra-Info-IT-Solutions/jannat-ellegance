'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Form states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      toast.error('Missing or invalid password reset token.');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        toast.error(data.error || 'Failed to reset password');
        setLoading(false);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center py-8 font-sans">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ArrowLeft size={32} />
        </div>
        <h3 className="font-serif text-xl font-medium text-maroon-950">Invalid Reset Token</h3>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
          This password recovery link is invalid or has expired. Please request a new recovery link.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block bg-maroon-850 hover:bg-maroon-950 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition"
        >
          Request new link
        </Link>
      </div>
    );
  }

  return (
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
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon-950">Set New Password</h1>
        <p className="text-xs text-gray-400 mt-1">Enter your new secure password below to update your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-[10px] font-bold uppercase text-maroon-950 mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formErrors.password) setFormErrors(prev => ({ ...prev, password: '' }));
              }}
              placeholder="At least 8 characters"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-maroon-100 outline-none focus:border-maroon-800 text-sm font-sans"
            />
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-maroon-500 hover:text-maroon-700"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {formErrors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{formErrors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-[10px] font-bold uppercase text-maroon-950 mb-1.5">Confirm New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (formErrors.confirmPassword) setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Re-enter password"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-maroon-100 outline-none focus:border-maroon-800 text-sm font-sans"
            />
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" />
          </div>
          {formErrors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 font-bold">{formErrors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-maroon-850 hover:bg-maroon-950 disabled:bg-maroon-300 text-white py-3.5 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg shadow-maroon-800/15 transition flex items-center justify-center gap-2"
        >
          <ShieldCheck size={14} />
          {loading ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>

    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-[85vh] bg-[#fff8fa] flex items-center justify-center px-4 font-sans py-12">
      <Suspense fallback={
        <div className="text-center font-sans">
          <div className="w-10 h-10 border-4 border-maroon-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Loading secure checkpoint...
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
