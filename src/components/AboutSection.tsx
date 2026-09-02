'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Sparkles,
  Star,
  Award,
  ArrowUpRight,
  Crown,
} from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-[#fff8fa] via-pink-50/70 to-[#fff3f6] py-20 sm:py-24"
    >
      {/* ================= BACKGROUND DECORATIONS ================= */}

      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-rose-200/25 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= SECTION HEADER ================= */}

        <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-20">

          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50/80 px-4 py-2 shadow-sm backdrop-blur">

            <Sparkles size={14} className="text-pink-600" />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-600">
              Our Identity
            </span>

            <Sparkles size={14} className="text-pink-600" />

          </div>

          <h2 className="mt-5 font-serif text-4xl font-semibold text-maroon-950 sm:text-5xl">

            About

            <span className="ml-2 bg-gradient-to-r from-rose-900 via-pink-600 to-rose-800 bg-clip-text text-transparent">
              JANNAT ELEGANCE
            </span>

          </h2>

          {/* Decorative Divider */}

          <div className="mx-auto mt-6 flex items-center justify-center gap-3">

            <span className="h-px w-10 bg-gradient-to-r from-transparent to-pink-300" />

            <div className="flex gap-1">

              <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />

              <span className="h-2 w-2 rounded-full bg-rose-700" />

              <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />

            </div>

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-pink-300" />

          </div>

          <p className="mt-5 text-sm leading-7 text-maroon-900/60 sm:text-base">

            A celebration of Indian heritage, feminine grace and timeless
            elegance—created for every woman who wants to feel extraordinary.

          </p>

        </div>

        {/* ================= OUR STORY + PHILOSOPHY ================= */}

        <div className="grid items-stretch gap-7 lg:grid-cols-2 lg:gap-10">

          {/* ================= OUR STORY ================= */}

          <div className="group relative overflow-hidden rounded-[32px] border border-pink-200/70 bg-gradient-to-br from-pink-50 via-[#fff8fa] to-rose-50/80 p-7 shadow-lg shadow-pink-100/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:p-10 lg:p-12">

            {/* Decorative Glow */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-pink-200/30 blur-3xl transition duration-500 group-hover:scale-125" />

            <div className="relative">

              {/* Icon + Title */}

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-900 to-pink-600 text-white shadow-lg shadow-pink-200">

                  <Heart
                    size={21}
                    className="fill-white text-white"
                  />

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-600">
                    The Beginning
                  </p>

                  <h3 className="mt-1 font-serif text-3xl font-semibold text-maroon-950">
                    Our Story
                  </h3>

                </div>

              </div>

              {/* Content */}

              <div className="mt-8 space-y-5 text-sm leading-8 text-maroon-900/70 sm:text-base">

                <p>
                  Jannat Elegance was born from a love for timeless Indian
                  fashion and the belief that every woman deserves to feel
                  beautiful, confident and effortlessly elegant.
                </p>

                <p>
                  We bring together traditional inspiration and contemporary
                  design to create ethnic wear that feels graceful, luxurious
                  and relevant to the modern woman.
                </p>

                <p>
                  Every design is thoughtfully created with attention to
                  silhouette, fabric, colour and detail—because true elegance
                  lives in the little things.
                </p>

              </div>

              {/* Quote */}

              <div className="mt-9 border-t border-pink-200/70 pt-7">

                <div className="rounded-2xl border border-pink-100 bg-pink-100/40 p-5">

                  <p className="font-serif text-xl leading-8 italic text-maroon-900 sm:text-2xl">

                    “Jannat Elegance is more than clothing. It is confidence,
                    grace and the queen within you.”

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================= PHILOSOPHY ================= */}

          <div className="group relative overflow-hidden rounded-[32px] border border-maroon-800 bg-gradient-to-br from-maroon-950 via-rose-950 to-maroon-900 p-7 shadow-2xl shadow-maroon-950/20 sm:p-10 lg:p-12">

            {/* Background Glow */}

            <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="pointer-events-none absolute bottom-0 left-0 h-60 w-60 rounded-full bg-rose-500/10 blur-3xl" />

            <div className="relative">

              {/* Icon + Heading */}
              
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-300/20 bg-pink-400/10 text-pink-300">

                  <Sparkles
                    size={21}
                    className="fill-pink-300 text-pink-300"
                  />

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-400">
                    What We Believe
                  </p>

                  <h3 className="mt-1 font-serif text-3xl font-semibold text-white">
                    Our Philosophy
                  </h3>

                </div>

              </div>

              {/* Tagline */}

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-pink-300">
                Designed With Grace. Made To Be Remembered.
              </p>

              {/* Description */}

              <p className="mt-5 text-sm leading-8 text-pink-100/75 sm:text-base">

                At Jannat Elegance, we believe fashion should do more than
                dress you—it should express you. Our designs celebrate
                femininity, Indian heritage and modern elegance.

              </p>

              {/* Philosophy Cards */}

              <div className="mt-8 grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
                    Craft
                  </p>

                  <p className="mt-2 text-xs leading-5 text-pink-100/65">
                    Refined details and graceful silhouettes in every piece.
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
                    Comfort
                  </p>

                  <p className="mt-2 text-xs leading-5 text-pink-100/65">
                    Designed to move beautifully through meaningful moments.
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
                    Confidence
                  </p>

                  <p className="mt-2 text-xs leading-5 text-pink-100/65">
                    Made for the woman who wants to feel completely herself.
                  </p>

                </div>

              </div>

              {/* Bottom Keywords */}

              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/10 pt-6 text-[9px] font-bold uppercase tracking-[0.18em] text-pink-300 sm:justify-between">

                <span>Timeless</span>

                <span className="text-pink-500">✦</span>

                <span>Feminine</span>

                <span className="text-pink-500">✦</span>

                <span>Elegant</span>

                <span className="text-pink-500">✦</span>

                <span>Effortless</span>

              </div>

            </div>

          </div>

        </div>

        {/* ================= WHY CHOOSE US ================= */}

        <div className="mt-14 sm:mt-20">

          <div className="mb-9 text-center">

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-600">
              Why Choose Us
            </p>

            <h3 className="mt-3 font-serif text-3xl font-semibold text-maroon-950 sm:text-4xl">
              Crafted For Your Beautiful Moments
            </h3>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Card 1 */}

            <div className="group rounded-3xl border border-pink-200/60 bg-gradient-to-br from-pink-50/80 to-rose-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-100">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-maroon-900 to-rose-800 text-white shadow-lg">

                <Award size={20} />

              </div>

              <h4 className="mt-5 font-serif text-xl font-semibold text-maroon-950">
                Thoughtful Designs
              </h4>

              <p className="mt-3 text-xs leading-6 text-maroon-900/60">
                Every piece is created with an eye for elegance, shape,
                alignment and beautiful detail.
              </p>

            </div>

            {/* Card 2 */}

            <div className="group rounded-3xl border border-pink-200/60 bg-gradient-to-br from-pink-50/80 to-rose-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-100">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-900 to-pink-600 text-white shadow-lg">

                <Star size={20} />

              </div>

              <h4 className="mt-5 font-serif text-xl font-semibold text-maroon-950">
                Premium Feel
              </h4>

              <p className="mt-3 text-xs leading-6 text-maroon-900/60">
                Beautiful fabrics, refined finishing and thoughtful comfort
                come together in every creation.
              </p>

            </div>

            {/* Card 3 */}

            <div className="group rounded-3xl border border-pink-200/60 bg-gradient-to-br from-pink-50/80 to-rose-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-100">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-800 text-white shadow-lg">

                <Sparkles size={20} />

              </div>

              <h4 className="mt-5 font-serif text-xl font-semibold text-maroon-950">
                Timeless Style
              </h4>

              <p className="mt-3 text-xs leading-6 text-maroon-900/60">
                Designed to remain elegant beyond fleeting trends and become a
                cherished part of your wardrobe.
              </p>

            </div>

            {/* Card 4 */}

            <div className="group rounded-3xl border border-pink-200/60 bg-gradient-to-br from-pink-50/80 to-rose-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-100">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-950 to-pink-600 text-white shadow-lg">

                <Heart
                  size={20}
                  className="fill-white"
                />

              </div>

              <h4 className="mt-5 font-serif text-xl font-semibold text-maroon-950">
                Made For Her
              </h4>

              <p className="mt-3 text-xs leading-6 text-maroon-900/60">
                Because every woman deserves to feel confident, unique,
                beautiful and completely herself.
              </p>

            </div>

          </div>

        </div>

        {/* ================= BRAND PROMISE ================= */}

        <div className="relative mt-16 overflow-hidden rounded-[36px] border border-maroon-800 bg-gradient-to-r from-maroon-950 via-rose-950 to-maroon-900 px-6 py-14 text-center shadow-2xl shadow-maroon-950/20 sm:mt-20 sm:px-12 sm:py-16 lg:px-16">

          {/* Decorations */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pink-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />

          <div className="relative">

            {/* Crown */}

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-pink-300/20 bg-pink-400/10 text-pink-300">

              <Crown size={25} />

            </div>

            <span className="mt-6 block text-[10px] font-bold uppercase tracking-[0.3em] text-pink-300">
              Brand Promise
            </span>

            <h3 className="mx-auto mt-4 max-w-4xl font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">

              Wear Your Elegance.
              <br className="hidden sm:block" />
              <span className="text-pink-300">Own Your Moment.</span>

            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-pink-100/70 sm:text-base">

              Whether it's a festive celebration, a family gathering, a
              special occasion or simply a day when you want to feel
              beautiful—Jannat Elegance is designed to become part of your
              unforgettable moments.

            </p>

            {/* ================= CTA BUTTON ================= */}

            <div className="mt-9 flex justify-center">

              <Link
                href="/about"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-700 px-7 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >

                Discover Our Story

                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />

              </Link>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;