'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryListItem {
  name: string;
  category: string;
  image: string;
}

const categoryList: CategoryListItem[] = [
  { name: "SHARARA SUIT", category: "Sharara Suit", image: "/images/products/Sharara-Suit/IMG-20260824-WA0016.jpg" },
  { name: "GARARA SUIT", category: "Garara Suit", image: "/images/products/Garara-Suit/IMG-20260824-WA0003.jpg" },
  { name: "PANT SUIT", category: "Pant Suit", image: "/images/products/Pant-Suit/IMG-20260824-WA0021.jpg" },
  { name: "FARSHI SHALWAR", category: "Farshi Shalwar Suit", image: "/images/products/Farshi-Shalwar-Suit/IMG-20260824-WA0020.jpg" },
  { name: "FROCK SUIT", category: "Frock Suit", image: "/images/products/Frock-Suit/IMG-20260824-WA0019.jpg" },
  { name: "GOWN", category: "Gown", image: "/images/products/Gown/IMG-20260824-WA0015.jpg" },
  { name: "LEHNGA", category: "Lehnga", image: "/images/products/Lehnga/IMG-20260824-WA0004.jpg" },
  { name: "PLAZO SUIT", category: "Plazo Suit", image: "/images/products/Plazo-Suit/IMG-20260824-WA0017.jpg" },
];

const CategorySlider: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 bg-[#fff8fa] border-b border-maroon-100/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <p className="text-pink-600 uppercase tracking-[4px] text-xs font-bold font-sans">
            Curated Categories
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-maroon-950 mt-2 font-normal">
            Shop By Category
          </h2>
          <div className="w-16 h-0.5 bg-maroon-300 mx-auto mt-4 rounded" />
        </div>

        {/* Slider Frame */}
        <div className="relative group">
          
          {/* Scroll Left Button */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-maroon-100 rounded-full flex items-center justify-center shadow-luxury hover:bg-maroon-50 hover:border-maroon-300 transition duration-300 text-maroon-900 group-hover:scale-105"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Horizontal Drag Track */}
          <div
            ref={scrollContainerRef}
            className="flex items-start gap-5 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1"
          >
            {categoryList.map((item) => (
              <Link
                key={item.category}
                href={`/shop?category=${encodeURIComponent(item.category)}`}
                className="flex flex-col items-center gap-3 group shrink-0"
              >
                {/* Circle Outer Frame */}
                <div className="w-28 h-28 sm:w-44 sm:h-44 rounded-full overflow-hidden border border-maroon-200 p-1 bg-white transition-all duration-300 group-hover:border-maroon-800 shadow-sm relative">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Circle Text */}
                <span className="text-maroon-950 text-xs sm:text-sm font-semibold tracking-wide uppercase text-center max-w-[110px] sm:max-w-[160px] truncate group-hover:text-pink-600 transition-colors font-sans">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => handleScroll('right')}
            className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-maroon-100 rounded-full flex items-center justify-center shadow-luxury hover:bg-maroon-50 hover:border-maroon-300 transition duration-300 text-maroon-900 group-hover:scale-105"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

        </div>

      </div>
    </section>
  );
};

export default CategorySlider;
