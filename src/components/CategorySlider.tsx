'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Category = { _id: string; name: string; imageUrl?: string; productCount?: number };

export default function CategorySlider() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/products/categories/list', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load categories')))
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const scroll = (direction: 'left' | 'right') => scrollContainerRef.current?.scrollBy({ left: direction === 'left' ? -280 : 280, behavior: 'smooth' });
  if (!categories.length) return null;

  return <section className="relative border-b border-maroon-100/30 bg-[#fff8fa] py-12">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[4px] text-pink-600">Curated Categories</p><h2 className="mt-2 font-serif text-3xl font-normal text-maroon-950 sm:text-4xl">Shop By Category</h2><div className="mx-auto mt-4 h-0.5 w-16 rounded bg-maroon-300" /></div>
      <div className="relative">
        <button type="button" onClick={() => scroll('left')} className="absolute left-1 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-pink-300 bg-maroon-850 text-white shadow-sm transition hover:bg-maroon-950 sm:-left-5" aria-label="Scroll categories left"><ChevronLeft size={20} /></button>
        <div ref={scrollContainerRef} className="no-scrollbar flex items-start gap-5 overflow-x-auto scroll-smooth px-1 py-3 sm:gap-8">
          {categories.map((category) => <Link key={category._id} href={`/shop?category=${category._id}`} className="group flex shrink-0 flex-col items-center gap-3"><div className="relative h-28 w-28 overflow-hidden rounded-full border border-maroon-200 bg-white p-1 shadow-sm transition group-hover:border-maroon-800 sm:h-44 sm:w-44"><div className="relative h-full w-full overflow-hidden rounded-full"><Image src={category.imageUrl || '/images/logo.jpeg'} alt={category.name} fill sizes="(max-width: 640px) 112px, 176px" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" /></div></div><span className="max-w-[110px] text-center text-xs font-semibold uppercase tracking-wide text-maroon-950 transition group-hover:text-pink-600 sm:max-w-[160px] sm:text-sm">{category.name}</span></Link>)}
          <Link href="/categories" className="group flex shrink-0 flex-col items-center gap-3"><div className="grid h-28 w-28 place-items-center rounded-full border border-pink-300 bg-pink-50 text-center text-xs font-bold uppercase tracking-wider text-maroon-850 transition group-hover:bg-pink-100 sm:h-44 sm:w-44 sm:text-sm">View<br />all</div><span className="text-xs font-semibold uppercase tracking-wide text-maroon-950 sm:text-sm">All categories</span></Link>
        </div>
        <button type="button" onClick={() => scroll('right')} className="absolute right-1 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-pink-300 bg-maroon-850 text-white shadow-sm transition hover:bg-maroon-950 sm:-right-5" aria-label="Scroll categories right"><ChevronRight size={20} /></button>
      </div>
    </div>
  </section>;
}
