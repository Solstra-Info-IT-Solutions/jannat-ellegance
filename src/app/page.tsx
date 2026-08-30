'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import CategorySlider from '@/components/CategorySlider';
import AboutSection from '@/components/AboutSection';
import ProductCard from '@/components/ProductCard';
import ExploreColors from '@/components/ExploreColors';
import { Product } from '@/types';

function HomeContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch('/api/products?featured=true&limit=8', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProducts(data?.products || []))
      .catch(() => undefined);
  }, []);
  return (
    <main className="min-h-screen bg-[#fff8fa]">
      {searchParams.get('unauthorized') === '1' && (
        <div role="alert" className="bg-maroon-950 px-4 py-3 text-center text-sm font-semibold text-white">
          Unauthorized — staff access is required to view the admin console.
        </div>
      )}
      <Hero />
      <CategorySection />
      <CategorySlider />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[4px] text-pink-600">Handpicked styles</p>
            <h2 className="mt-2 font-serif text-3xl text-maroon-950 sm:text-4xl">Featured Masterpieces</h2>
          </div>
          {products.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">Our latest collection will appear here soon.</p>
          )}
        </div>
      </section>
      <ExploreColors />
      <AboutSection />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#fff8fa]" />}>
      <HomeContent />
    </Suspense>
  );
}