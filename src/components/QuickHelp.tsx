'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
MessageCircle,
X,
Package,
ShoppingBag,
Ruler,
Truck,
ChevronRight,
Sparkles,
Headphones,
} from 'lucide-react';

const helpOptions = [
{
title: 'Track My Order',
description: 'Check your latest order status',
icon: Package,
href: '/track-order',
},
{
title: 'Shop Collection',
description: 'Explore our latest styles',
icon: ShoppingBag,
href: '/products',
},
{
title: 'Return & Refund',
description: 'Return & Refund Information',
icon: Truck,
href: '/refund-policy',
},
];

export default function QuickHelp() {
const [isOpen, setIsOpen] = useState(false);

return (
<>
{/* Help Panel */}
{isOpen && ( <div className="fixed bottom-24 right-4 z-[998] w-[calc(100%-2rem)] max-w-[360px] animate-in fade-in slide-in-from-bottom-5 duration-300 sm:right-6">
      <div className="overflow-hidden rounded-[2rem] border border-pink-100 bg-[#fff8fa] shadow-2xl shadow-rose-950/20">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-950 via-maroon-900 to-pink-700 px-6 py-6 text-white">

          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-pink-300/20 blur-2xl" />

          <div className="relative flex items-start justify-between">

            <div className="flex items-center gap-3">

              <div className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur">
                <Headphones size={21} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl">
                    Need Help?
                  </h2>

                  <Sparkles
                    size={15}
                    className="text-pink-200"
                  />
                </div>

                <p className="mt-1 text-xs text-pink-100/75">
                  We're here for you
                </p>
              </div>

            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="Close help menu"
            >
              <X size={17} />
            </button>

          </div>

        </div>

        {/* Options */}
        <div className="space-y-2 p-4">

          {helpOptions.map((option) => {
            const Icon = option.icon;

            return (
              <Link
                key={option.title}
                href={option.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-4 rounded-2xl border border-transparent bg-white p-4 transition-all duration-300 hover:border-pink-200 hover:bg-pink-50 hover:shadow-sm"
              >
                {/* Icon */}
                <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-pink-50 text-pink-600 transition group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-rose-500 group-hover:to-pink-600 group-hover:text-white">
                  <Icon size={20} />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">

                  <h3 className="font-semibold text-maroon-950">
                    {option.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {option.description}
                  </p>

                </div>

                <ChevronRight
                  size={18}
                  className="text-pink-300 transition-transform group-hover:translate-x-1 group-hover:text-pink-600"
                />

              </Link>
            );
          })}

        </div>

        {/* Support Footer */}
        <div className="border-t border-pink-100 bg-white px-5 py-4 text-center">

          <p className="text-xs text-gray-500">
            Still need help?
          </p>

          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-pink-600 transition hover:text-maroon-900"
          >
            Contact Jannat Elegance Support
            <ChevronRight size={14} />
          </Link>

        </div>

      </div>
    </div>
  )}

  {/* Floating Button */}
  <button
    onClick={() => setIsOpen((previous) => !previous)}
    className="fixed bottom-6 right-6 z-[999] grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-rose-700 text-white shadow-2xl shadow-pink-300/50 transition-all duration-300 hover:scale-110 active:scale-95"
    aria-label="Open help menu"
  >
    {isOpen ? (
      <X size={27} />
    ) : (
      <MessageCircle size={28} />
    )}

    {!isOpen && (
      <span className="absolute -right-1 -top-1 flex h-5 w-5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />

        <span className="relative inline-flex h-5 w-5 rounded-full border-2 border-white bg-rose-500" />
      </span>
    )}
  </button>
</>

);
}
