'use client';

import { Sparkles } from 'lucide-react';

const announcements = [
'✨ Welcome to JANNAT ELEGANCE — Where Every Outfit Tells a Story',
'🚚 Pan India Delivery Available',
'👑 Discover Our Premium Ethnic Collection',
'💖 Elegance Crafted for Every Queen',
'✨ Shop Your Favourite Styles Today',
];

export default function AnnouncementBar() {
return ( <div className="relative z-[100] w-full overflow-hidden bg-gradient-to-r from-rose-950 via-maroon-900 to-rose-950 py-2.5 text-white">

  {/* Moving Content */}
  <div className="flex w-max animate-marquee whitespace-nowrap">
    {/* First Set */}
    <div className="flex items-center gap-10 px-5">
      {announcements.map((text, index) => (
        <div
          key={`first-${index}`}
          className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider sm:text-sm"
        >
          <Sparkles
            size={14}
            className="text-pink-300"
          />

          <span>{text}</span>
        </div>
      ))}
    </div>

    {/* Duplicate Set for Infinite Loop */}
    <div
      aria-hidden="true"
      className="flex items-center gap-10 px-5"
    >
      {announcements.map((text, index) => (
        <div
          key={`second-${index}`}
          className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider sm:text-sm"
        >
          <Sparkles
            size={14}
            className="text-pink-300"
          />

          <span>{text}</span>
        </div>
      ))}
    </div>
  </div>

  <style jsx>{`
    @keyframes marquee {
      from {
        transform: translateX(-50%);
      }

      to {
        transform: translateX(0%);
      }
    }

    .animate-marquee {
      animation: marquee 30s linear infinite;
    }
  `}</style>
</div>

);
}
