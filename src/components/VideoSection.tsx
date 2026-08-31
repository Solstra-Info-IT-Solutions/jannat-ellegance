'use client';

import { Play, Sparkles } from 'lucide-react';

type VideoSectionProps = {
  videoSrc?: string;
  poster?: string;
};

export default function VideoSection({
  videoSrc = '/videos/jannat-elegance.mp4',
  poster,
}: VideoSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#fff8fa] py-10 sm:py-14">

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-pink-200/20 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-rose-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1500px] px-3 sm:px-5 lg:px-8">

        {/* Header */}
        <div className="mb-7 text-center sm:mb-9">

          <div className="inline-flex items-center gap-2 text-pink-600">
            <Sparkles size={14} />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] sm:text-xs">
              The Jannat Experience
            </span>

            <Sparkles size={14} />
          </div>

          <h2 className="mt-3 font-serif text-3xl font-semibold text-maroon-950 sm:text-4xl lg:text-5xl">
            Elegance in Every Detail
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-maroon-900/60 sm:text-base">
            Discover the beauty, craftsmanship and timeless elegance behind
            Jannat Elegance.
          </p>

        </div>

        {/* Video */}
        <div className="group relative overflow-hidden rounded-2xl border border-pink-200/60 bg-maroon-950 shadow-xl sm:rounded-3xl">

          <video
            className="block aspect-video w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
          >
            <source src={videoSrc} type="video/mp4" />

            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-950/35 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-50" />

          {/* Bottom Badge */}
          <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-maroon-950/50 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:bottom-6 sm:left-6">

            <span className="grid h-7 w-7 place-items-center rounded-full bg-pink-500 text-white">
              <Play size={12} fill="currentColor" />
            </span>

            Jannat Elegance

          </div>

          {/* Top Label */}
          <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:right-6 sm:top-6">
            Our Collection
          </div>

        </div>

      </div>

    </section>
  );
}