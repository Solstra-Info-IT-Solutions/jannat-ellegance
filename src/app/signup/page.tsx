'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && formData.phone.length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password
        })
      });

      const data = await res.json();

      if (data.success) {
        const otpResponse = await fetch('/api/auth/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email }) });
        if (!otpResponse.ok) {
          toast.success('Account created successfully.');
          toast.error('Verification email could not be sent. Configure a verified Resend sender before using email verification features.');
          router.push('/login');
          return;
        }
        toast.success('Account created. Check your email for the verification code.');
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast.error(data.error || 'Failed to create account');
        setLoading(false);
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[90vh] bg-[#fff8fa] flex items-center justify-center px-4 font-sans py-12">
      <div className="bg-white rounded-[32px] border border-maroon-100/50 p-8 sm:p-10 max-w-lg w-full shadow-luxury relative animate-fadeUp">
        
        {/* Back link */}
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
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon-950">Create Account</h1>
          <p className="text-xs text-gray-400 mt-1">Join Jannat Elegance to manage orders and favorites</p>
        </div>

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-[10px] font-bold uppercase text-maroon-950 mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Priya Patel"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-maroon-100 outline-none focus:border-maroon-800 text-sm font-sans"
              />
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" />
            </div>
            {formErrors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{formErrors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-[10px] font-bold uppercase text-maroon-950 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. customer@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-maroon-100 outline-none focus:border-maroon-800 text-sm font-sans"
              />
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" />
            </div>
            {formErrors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{formErrors.email}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-[10px] font-bold uppercase text-maroon-950 mb-1.5">Phone Number (Optional)</label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. 9876543210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-maroon-100 outline-none focus:border-maroon-800 text-sm font-sans"
              />
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" />
            </div>
            {formErrors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold">{formErrors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-[10px] font-bold uppercase text-maroon-950 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
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
            <label htmlFor="confirmPassword" className="block text-[10px] font-bold uppercase text-maroon-950 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
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
            Create Account
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-gray-500 font-sans">
          Already have an account?{' '}
          <Link href="/login" className="text-pink-600 hover:text-pink-800 font-bold underline">
            Log In
          </Link>
        </div>

      </div>
    </main>
  );
}
