'use client';

import { Star, Quote, Sparkles, MapPin, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export type Testimonial = {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
};

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ayesha Khan',
    location: 'New Delhi',
    rating: 5,
    review:
      'Absolutely beautiful collection! The fabric quality and finishing exceeded my expectations. Jannat Elegance truly makes you feel special.',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    review:
      'The outfit looked exactly like the pictures. Beautiful detailing, premium quality and excellent packaging. Highly recommended!',
  },
  {
    id: 3,
    name: 'Sana Fatima',
    location: 'Lucknow',
    rating: 5,
    review:
      'I received so many compliments after wearing my outfit. The design is elegant, comfortable and absolutely perfect for special occasions.',
  },
  {
    id: 4,
    name: 'Ananya Gupta',
    location: 'Jaipur',
    rating: 5,
    review:
      'A wonderful shopping experience from start to finish. The collection is stunning and the customer service was excellent.',
  },
];

type TestimonialsProps = {
  testimonials?: Testimonial[];
};

export default function Testimonials({
  testimonials = defaultTestimonials,
}: TestimonialsProps) {
  // Maximum 6 testimonials on homepage
  const displayedTestimonials = testimonials.slice(0, 3);

  // Show View All only when more than 6 exist
  const hasMoreTestimonials = testimonials.length > 3;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff8fa] via-white to-[#fff8fa] py-20 sm:py-24">

      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="pointer-events-none absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-[-120px] h-80 w-80 rounded-full bg-rose-200/25 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-100/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="mx-auto max-w-2xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-pink-600 shadow-sm backdrop-blur-sm">

            <Sparkles size={13} strokeWidth={2} />

            <span>Customer Love</span>

            <Sparkles size={13} strokeWidth={2} />

          </div>

          <h2 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-maroon-950 sm:text-5xl">
            Loved by Our{' '}
            <span className="text-rose-700">
              Queens
            </span>
          </h2>

          {/* Elegant Divider */}

          <div className="mx-auto mt-6 flex items-center justify-center gap-3">

            <span className="h-px w-12 bg-gradient-to-r from-transparent to-pink-300" />

            <Sparkles
              size={14}
              className="text-pink-500"
            />

            <span className="h-px w-12 bg-gradient-to-l from-transparent to-pink-300" />

          </div>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-maroon-900/60 sm:text-base">
            Every outfit tells a beautiful story. Discover what our customers
            have to say about their experience with Jannat Elegance.
          </p>

        </div>

        {/* ================= TESTIMONIAL CARDS ================= */}

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {displayedTestimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="
                group
                relative
                flex
                min-h-[330px]
                flex-col
                overflow-hidden
                rounded-[28px]
                border
                border-pink-100
                bg-white
                p-6
                shadow-[0_8px_30px_rgba(136,19,55,0.06)]
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-pink-200
                hover:shadow-[0_20px_50px_rgba(136,19,55,0.12)]
                sm:p-7
              "
            >

              {/* Top Decorative Glow */}

              <div className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-40
                w-40
                rounded-full
                bg-pink-100/40
                blur-3xl
                transition-opacity
                duration-500
                group-hover:bg-pink-200/50
              " />

              {/* ================= TOP ROW ================= */}

              <div className="relative flex items-center justify-between">

                {/* Rating */}

                <div className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  border
                  border-pink-100
                  bg-pink-50/70
                  px-3
                  py-1.5
                ">

                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={13}
                      strokeWidth={2}
                      className={
                        index < testimonial.rating
                          ? 'fill-pink-500 text-pink-500'
                          : 'text-pink-200'
                      }
                    />
                  ))}

                </div>

                {/* SMALL ELEGANT QUOTE */}

                <div className="
                  grid
                  h-9
                  w-9
                  place-items-center
                  rounded-full
                  border
                  border-pink-100
                  bg-[#fff8fa]
                  text-pink-400
                  transition-all
                  duration-300
                  group-hover:bg-pink-100
                  group-hover:text-rose-700
                ">

                  <Quote
                    size={17}
                    strokeWidth={2.2}
                  />

                </div>

              </div>

              {/* ================= REVIEW ================= */}

              <div className="relative flex flex-1 items-center">

                <p className="
                  mt-7
                  font-serif
                  text-[17px]
                  leading-8
                  text-maroon-950/80
                  sm:text-lg
                ">

                  “{testimonial.review}”

                </p>

              </div>

              {/* ================= DIVIDER ================= */}

              <div className="
                mt-7
                h-px
                w-full
                bg-gradient-to-r
                from-transparent
                via-pink-200
                to-transparent
              " />

              {/* ================= CUSTOMER ================= */}

              <div className="mt-6 flex items-center justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  {/* Avatar */}

                  <div className="
                    relative
                    grid
                    h-12
                    w-12
                    shrink-0
                    place-items-center
                    rounded-full
                    bg-gradient-to-br
                    from-rose-900
                    via-rose-800
                    to-pink-500
                    font-serif
                    text-lg
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-pink-200
                  ">

                    {testimonial.name.charAt(0)}

                  </div>

                  {/* Name */}

                  <div className="min-w-0">

                    <h3 className="
                      truncate
                      font-serif
                      text-base
                      font-semibold
                      text-maroon-950
                    ">
                      {testimonial.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-maroon-900/50">

                      <MapPin size={12} />

                      <span className="truncate">
                        {testimonial.location}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Verified Badge */}

                <div className="
                  hidden
                  rounded-full
                  border
                  border-pink-100
                  bg-pink-50
                  px-2.5
                  py-1
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-pink-600
                  sm:block
                ">
                  Verified
                </div>

              </div>

            </article>
          ))}

        </div>

        {/* ================= VIEW ALL ================= */}

        {hasMoreTestimonials && (

          <div className="mt-12 flex justify-center">

            <Link
              href="/testimonials"
              className="
                group
                inline-flex
                items-center
                gap-3
                rounded-full
                border
                border-maroon-900
                bg-maroon-950
                px-7
                py-3.5
                text-[11px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-white
                shadow-lg
                shadow-maroon-200/50
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-gradient-to-r
                hover:from-rose-900
                hover:to-pink-600
                hover:shadow-xl
              "
            >

              View All Testimonials

              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />

            </Link>

          </div>

        )}

      </div>

    </section>
  );
}