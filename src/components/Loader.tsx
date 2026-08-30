'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const Loader = () => {
const [visible, setVisible] = useState(true);
const [fadeOut, setFadeOut] = useState(false);

useEffect(() => {
// Start fade-out animation
const fadeTimer = setTimeout(() => {
setFadeOut(true);
}, 1800);

// Completely remove loader after animation
const removeTimer = setTimeout(() => {
  setVisible(false);
}, 2500);

return () => {
  clearTimeout(fadeTimer);
  clearTimeout(removeTimer);
};

}, []);

if (!visible) return null;

return (
<div
className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-b from-pink-100 via-pink-50 to-pink-100 transition-all duration-700 ${
        fadeOut
          ? 'pointer-events-none scale-105 opacity-0'
          : 'scale-100 opacity-100'
      }`}
>
{/* Background decorative glow */} <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" /> <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-rose-300/20 blur-3xl" />
  <div className="relative z-10 flex flex-col items-center">

    {/* Logo */}
    <div className="relative">
      {/* Animated Glow */}
      <div className="absolute inset-0 scale-125 animate-pulse rounded-full bg-pink-400/40 blur-2xl" />

      {/* Outer Ring */}
      <div className="absolute -inset-3 rounded-full border border-pink-300/50 animate-[spin_8s_linear_infinite]" />

      {/* Logo Container */}
      <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-pink-400/80 bg-rose-950 shadow-2xl">
        <Image
          src="/images/logo.jpeg"
          alt="Jannat Elegance Logo"
          width={112}
          height={112}
          priority
          className="h-full w-full object-cover"
        />
      </div>
    </div>

    {/* Brand */}
    <div className="mt-7 text-center">
      <h2 className="font-serif text-4xl font-bold tracking-[0.15em] text-rose-950">
        JANNAT
      </h2>

      <div className="mt-2 flex items-center justify-center gap-3">
        <div className="h-px w-8 bg-pink-300" />

        <p className="text-[10px] font-bold tracking-[6px] text-pink-600">
          ELEGANCE
        </p>

        <div className="h-px w-8 bg-pink-300" />
      </div>
    </div>

    {/* Loading text */}
    <div className="mt-8 flex items-center gap-3">
      <Sparkles
        size={16}
        className="animate-pulse text-pink-500"
      />

      <span className="text-sm font-medium tracking-wide text-rose-900/80">
        Loading your royal experience...
      </span>

      <Sparkles
        size={16}
        className="animate-pulse text-rose-800"
      />
    </div>

    {/* Progress Bar */}
    <div className="mt-5 w-56 overflow-hidden rounded-full bg-pink-200/80 p-[2px] shadow-inner">
      <div className="h-1.5 overflow-hidden rounded-full">
        <div className="loader-progress h-full w-1/2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-rose-900" />
      </div>
    </div>

    <p className="mt-4 text-[10px] tracking-[0.25em] text-rose-800/40">
      LUXURY • ELEGANCE • GRACE
    </p>
  </div>
</div>

);
};

export default Loader;
