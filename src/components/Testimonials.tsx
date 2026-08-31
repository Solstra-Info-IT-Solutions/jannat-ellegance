'use client';

import { useEffect, useState } from 'react';

import {
  ArrowUpRight,
  Loader2,
  MapPin,
  Quote,
  Sparkles,
  Star,
} from 'lucide-react';

import Link from 'next/link';


type Testimonial = {
  _id?: string;
  id?: string;

  name: string;

  avatarUrl?: string;

  rating: number;

  message: string;

  createdAt?: string;
};


export default function Testimonials() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');


  /* =====================================================
     LOAD APPROVED TESTIMONIALS
  ===================================================== */

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          '/api/testimonials',
          {
            cache: 'no-store',
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              'Unable to load testimonials.'
          );
        }

        setTestimonials(
          data.testimonials || []
        );
      } catch (error) {
        console.error(
          'Testimonial loading error:',
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load testimonials.'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadTestimonials();
  }, []);


  /* =====================================================
     MAXIMUM 3 ON HOMEPAGE
  ===================================================== */

  const displayedTestimonials =
    testimonials.slice(0, 3);

  const hasMoreTestimonials =
    testimonials.length > 3;


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fff8fa] via-white to-[#fff8fa] py-20 sm:py-24">

        <div className="mx-auto flex min-h-[350px] max-w-7xl items-center justify-center px-4">

          <div className="text-center">

            <Loader2
              size={34}
              className="mx-auto animate-spin text-pink-500"
            />

            <p className="mt-4 text-sm text-gray-500">
              Loading customer reviews...
            </p>

          </div>

        </div>

      </section>
    );
  }


  /* =====================================================
     NO TESTIMONIALS
     
     Homepage section hide karna ho to:
     if (!testimonials.length) return null;
  ===================================================== */

  if (!testimonials.length) {
    return null;
  }


  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff8fa] via-white to-[#fff8fa] py-20 sm:py-24">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-pink-200/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-[-120px] h-80 w-80 rounded-full bg-rose-200/25 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-100/20 blur-3xl" />


      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


        {/* ================= HEADER ================= */}

        <div className="mx-auto max-w-2xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-pink-600 shadow-sm backdrop-blur-sm">

            <Sparkles
              size={13}
              strokeWidth={2}
            />

            <span>Customer Love</span>

            <Sparkles
              size={13}
              strokeWidth={2}
            />

          </div>


          <h2 className="mt-5 font-serif text-4xl font-semibold tracking-tight text-maroon-950 sm:text-5xl">

            Loved by Our{' '}

            <span className="text-rose-700">
              Queens
            </span>

          </h2>


          <div className="mx-auto mt-6 flex items-center justify-center gap-3">

            <span className="h-px w-12 bg-gradient-to-r from-transparent to-pink-300" />

            <Sparkles
              size={14}
              className="text-pink-500"
            />

            <span className="h-px w-12 bg-gradient-to-l from-transparent to-pink-300" />

          </div>


          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-maroon-900/60 sm:text-base">

            Every outfit tells a beautiful story.
            Discover what our customers have to say
            about their experience with Jannat Elegance.

          </p>

        </div>


        {/* ================= ERROR ================= */}

        {error && (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-center text-sm text-red-600">

            Unable to load customer reviews right now.

          </div>
        )}


        {/* ================= TESTIMONIAL CARDS ================= */}

        {!error && (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {displayedTestimonials.map(
              (testimonial, index) => {
                const testimonialId =
                  testimonial.id ||
                  testimonial._id ||
                  `${testimonial.name}-${index}`;

                const initial =
                  testimonial.name
                    ?.charAt(0)
                    ?.toUpperCase() || 'C';

                return (
                  <article
                    key={testimonialId}
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

                    {/* Decorative Glow */}

                    <div
                      className="
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
                      "
                    />


                    {/* ================= TOP ROW ================= */}

                    <div className="relative flex items-center justify-between">


                      {/* Rating */}

                      <div
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-full
                          border
                          border-pink-100
                          bg-pink-50/70
                          px-3
                          py-1.5
                        "
                      >

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              size={13}
                              strokeWidth={2}
                              className={
                                star <= testimonial.rating
                                  ? 'fill-pink-500 text-pink-500'
                                  : 'text-pink-200'
                              }
                            />
                          )
                        )}

                      </div>


                      {/* Quote */}

                      <div
                        className="
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
                        "
                      >

                        <Quote
                          size={17}
                          strokeWidth={2.2}
                        />

                      </div>

                    </div>


                    {/* ================= REVIEW ================= */}

                    <div className="relative flex flex-1 items-center">

                      <p
                        className="
                          mt-7
                          font-serif
                          text-[17px]
                          leading-8
                          text-maroon-950/80
                          sm:text-lg
                        "
                      >

                        “{testimonial.message}”

                      </p>

                    </div>


                    {/* ================= DIVIDER ================= */}

                    <div
                      className="
                        mt-7
                        h-px
                        w-full
                        bg-gradient-to-r
                        from-transparent
                        via-pink-200
                        to-transparent
                      "
                    />


                    {/* ================= CUSTOMER ================= */}

                    <div className="mt-6 flex items-center justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-3">


                        {/* Avatar */}

                        <div
                          className="
                            relative
                            grid
                            h-12
                            w-12
                            shrink-0
                            place-items-center
                            overflow-hidden
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
                          "
                        >

                          {testimonial.avatarUrl ? (
                            <img
                              src={
                                testimonial.avatarUrl
                              }
                              alt={
                                testimonial.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initial
                          )}

                        </div>


                        {/* Name */}

                        <div className="min-w-0">

                          <h3
                            className="
                              truncate
                              font-serif
                              text-base
                              font-semibold
                              text-maroon-950
                            "
                          >

                            {testimonial.name}

                          </h3>


                          <div className="mt-1 flex items-center gap-1.5 text-xs text-maroon-900/50">

                            <MapPin size={12} />

                            <span className="truncate">
                              Verified Customer
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* Verified Badge */}

                      <div
                        className="
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
                        "
                      >

                        Verified

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}


        {/* ================= VIEW ALL ================= */}

        {hasMoreTestimonials && !error && (

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
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                  group-hover:-translate-y-1
                "
              />

            </Link>

          </div>

        )}

      </div>

    </section>
  );
}