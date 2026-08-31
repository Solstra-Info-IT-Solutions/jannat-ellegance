'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import {
  ArrowLeft,
  Loader2,
  MessageSquareHeart,
  Search,
  Star,
} from 'lucide-react';


/* =====================================================
   TYPES
===================================================== */

type Testimonial = {
  _id?: string;

  id?: string;

  name: string;

  avatarUrl?: string;

  image?: string;

  rating: number;

  message: string;

  isApproved?: boolean;

  isActive?: boolean;

  createdAt: string;
};


/* =====================================================
   TESTIMONIALS PAGE
===================================================== */

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [search, setSearch] = useState('');

  const [selectedRating, setSelectedRating] =
    useState<number | null>(null);


  /* =====================================================
     LOAD TESTIMONIALS
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
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load testimonials.'
        );

        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);


  /* =====================================================
     FILTER TESTIMONIALS
  ===================================================== */

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(
      (testimonial) => {
        const searchText =
          search.trim().toLowerCase();

        const matchesSearch =
          !searchText ||
          testimonial.name
            ?.toLowerCase()
            .includes(searchText) ||
          testimonial.message
            ?.toLowerCase()
            .includes(searchText);

        const matchesRating =
          selectedRating === null ||
          testimonial.rating === selectedRating;

        return (
          matchesSearch &&
          matchesRating
        );
      }
    );
  }, [
    testimonials,
    search,
    selectedRating,
  ]);


  /* =====================================================
     AVERAGE RATING
  ===================================================== */

  const averageRating =
    testimonials.length > 0
      ? testimonials.reduce(
          (total, testimonial) =>
            total + testimonial.rating,
          0
        ) / testimonials.length
      : 0;


  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (
    date: string
  ) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        month: 'long',
        year: 'numeric',
      }
    );
  };


  /* =====================================================
     GET TESTIMONIAL ID
  ===================================================== */

  const getTestimonialId = (
    testimonial: Testimonial,
    index: number
  ) => {
    return (
      testimonial.id ||
      testimonial._id ||
      `${testimonial.name}-${index}`
    );
  };


  return (
    <main className="min-h-screen bg-[#fff8fa]">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-pink-700 py-20 text-white">

        {/* Background Decorations */}

        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-rose-300/20 blur-3xl" />


        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">

          {/* Back Button */}

          <div className="mb-10 text-left">

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-pink-100 transition hover:text-white"
            >
              <ArrowLeft size={17} />

              Back to Home

            </Link>

          </div>


          {/* Icon */}

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur">

            <MessageSquareHeart
              size={28}
              className="text-pink-200"
            />

          </div>


          <p className="mt-6 text-xs font-bold uppercase tracking-[0.35em] text-pink-200">

            Customer Love

          </p>


          <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl">

            What Our Customers Say

          </h1>


          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-pink-100/80 sm:text-base">

            Every outfit tells a story. Discover the experiences of
            customers who chose Jannat Elegance for their special moments.

          </p>


          {/* Rating Summary */}

          {loading ? (

            <div className="mx-auto mt-10 flex w-fit items-center gap-3 rounded-3xl border border-white/15 bg-white/10 px-8 py-5 backdrop-blur">

              <Loader2
                size={22}
                className="animate-spin text-pink-200"
              />

              <span className="text-sm text-pink-100">

                Loading reviews...

              </span>

            </div>

          ) : testimonials.length > 0 ? (

            <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-3 rounded-3xl border border-white/15 bg-white/10 px-8 py-5 backdrop-blur sm:flex-row">

              <div className="flex items-center gap-1">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <=
                        Math.round(averageRating)
                          ? 'fill-pink-300 text-pink-300'
                          : 'text-white/30'
                      }
                    />
                  )
                )}

              </div>


              <div className="hidden h-8 w-px bg-white/20 sm:block" />


              <div className="text-center sm:text-left">

                <p className="text-xl font-bold">

                  {averageRating.toFixed(1)} / 5

                </p>


                <p className="text-xs text-pink-100/70">

                  Based on{' '}

                  {testimonials.length}{' '}

                  customer review
                  {testimonials.length !== 1
                    ? 's'
                    : ''}

                </p>

              </div>

            </div>

          ) : (

            <div className="mx-auto mt-10 w-fit rounded-3xl border border-white/15 bg-white/10 px-8 py-5 backdrop-blur">

              <p className="text-sm text-pink-100/80">

                No customer reviews yet

              </p>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          TESTIMONIAL CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">


        {/* Heading + Search */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">


          <div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-600">

              Real Experiences

            </p>


            <h2 className="mt-3 font-serif text-3xl text-maroon-950 sm:text-4xl">

              Loved by Our Customers

            </h2>

          </div>


          {/* Search */}

          {testimonials.length > 0 && (

            <div className="relative w-full lg:max-w-sm">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500"
              />


              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search testimonials..."
                className="w-full rounded-full border border-pink-100 bg-white py-3 pl-11 pr-5 text-sm text-maroon-950 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
              />

            </div>

          )}

        </div>


        {/* =====================================================
            LOADING STATE
        ===================================================== */}

        {loading ? (

          <div className="grid min-h-[400px] place-items-center">

            <div className="text-center">

              <Loader2
                size={40}
                className="mx-auto animate-spin text-pink-500"
              />

              <p className="mt-5 text-sm text-gray-500">

                Loading customer testimonials...

              </p>

            </div>

          </div>


        /* =====================================================
           ERROR STATE
        ===================================================== */

        ) : error ? (

          <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 px-6 py-16 text-center">

            <MessageSquareHeart
              size={42}
              className="mx-auto text-red-300"
            />

            <h3 className="mt-5 font-serif text-2xl text-red-800">

              Unable to Load Testimonials

            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-red-600">

              {error}

            </p>

          </div>


        /* =====================================================
           NO TESTIMONIALS
        ===================================================== */

        ) : testimonials.length === 0 ? (

          <div className="mt-10 rounded-3xl border border-dashed border-pink-200 bg-white py-20 text-center">

            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-pink-50">

              <MessageSquareHeart
                size={38}
                className="text-pink-400"
              />

            </div>


            <h3 className="mt-6 font-serif text-2xl text-maroon-950">

              No Testimonials Found

            </h3>


            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">

              We don't have any customer testimonials to display yet.
              Please check back soon.

            </p>

          </div>


        ) : (

          <>

            {/* =====================================================
                FILTERS
            ===================================================== */}

            <div className="mt-8 flex flex-wrap gap-3">

              <button
                onClick={() =>
                  setSelectedRating(null)
                }
                className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  selectedRating === null
                    ? 'bg-maroon-900 text-white shadow-lg'
                    : 'border border-maroon-100 bg-white text-maroon-800 hover:bg-maroon-50'
                }`}
              >

                All Reviews

              </button>


              {[5, 4, 3, 2, 1].map(
                (rating) => (

                  <button
                    key={rating}
                    onClick={() =>
                      setSelectedRating(rating)
                    }
                    className={`inline-flex items-center gap-1 rounded-full px-5 py-2.5 text-xs font-bold transition ${
                      selectedRating === rating
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'border border-pink-100 bg-white text-maroon-800 hover:bg-pink-50'
                    }`}
                  >

                    {rating}

                    <Star
                      size={13}
                      className="fill-current"
                    />

                  </button>

                )
              )}

            </div>


            {/* =====================================================
                RESULTS COUNT
            ===================================================== */}

            <p className="mt-8 text-sm text-gray-500">

              Showing{' '}

              <span className="font-bold text-maroon-950">

                {filteredTestimonials.length}

              </span>{' '}

              review
              {filteredTestimonials.length !== 1
                ? 's'
                : ''}

            </p>


            {/* =====================================================
                TESTIMONIAL GRID
            ===================================================== */}

            {filteredTestimonials.length > 0 ? (

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {filteredTestimonials.map(
                  (testimonial, index) => (

                    <article
                      key={getTestimonialId(
                        testimonial,
                        index
                      )}
                      className="group flex flex-col rounded-[1.8rem] border border-pink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl"
                    >


                      {/* Quote */}

                      <div className="text-5xl font-serif leading-none text-pink-200">

                        “

                      </div>


                      {/* Review */}

                      <p className="mt-3 flex-grow text-sm leading-7 text-gray-600">

                        {testimonial.message}

                      </p>


                      {/* Footer */}

                      <div className="mt-6 border-t border-pink-100 pt-5">

                        <div className="flex items-end justify-between gap-4">


                          <div>


                            {/* Stars */}

                            <div className="flex gap-1">

                              {[1, 2, 3, 4, 5].map(
                                (star) => (

                                  <Star
                                    key={star}
                                    size={14}
                                    className={
                                      star <=
                                      testimonial.rating
                                        ? 'fill-pink-500 text-pink-500'
                                        : 'text-pink-100'
                                    }
                                  />

                                )
                              )}

                            </div>


                            <div className="mt-4 flex items-center gap-3">


                              {/* Avatar */}

                              {(
                                testimonial.avatarUrl ||
                                testimonial.image
                              ) ? (

                                <img
                                  src={
                                    testimonial.avatarUrl ||
                                    testimonial.image
                                  }
                                  alt={testimonial.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />

                              ) : (

                                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose-900 to-pink-500 font-serif text-sm font-bold text-white">

                                  {testimonial.name
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    'C'}

                                </div>

                              )}


                              <div>

                                <p className="font-serif text-lg text-maroon-950">

                                  {testimonial.name}

                                </p>


                                <p className="mt-1 text-xs text-gray-400">

                                  Verified Customer

                                </p>

                              </div>

                            </div>

                          </div>


                          {/* Date */}

                          <p className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">

                            {formatDate(
                              testimonial.createdAt
                            )}

                          </p>

                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>


            /* =====================================================
               FILTER EMPTY STATE
            ===================================================== */

            ) : (

              <div className="mt-10 rounded-3xl border border-dashed border-pink-200 bg-white py-20 text-center">

                <MessageSquareHeart
                  size={42}
                  className="mx-auto text-pink-300"
                />


                <h3 className="mt-5 font-serif text-2xl text-maroon-950">

                  No Reviews Found

                </h3>


                <p className="mt-2 text-sm text-gray-500">

                  Try changing your search or rating filter.

                </p>


                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedRating(null);
                  }}
                  className="mt-6 rounded-full bg-maroon-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
                >

                  Clear Filters

                </button>

              </div>

            )}

          </>

        )}

      </section>


      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="border-t border-pink-100 bg-white">

        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">

          <MessageSquareHeart
            size={30}
            className="mx-auto text-pink-500"
          />


          <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-pink-600">

            Your Experience Matters

          </p>


          <h2 className="mt-3 font-serif text-3xl text-maroon-950">

            Thank You for Choosing Jannat Elegance

          </h2>


          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">

            Your feedback helps us create better experiences and continue
            bringing elegance to your special moments.

          </p>


          <Link
            href="/orders"
            className="mt-7 inline-flex rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >

            View My Orders

          </Link>

        </div>

      </section>

    </main>
  );
}