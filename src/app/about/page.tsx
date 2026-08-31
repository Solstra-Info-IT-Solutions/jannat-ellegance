'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
ArrowRight,
Award,
CheckCircle2,
Crown,
Gem,
Heart,
Instagram,
Mail,
Quote,
Scissors,
ShieldCheck,
Sparkles,
Star,
Target,
Users,
Eye,
} from 'lucide-react';

const values = [
{
icon: Heart,
title: 'Made With Love',
description:
'Every collection is selected with attention to detail, elegance and the confidence of the woman wearing it.',
},
{
icon: Gem,
title: 'Premium Elegance',
description:
'We believe luxury is found in beautiful fabrics, refined details and timeless silhouettes.',
},
{
icon: ShieldCheck,
title: 'Quality First',
description:
'Our focus is to deliver fashion that feels as beautiful as it looks.',
},
{
icon: Users,
title: 'For Every Woman',
description:
'From celebrations to special moments, we create collections designed to make every woman feel confident.',
},
];

const fashionHighlights = [
'Sharara Suits',
'Garara Suits',
'Farshi Shalwar Suits',
'Elegant Gowns',
'Frock Suits',
'Pant Suits',
'Lehengas',
'Contemporary Ethnic Wear',
];

const reasons = [
'Carefully curated premium ethnic collections',
'Elegant designs inspired by Indian heritage',
'Fashion created for modern celebrations',
'Attention to comfort, fit and style',
'A seamless and beautiful shopping experience',
];

export default function AboutPage() {
return ( <main className="min-h-screen overflow-hidden bg-[#fff8fa] text-maroon-950">

  {/* ================= HERO ================= */}
  <section className="relative isolate overflow-hidden">

    {/* Background Decorations */}
    <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-[#fff8fa] to-rose-100" />

    <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />

    <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-rose-300/20 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">

      <div className="mx-auto max-w-4xl text-center">

        <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-pink-600 shadow-sm backdrop-blur">

          <Sparkles size={15} />

          The Story of Elegance

        </div>

        <h1 className="mt-7 font-serif text-5xl font-semibold leading-tight text-maroon-950 sm:text-6xl lg:text-7xl">

          Where Tradition Meets

          <span className="block bg-gradient-to-r from-rose-800 via-pink-600 to-rose-800 bg-clip-text text-transparent">
            Modern Elegance
          </span>

        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-maroon-900/70 sm:text-lg">

          Jannat Elegance is more than a fashion destination.
          It is a celebration of femininity, confidence, culture and
          timeless Indian craftsmanship.

        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <Link
            href="/shop"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-900 via-rose-800 to-pink-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-pink-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            Explore Our Collection

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <a
            href="#our-story"
            className="inline-flex items-center justify-center rounded-full border border-pink-200 bg-white px-7 py-4 text-sm font-bold text-maroon-900 transition hover:border-pink-400 hover:bg-pink-50"
          >
            Discover Our Story
          </a>

        </div>

      </div>

    </div>

  </section>

  {/* ================= BRAND INTRO ================= */}
  <section
    id="our-story"
    className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
  >

    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

      {/* Visual */}
      <div className="relative">

        <div className="absolute -left-5 -top-5 h-full w-full rounded-[2.5rem] border border-pink-200 bg-pink-100" />

        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-950 via-maroon-900 to-pink-700 p-10 text-white shadow-2xl">

          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-pink-400/20 blur-3xl" />

          <Crown
            size={52}
            className="relative text-pink-200"
          />

          <p className="relative mt-8 font-serif text-4xl leading-tight sm:text-5xl">

            Elegance is not about being noticed.

            <span className="mt-3 block text-pink-200">
              It is about being remembered.
            </span>

          </p>

          <div className="relative mt-10 flex items-center gap-3">

            <div className="h-px flex-1 bg-pink-200/30" />

            <Sparkles size={18} className="text-pink-200" />

            <div className="h-px flex-1 bg-pink-200/30" />

          </div>

        </div>

      </div>

      {/* Content */}
      <div>

        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-pink-600">

          <Heart size={15} />

          Our Story

        </p>

        <h2 className="mt-5 font-serif text-4xl leading-tight text-maroon-950 sm:text-5xl">

          Fashion Designed For
          <span className="block text-rose-700">
            Your Beautiful Moments
          </span>

        </h2>

        <div className="mt-7 space-y-5 text-base leading-8 text-maroon-900/70">

          <p>
            At Jannat Elegance, we believe that clothing has the power
            to transform not only how you look, but also how you feel.
            Every outfit represents confidence, personality and a story
            waiting to be told.
          </p>

          <p>
            Our journey is inspired by the richness of Indian ethnic
            fashion and the evolving style of the modern woman. We bring
            together traditional silhouettes, graceful detailing and
            contemporary elegance to create a collection made for
            unforgettable occasions.
          </p>

          <p>
            Whether it is a family celebration, wedding, festive occasion
            or a moment you simply want to feel extraordinary, Jannat
            Elegance is here to help you find something truly beautiful.
          </p>

        </div>

      </div>

    </div>

  </section>

  {/* ================= MISSION & VISION ================= */}
  <section className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-maroon-950 to-rose-900 py-20 text-white">

    <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />

    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-300/10 blur-3xl" />

    <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">

      {/* Mission */}
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur sm:p-10">

        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-400/15 text-pink-200">

          <Target size={28} />

        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-pink-200">
          Our Mission
        </p>

        <h2 className="mt-4 font-serif text-4xl">
          To Make Every Woman Feel Extraordinary
        </h2>

        <p className="mt-6 leading-8 text-pink-100/70">

          Our mission is to make elegant and beautiful ethnic fashion
          accessible through carefully curated collections that combine
          style, quality, comfort and timeless design.

          We want every customer to feel confident, graceful and
          celebrated in what she wears.

        </p>

      </div>

      {/* Vision */}
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur sm:p-10">

        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pink-400/15 text-pink-200">

          <Eye size={28} />

        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-pink-200">
          Our Vision
        </p>

        <h2 className="mt-4 font-serif text-4xl">
          To Become A Trusted Name In Ethnic Fashion
        </h2>

        <p className="mt-6 leading-8 text-pink-100/70">

          Our vision is to build Jannat Elegance into a trusted fashion
          destination where women can discover premium ethnic wear that
          respects tradition while embracing modern style.

          We aspire to create meaningful fashion experiences and become
          part of our customers' most memorable moments.

        </p>

      </div>

    </div>

  </section>

  {/* ================= FASHION ================= */}
  <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

    <div className="mx-auto max-w-3xl text-center">

      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-pink-600">

        <Scissors size={15} />

        Our Fashion Philosophy

      </div>

      <h2 className="mt-5 font-serif text-4xl text-maroon-950 sm:text-5xl">

        Tradition, Grace &
        <span className="text-rose-700"> Modern Style</span>

      </h2>

      <p className="mt-6 leading-8 text-maroon-900/65">

        Indian fashion is beautifully diverse, expressive and timeless.
        Our collection celebrates that diversity with styles created for
        different personalities, occasions and generations.

      </p>

    </div>

    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

      {fashionHighlights.map((item, index) => (
        <div
          key={item}
          className="group relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-100/60"
        >

          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-pink-50 to-rose-100 text-pink-600 transition-transform duration-300 group-hover:scale-110">

            <span className="font-serif text-lg font-bold">
              {String(index + 1).padStart(2, '0')}
            </span>

          </div>

          <h3 className="mt-4 font-serif text-lg font-semibold text-maroon-950">
            {item}
          </h3>

        </div>
      ))}

    </div>

  </section>

  {/* ================= VALUES ================= */}
  <section className="bg-pink-50/70 py-20">

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-3xl text-center">

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-600">
          What We Believe In
        </p>

        <h2 className="mt-5 font-serif text-4xl text-maroon-950 sm:text-5xl">
          Our Core Values
        </h2>

      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {values.map((value) => {
          const Icon = value.icon;

          return (
            <div
              key={value.title}
              className="group rounded-[1.75rem] border border-pink-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-100"
            >

              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rose-800 to-pink-600 text-white shadow-lg shadow-pink-200 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">

                <Icon size={24} />

              </div>

              <h3 className="mt-6 font-serif text-2xl text-maroon-950">
                {value.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-maroon-900/60">
                {value.description}
              </p>

            </div>
          );
        })}

      </div>

    </div>

  </section>

  {/* ================= WHY CHOOSE ================= */}
  <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

      <div>

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-600">
          The Jannat Experience
        </p>

        <h2 className="mt-5 font-serif text-4xl text-maroon-950 sm:text-5xl">

          Why Choose
          <span className="block text-rose-700">
            Jannat Elegance?
          </span>

        </h2>

        <p className="mt-6 max-w-xl leading-8 text-maroon-900/65">

          We believe shopping for a special outfit should feel just as
          beautiful as wearing it. From discovering your style to finding
          the perfect look, every detail matters.

        </p>

        <div className="mt-8 space-y-4">

          {reasons.map((reason) => (
            <div
              key={reason}
              className="flex items-center gap-3 rounded-xl bg-pink-50 px-4 py-4"
            >

              <CheckCircle2
                size={20}
                className="flex-none text-pink-600"
              />

              <span className="text-sm font-semibold text-maroon-900">
                {reason}
              </span>

            </div>
          ))}

        </div>

      </div>

      <div className="relative">

        <div className="absolute inset-0 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-pink-200 to-rose-200" />

        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#fff] to-pink-50 p-8 shadow-xl sm:p-12">

          <Quote
            size={45}
            className="text-pink-300"
          />

          <blockquote className="mt-6 font-serif text-3xl leading-tight text-maroon-950 sm:text-4xl">

            “Fashion is the expression of who you are without having
            to say a word.”

          </blockquote>

          <div className="mt-9 flex items-center gap-4">

            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-rose-800 to-pink-600 text-white">

              <Crown size={20} />

            </div>

            <div>

              <p className="font-bold text-maroon-950">
                Jannat Elegance
              </p>

              <p className="text-xs text-pink-600">
                Celebrate Your Style
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>

  {/* ================= FOUNDER ================= */}
  <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-[#fff8fa] to-rose-100 py-20">

    <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-pink-300/20 blur-3xl" />

    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

      <div className="overflow-hidden rounded-[2.5rem] border border-pink-100 bg-white shadow-2xl shadow-pink-200/30">

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

          {/* Founder Visual */}
          <div className="relative min-h-[360px] bg-gradient-to-br from-maroon-950 via-rose-900 to-pink-700">

            {/* Replace this section with founder image later */}

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">

              <div className="grid h-28 w-28 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur">

                <UserPlaceholder />

              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-pink-200">
                The Founder
              </p>

            </div>

          </div>

          {/* Founder Content */}
          <div className="p-8 sm:p-12">

            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-pink-600">

              <Crown size={16} />

              Behind The Brand

            </p>

            <h2 className="mt-5 font-serif text-4xl text-maroon-950">

              A Dream To Create
              <span className="block text-rose-700">
                Something Beautiful
              </span>

            </h2>

            <p className="mt-6 leading-8 text-maroon-900/65">

              Jannat Elegance was built with a passion for fashion and a
              vision to create a destination where traditional Indian
              elegance meets the style of the modern woman.

            </p>

            <p className="mt-4 leading-8 text-maroon-900/65">

              The idea behind the brand is simple — every woman deserves
              to feel beautiful, confident and special. Through carefully
              selected designs and meaningful fashion experiences, Jannat
              Elegance continues to grow with this vision at its heart.

            </p>

            {/* IMPORTANT: Replace Founder Name */}
            <div className="mt-8 border-l-2 border-pink-400 pl-5">

              <p className="font-serif text-2xl font-semibold text-maroon-950">
                Founder Name
              </p>

              <p className="mt-1 text-sm text-pink-600">
                Founder, Jannat Elegance
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>

  {/* ================= CTA ================= */}
  <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-maroon-950 via-rose-900 to-pink-700 px-6 py-16 text-center text-white shadow-2xl sm:px-12">

      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-pink-300/10 blur-3xl" />

      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-pink-300/10 blur-3xl" />

      <div className="relative">

        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/10 text-pink-200">

          <Sparkles size={27} />

        </div>

        <h2 className="mt-6 font-serif text-4xl sm:text-5xl">

          Find Your Next
          <span className="block text-pink-200">
            Favourite Look
          </span>

        </h2>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-pink-100/75">

          Explore our collection and discover ethnic fashion designed
          for celebrations, memories and beautiful moments.

        </p>

        <Link
          href="/shop"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-maroon-950 shadow-xl transition hover:-translate-y-1 hover:bg-pink-50"
        >

          Shop The Collection

          <ArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />

        </Link>

      </div>

    </div>

  </section>

</main>

);
}

/* Founder Placeholder */

function UserPlaceholder() {
return ( <div className="relative">

  <div className="absolute inset-0 rounded-full bg-pink-300/30 blur-xl" />

  <Users
    size={52}
    className="relative text-pink-100"
  />

</div>

);
}
