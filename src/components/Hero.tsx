'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden luxury-gradient border-b border-maroon-100/50">
      {/* Background Glow Blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-20 w-96 h-96 bg-maroon-100/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[600px] lg:min-h-[650px] grid lg:grid-cols-2 items-center gap-12 py-12 lg:py-16">
          
          {/* Text & Action Column */}
          <div className="relative z-10 animate-fadeUp flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 bg-white border border-maroon-100 px-4 py-2 rounded-full shadow-sm text-maroon-900 text-xs sm:text-sm font-semibold mb-6">
              <Sparkles size={14} className="text-pink-500 fill-pink-500" />
              New Festive Collection
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-maroon-950 leading-[1.1] tracking-tight">
              Elegance
              <br />
              <span className="text-pink-600 font-normal italic">
                Made For You
              </span>
            </h1>

            <p className="mt-6 text-gray-600 max-w-lg text-sm sm:text-base leading-relaxed">
              Discover timeless Indian fashion designed to make every moment beautiful. From gracefully tailored frocks to luxurious wedding suits, Jannat Elegance captures the queen within you.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/shop"
                className="luxury-button bg-maroon-850 hover:bg-maroon-950 text-white px-7 py-3.5 rounded-full flex items-center gap-2 shadow-lg shadow-maroon-900/20 transition duration-300 font-semibold text-sm"
              >
                Shop Collection
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/shop?category=Sharara Suit"
                className="px-7 py-3.5 rounded-full border border-maroon-250 text-maroon-900 hover:bg-white transition duration-300 font-semibold text-sm"
              >
                Explore Shararas
              </Link>
            </div>

            {/* Quality Stats */}
            <div className="flex gap-8 mt-12 border-t border-maroon-100/50 pt-8 w-full">
              <div>
                <strong className="text-2xl sm:text-3xl font-serif text-maroon-950 font-bold block">
                  5K+
                </strong>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                  Happy Women
                </p>
              </div>
              <div>
                <strong className="text-2xl sm:text-3xl font-serif text-maroon-950 font-bold block">
                  100+
                </strong>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                  Exclusive Designs
                </p>
              </div>
              <div>
                <strong className="text-2xl sm:text-3xl font-serif text-maroon-950 font-bold block">
                  4.9★
                </strong>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                  Customer Rating
                </p>
              </div>
            </div>
          </div>

          {/* Hero Showcase Image */}
          <div className="relative flex justify-center w-full">
            {/* Soft pink blurred background ring */}
            <div className="absolute w-[80%] aspect-square bg-pink-300/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative w-full max-w-[450px] animate-float">
              {/* Luxury arch frame */}
              <div className="rounded-[40%_40%_20%_20%] overflow-hidden shadow-2xl border-[8px] border-white shadow-maroon-950/10 aspect-[4/5] relative w-full bg-maroon-50">
                <Image
                  src="/images/products/Garara-Suit/IMG-20260824-WA0003.jpg"
                  alt="Elegant traditional designer dress"
                  fill
                  priority
                  className="object-cover object-top hover:scale-105 transition-transform duration-[2000ms]"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
