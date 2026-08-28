'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();
  const searchParams = useSearchParams();
  
  // Retrieve callback URL (where user was redirected from)
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await login(email.toLowerCase(), password);
      if (!result.ok) {
        toast.error(result.error || 'Invalid credentials');
        setLoading(false);
      } else {
        toast.success('Logged in successfully!');
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 1200);
      }
    } catch (err) {
      console.error('Credentials login error:', err);
      toast.error('An error occurred during sign-in.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const google = (window as any).google;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!google || !clientId) return;
    google.accounts.id.initialize({ client_id: clientId, callback: async ({ credential }: { credential: string }) => { const result = await googleLogin(credential); if (!result.ok) return toast.error(result.error || 'Google sign-in failed'); toast.success('Logged in successfully!'); router.push(callbackUrl); router.refresh(); } });
  }, [callbackUrl, googleLogin, router]);

  const handleGoogleLogin = () => {
    const google = (window as any).google;
    if (!google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return toast.error('Google sign-in is not configured yet.');
    google.accounts.id.prompt();
  };

  return (
    <div className="bg-white rounded-[32px] border border-maroon-100/50 p-8 sm:p-10 max-w-md w-full shadow-luxury relative animate-fadeUp">
      
      {/* Back Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-maroon-800 transition flex items-center gap-1.5"
      >
        <ArrowLeft size={13} /> Back
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
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon-950">Welcome Back</h1>
        <p className="text-xs text-gray-400 mt-1">Log in to your Jannat Elegance customer account</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        
        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-[10px] font-bold uppercase text-maroon-950 mb-1.5">Email Address</label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-maroon-100 outline-none focus:border-maroon-800 text-sm font-sans"
            />
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" />
          </div>
          {formErrors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{formErrors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="block text-[10px] font-bold uppercase text-maroon-950">Password</label>
            <Link href="/forgot-password" className="text-[10px] font-bold uppercase text-pink-650 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formErrors.password) setFormErrors(prev => ({ ...prev, password: '' }));
              }}
              placeholder="Enter your password"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-maroon-850 hover:bg-maroon-950 disabled:bg-maroon-300 text-white py-3.5 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg shadow-maroon-800/15 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-maroon-100/50" />
        <span className="px-3 text-[10px] font-bold uppercase text-gray-400">Or connect with</span>
        <div className="flex-grow h-px bg-maroon-100/50" />
      </div>

      {/* Google Login Trigger */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full border border-pink-500 bg-gradient-to-r from-rose-500 via-pink-600 to-fuchsia-700 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white transition flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 hover:-translate-y-0.5 hover:from-rose-600 hover:via-pink-700 hover:to-fuchsia-800 hover:shadow-xl"
      >
        <Chrome size={15} className="text-white" />
        Sign In with Google
      </button>

      <div className="text-center mt-6 text-xs text-gray-500 font-sans">
        New to Jannat Elegance?{' '}
        <Link href="/signup" className="text-pink-600 hover:text-pink-800 font-bold underline">
          Create Account
        </Link>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-[85vh] bg-[#fff8fa] flex items-center justify-center px-4 font-sans py-12">
      <Suspense fallback={
        <div className="text-center font-sans">
          <div className="w-10 h-10 border-4 border-maroon-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Loading secure checkpoint...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
