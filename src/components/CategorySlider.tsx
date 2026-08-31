'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
ChevronLeft,
ChevronRight,
ArrowUpRight,
Sparkles,
Grid3X3,
} from 'lucide-react';

type Category = {
_id: string;
name: string;
imageUrl?: string;
productCount?: number;
};

export default function CategorySlider() {
const scrollContainerRef = useRef<HTMLDivElement>(null);
const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
fetch('/api/products/categories/list', {
cache: 'no-store',
})
.then((response) =>
response.ok
? response.json()
: Promise.reject(new Error('Unable to load categories'))
)
.then((data) => setCategories(data.categories || []))
.catch(() => setCategories([]));
}, []);

const scroll = (direction: 'left' | 'right') => {
scrollContainerRef.current?.scrollBy({
left: direction === 'left' ? -320 : 320,
behavior: 'smooth',
});
};

if (!categories.length) return null;

return ( <section className="relative overflow-hidden bg-gradient-to-b from-[#fff8fa] via-white to-pink-50/60 py-16 sm:py-20">

  {/* Background Decorations */}

  <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />

  <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* ================= HEADER ================= */}

    <div className="mb-12 text-center">

      <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-pink-600 shadow-sm backdrop-blur">

        <Sparkles size={14} />

        Curated For You

      </div>

      <h2 className="mt-5 font-serif text-4xl font-semibold text-maroon-950 sm:text-5xl">

        Shop By

        <span className="ml-2 text-rose-700">
          Category
        </span>

      </h2>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-maroon-900/60 sm:text-base">

        Discover timeless ethnic styles crafted for every celebration,
        occasion and beautiful moment.

      </p>

      {/* Decorative Line */}

      <div className="mx-auto mt-6 flex items-center justify-center gap-3">

        <span className="h-px w-10 bg-pink-200" />

        <Sparkles
          size={15}
          className="text-pink-500"
        />

        <span className="h-px w-10 bg-pink-200" />

      </div>

    </div>

    {/* ================= SLIDER ================= */}

    <div className="relative">

      {/* LEFT BUTTON */}

      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Scroll categories left"
        className="absolute left-0 top-[45%] z-30 hidden h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-pink-200 bg-white text-maroon-900 shadow-xl shadow-pink-100 transition-all duration-300 hover:scale-110 hover:border-pink-400 hover:bg-gradient-to-br hover:from-rose-900 hover:to-pink-600 hover:text-white md:grid"
      >
        <ChevronLeft size={22} />
      </button>

      {/* RIGHT BUTTON */}

      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Scroll categories right"
        className="absolute right-0 top-[45%] z-30 hidden h-12 w-12 translate-x-1/2 place-items-center rounded-full border border-pink-200 bg-white text-maroon-900 shadow-xl shadow-pink-100 transition-all duration-300 hover:scale-110 hover:border-pink-400 hover:bg-gradient-to-br hover:from-rose-900 hover:to-pink-600 hover:text-white md:grid"
      >
        <ChevronRight size={22} />
      </button>

      {/* ================= CATEGORY LIST ================= */}

      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth px-1 pb-5 pt-2 sm:gap-7"
      >

        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/shop?category=${category._id}`}
            className="group flex w-[145px] shrink-0 flex-col items-center text-center sm:w-[185px]"
          >

            {/* IMAGE CARD */}

            <div className="relative">

              {/* Outer Glow */}

              <div className="absolute inset-0 scale-90 rounded-full bg-pink-300/30 blur-xl opacity-0 transition duration-500 group-hover:scale-110 group-hover:opacity-100" />

              {/* Decorative Ring */}

              <div className="relative rounded-full bg-gradient-to-br from-pink-200 via-white to-rose-200 p-[3px] shadow-lg shadow-pink-100 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-pink-200">

                {/* Main Circle */}

                <div className="relative h-28 w-28 overflow-hidden rounded-full border-[5px] border-white bg-pink-50 sm:h-40 sm:w-40">

                  <Image
                    src={
                      category.imageUrl ||
                      '/images/logo.jpeg'
                    }
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 112px, 160px"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Image Overlay */}

                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                </div>

              </div>

              {/* Product Count */}

              {typeof category.productCount === 'number' &&
                category.productCount > 0 && (
                  <div className="absolute bottom-0 right-0 z-20 rounded-full border-2 border-white bg-gradient-to-r from-rose-900 to-pink-600 px-3 py-1 text-[9px] font-bold text-white shadow-lg">

                    {category.productCount} Items

                  </div>
                )}

            </div>

            {/* CATEGORY NAME */}

            <div className="mt-5">

              <h3 className="font-serif text-base font-semibold leading-snug text-maroon-950 transition-colors duration-300 group-hover:text-rose-700 sm:text-lg">

                {category.name}

              </h3>

              {/* Explore Text */}

              <div className="mt-2 flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-[0.16em] text-pink-500 opacity-0 transition-all duration-300 group-hover:opacity-100">

                Explore

                <ArrowUpRight size={12} />

              </div>

            </div>

          </Link>
        ))}

        {/* ================= VIEW ALL ================= */}

        <Link
          href="/categories"
          className="group flex w-[145px] shrink-0 flex-col items-center text-center sm:w-[185px]"
        >

          <div className="relative">

            {/* Glow */}

            <div className="absolute inset-0 rounded-full bg-pink-300/30 blur-xl transition duration-500 group-hover:scale-110 group-hover:bg-pink-400/40" />

            {/* Circle */}

            <div className="relative grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-maroon-950 via-rose-900 to-pink-600 p-[3px] shadow-xl shadow-pink-200 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105 sm:h-40 sm:w-40">

              <div className="grid h-full w-full place-items-center rounded-full border border-white/20 bg-white/10 p-5 backdrop-blur">

                <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-maroon-900 shadow-lg">

                  <Grid3X3 size={19} />

                </div>

                <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">

                  View All

                </span>

              </div>

            </div>

          </div>

          <div className="mt-5">

            <h3 className="font-serif text-base font-semibold text-maroon-950 sm:text-lg">

              All Categories

            </h3>

            <div className="mt-2 flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-[0.16em] text-pink-500">

              Explore More

              <ArrowUpRight size={12} />

            </div>

          </div>

        </Link>

      </div>

      {/* Mobile Scroll Hint */}

      <div className="mt-3 flex justify-center md:hidden">

        <div className="flex items-center gap-2 rounded-full border border-pink-100 bg-white px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-pink-500 shadow-sm">

          <ChevronLeft size={13} />

          Swipe To Explore

          <ChevronRight size={13} />

        </div>

      </div>

    </div>

  </div>

</section>

);
}
