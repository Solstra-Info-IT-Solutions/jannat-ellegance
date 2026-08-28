'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryItem {
  name: string;
  category: string;
  image: string;
  tagline: string;
}

const styleCategories: CategoryItem[] = [
  {
    name: "Elegant Frock Suits",
    category: "Frock Suit",
    image: "/images/products/Frock-Suit/IMG-20260824-WA0019.jpg",
    tagline: "Graceful flow & detailed patterns"
  },
  {
    name: "Royal Sharara Suits",
    category: "Sharara Suit",
    image: "/images/products/Sharara-Suit/IMG-20260824-WA0016.jpg",
    tagline: "Timeless royalty re-imagined"
  }
];

const CategorySection: React.FC = () => {
  return (
    <section className="py-16 bg-[#fff2f5]/50 border-b border-maroon-100/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-pink-600 uppercase tracking-[4px] text-xs font-bold font-sans">
            Shop By Style
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-maroon-950 mt-2 font-normal">
            Find Your Signature Look
          </h2>
          <div className="w-16 h-0.5 bg-maroon-300 mx-auto mt-4 rounded" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {styleCategories.map((item) => (
            <Link
              key={item.category}
              href={`/shop?category=${encodeURIComponent(item.category)}`}
              className="relative group overflow-hidden rounded-3xl h-72 sm:h-80 w-full bg-maroon-50 shadow-luxury hover:shadow-luxury-hover transition-all duration-500 block"
            >
              {/* Image Frame */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-maroon-950/20 to-transparent pointer-events-none" />

              {/* Card Contents */}
              <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                <p className="text-pink-200 text-xs font-semibold uppercase tracking-wider font-sans">
                  {item.tagline}
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl mt-1 font-semibold text-white leading-tight">
                  {item.name}
                </h3>
                <span className="inline-block mt-3 text-xs font-bold tracking-wider border-b border-white/60 pb-1 group-hover:text-pink-200 group-hover:border-pink-200 transition-colors uppercase font-sans">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;
