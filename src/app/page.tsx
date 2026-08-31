'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import CategorySlider from '@/components/CategorySlider';
import AboutSection from '@/components/AboutSection';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';
import ExploreColors from '@/components/ExploreColors';

import { Sparkles } from 'lucide-react';
import { Product } from '@/types';

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products?featured=true&limit=8', {
      cache: 'no-store',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProducts(data?.products || []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8fa]">

      {/* Unauthorized Alert */}
      {searchParams.get('unauthorized') === '1' && (
        <div
          role="alert"
          className="bg-gradient-to-r from-maroon-950 via-rose-900 to-maroon-950 px-4 py-3 text-center text-sm font-semibold text-white"
        >
          Unauthorized — staff access is required to view the admin console.
        </div>
      )}

      {/* Hero */}
      <Hero />

      {/* Categories */}
      <CategorySection />

      {/* Category Slider */}
      <CategorySlider />

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-b from-[#fff8fa] via-pink-50/60 to-[#fff3f6] py-16 sm:py-24">

        {/* Background Luxury Glow */}

        <div className="pointer-events-none absolute left-[-120px] top-20 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 right-[-100px] h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-100/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* ================= HEADER ================= */}

          <div className="mb-12 text-center sm:mb-16">

            {/* Premium Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-pink-50/70 px-4 py-2 shadow-sm backdrop-blur">

              <Sparkles
                size={14}
                className="text-pink-600"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-600">
                Handpicked Styles
              </span>

              <Sparkles
                size={14}
                className="text-pink-600"
              />

            </div>

            {/* Heading */}

            <h2 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-maroon-950 sm:text-5xl">

              Featured

              <span className="ml-2 bg-gradient-to-r from-rose-900 via-pink-600 to-rose-800 bg-clip-text text-transparent">
                Masterpieces
              </span>

            </h2>

            {/* Decorative Divider */}

            <div className="mx-auto mt-6 flex items-center justify-center gap-3">

              <span className="h-px w-12 bg-gradient-to-r from-transparent to-pink-300" />

              <div className="flex gap-1">

                <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />

                <span className="h-2 w-2 rounded-full bg-rose-700" />

                <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />

              </div>

              <span className="h-px w-12 bg-gradient-to-l from-transparent to-pink-300" />

            </div>

            {/* Description */}

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-maroon-900/60 sm:text-base">

              Discover our most loved ethnic styles, thoughtfully selected
              to make every celebration feel truly unforgettable.

            </p>

          </div>

          {/* ================= PRODUCTS ================= */}

          {products.length ? (

            <div className="relative">

              {/* Product Grid */}

              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">

                {products.map((product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                ))}

              </div>

            </div>

          ) : (

            /* Empty State */

            <div className="mx-auto max-w-md rounded-3xl border border-pink-200/70 bg-pink-50/60 px-6 py-12 text-center shadow-sm backdrop-blur">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-rose-200">

                <Sparkles
                  size={24}
                  className="text-rose-800"
                />

              </div>

              <h3 className="mt-5 font-serif text-2xl font-semibold text-maroon-950">
                Something Beautiful Is Coming
              </h3>

              <p className="mt-3 text-sm leading-6 text-maroon-900/60">
                Our latest masterpieces will be added to the collection soon.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* Explore Colors */}

      <ExploreColors />

      {/* About Brand */}

      <AboutSection />

      {/* Customer Testimonials */}

      <Testimonials />

    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fff8fa]" />
      }
    >
      <HomeContent />
    </Suspense>
  );
}