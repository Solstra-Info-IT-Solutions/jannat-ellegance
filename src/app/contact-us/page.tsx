'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export default function ContactPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(data.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (data.phone.trim() && !phoneRegex.test(data.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!data.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (data.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (data.message.trim().length > 1000) {
      newErrors.message = 'Message must be under 1000 characters';
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#4a0e17] py-12 sm:py-16 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-pink-100/70 hover:text-pink-300 transition mb-8"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <article className="bg-[#5a1420] rounded-[32px] border border-pink-100/10 p-8 sm:p-12 shadow-xl space-y-8 text-pink-100/90">
          <div className="border-b border-pink-100/10 pb-4">
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Contact Us
            </h1>
            <p className="text-xs text-pink-100/50 mt-2">
              We&apos;d love to hear from you
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-pink-300" />
                <a
                  href="https://www.google.com/maps?q=28.57,77.32"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-100/80 hover:text-pink-300 transition-colors">
                  JANNAT ELEGANCE, Noida, India
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-pink-300 shrink-0" />
                <a href="tel:+918810330687" className="text-pink-100/80 hover:text-pink-300 transition">
                  +91 88103 30687
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-pink-300 shrink-0" />
                <a href="mailto:jannatelegance05@gmail.com" className="text-pink-100/80 hover:text-pink-300 transition">
                  jannatelegance05@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-400/30 text-green-300 text-sm font-medium px-4 py-3 rounded-2xl">
              <CheckCircle2 size={18} />
              Thank you! Your message has been sent successfully.
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-400/30 text-red-300 text-sm font-medium px-4 py-3 rounded-2xl">
              Something went wrong. Please try again later.
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-white mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-pink-100/30 outline-none transition focus:ring-2 focus:ring-pink-300/50 ${
                  errors.name ? 'border-red-400/60' : 'border-pink-100/20'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-300 mt-1.5">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-pink-100/30 outline-none transition focus:ring-2 focus:ring-pink-300/50 ${
                  errors.email ? 'border-red-400/60' : 'border-pink-100/20'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-300 mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-white mb-2"
              >
                Phone Number <span className="text-pink-100/40 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="98765 43210"
                className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-pink-100/30 outline-none transition focus:ring-2 focus:ring-pink-300/50 ${
                  errors.phone ? 'border-red-400/60' : 'border-pink-100/20'
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-300 mt-1.5">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-white mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-pink-100/30 outline-none transition resize-none focus:ring-2 focus:ring-pink-300/50 ${
                  errors.message ? 'border-red-400/60' : 'border-pink-100/20'
                }`}
              />
              <div className="flex justify-between items-center mt-1.5">
                {errors.message ? (
                  <p className="text-xs text-red-300">{errors.message}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-pink-100/40">
                  {formData.message.length}/1000
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#fff8fa] text-[#4a0e17] font-semibold text-sm uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md hover:bg-pink-100 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </article>
      </div>
    </main>
  );
}