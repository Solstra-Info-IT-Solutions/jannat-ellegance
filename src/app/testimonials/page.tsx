'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
ArrowLeft,
MessageSquareHeart,
Search,
Star,
} from 'lucide-react';

type Testimonial = {
id: number;
name: string;
location: string;
rating: number;
review: string;
product: string;
date: string;
};

const testimonials: Testimonial[] = [
{
id: 1,
name: 'Ayesha Khan',
location: 'Delhi, India',
rating: 5,
review:
'Absolutely beautiful outfit! The fabric quality, fitting and detailing were even better than I expected. I received so many compliments.',
product: 'Luxury Sharara Suit',
date: 'August 2026',
},
{
id: 2,
name: 'Fatima Sheikh',
location: 'Mumbai, India',
rating: 5,
review:
'Jannat Elegance truly lives up to its name. The outfit looked royal and elegant, and the stitching quality was excellent.',
product: 'Designer Gown',
date: 'August 2026',
},
{
id: 3,
name: 'Sana Ali',
location: 'Lucknow, India',
rating: 5,
review:
'One of my best online shopping experiences. The delivery was smooth and the dress looked exactly like the pictures.',
product: 'Farshi Shalwar Suit',
date: 'July 2026',
},
{
id: 4,
name: 'Zoya Ahmed',
location: 'Jaipur, India',
rating: 5,
review:
'The design is absolutely gorgeous. The fitting was perfect and the outfit made me feel incredibly confident and elegant.',
product: 'Premium Lehenga',
date: 'July 2026',
},
{
id: 5,
name: 'Mehak Sharma',
location: 'Chandigarh, India',
rating: 4,
review:
'Beautiful collection and great quality. The outfit was comfortable and looked amazing for the occasion.',
product: 'Pant Suit',
date: 'June 2026',
},
{
id: 6,
name: 'Riya Kapoor',
location: 'Noida, India',
rating: 5,
review:
'I loved everything about my order. The packaging was beautiful and the outfit felt premium from the moment I opened it.',
product: 'Embroidered Frock Suit',
date: 'June 2026',
},
{
id: 7,
name: 'Anam Siddiqui',
location: 'Hyderabad, India',
rating: 5,
review:
'The craftsmanship is beautiful. Every small detail was perfect and the outfit looked even more stunning in person.',
product: 'Garara Suit',
date: 'May 2026',
},
{
id: 8,
name: 'Priya Verma',
location: 'Bangalore, India',
rating: 4,
review:
'Very happy with my purchase. Great quality, beautiful colour and excellent customer support.',
product: 'Designer Plazo Suit',
date: 'May 2026',
},
];

export default function TestimonialsPage() {
const [search, setSearch] = useState('');
const [selectedRating, setSelectedRating] = useState<number | null>(
null
);

const filteredTestimonials = useMemo(() => {
return testimonials.filter((testimonial) => {
const searchText = search.toLowerCase();

  const matchesSearch =
    testimonial.name.toLowerCase().includes(searchText) ||
    testimonial.location.toLowerCase().includes(searchText) ||
    testimonial.product.toLowerCase().includes(searchText) ||
    testimonial.review.toLowerCase().includes(searchText);

  const matchesRating =
    selectedRating === null ||
    testimonial.rating === selectedRating;

  return matchesSearch && matchesRating;
});

}, [search, selectedRating]);

const averageRating =
testimonials.reduce(
(total, testimonial) => total + testimonial.rating,
0
) / testimonials.length;

return ( <main className="min-h-screen bg-[#fff8fa]">

  {/* HERO SECTION */}
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
      <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-3 rounded-3xl border border-white/15 bg-white/10 px-8 py-5 backdrop-blur sm:flex-row">

        <div className="flex items-center gap-1">

          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              className="fill-pink-300 text-pink-300"
            />
          ))}

        </div>

        <div className="hidden h-8 w-px bg-white/20 sm:block" />

        <div className="text-center sm:text-left">

          <p className="text-xl font-bold">
            {averageRating.toFixed(1)} / 5
          </p>

          <p className="text-xs text-pink-100/70">
            Based on {testimonials.length} customer reviews
          </p>

        </div>

      </div>

    </div>

  </section>

  {/* TESTIMONIAL CONTENT */}
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

    </div>

    {/* FILTERS */}
    <div className="mt-8 flex flex-wrap gap-3">

      <button
        onClick={() => setSelectedRating(null)}
        className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
          selectedRating === null
            ? 'bg-maroon-900 text-white shadow-lg'
            : 'border border-maroon-100 bg-white text-maroon-800 hover:bg-maroon-50'
        }`}
      >
        All Reviews
      </button>

      {[5, 4, 3, 2, 1].map((rating) => (
        <button
          key={rating}
          onClick={() => setSelectedRating(rating)}
          className={`inline-flex items-center gap-1 rounded-full px-5 py-2.5 text-xs font-bold transition ${
            selectedRating === rating
              ? 'bg-pink-600 text-white shadow-lg'
              : 'border border-pink-100 bg-white text-maroon-800 hover:bg-pink-50'
          }`}
        >
          {rating}
          <Star size={13} className="fill-current" />
        </button>
      ))}

    </div>

    {/* RESULTS COUNT */}
    <p className="mt-8 text-sm text-gray-500">

      Showing{' '}

      <span className="font-bold text-maroon-950">
        {filteredTestimonials.length}
      </span>{' '}

      {filteredTestimonials.length === 1
        ? 'review'
        : 'reviews'}

    </p>

    {/* TESTIMONIAL GRID */}
    {filteredTestimonials.length > 0 ? (

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {filteredTestimonials.map((testimonial) => (

          <article
            key={testimonial.id}
            className="group flex flex-col rounded-[1.8rem] border border-pink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl"
          >

            {/* Quote */}
            <div className="text-5xl font-serif leading-none text-pink-200">
              “
            </div>

            {/* Review */}
            <p className="mt-3 flex-grow text-sm leading-7 text-gray-600">
              {testimonial.review}
            </p>

            {/* Product */}
            <div className="mt-6 rounded-xl bg-[#fff8fa] px-4 py-3">

              <p className="text-[10px] font-bold uppercase tracking-wider text-pink-600">
                Purchased
              </p>

              <p className="mt-1 text-sm font-semibold text-maroon-950">
                {testimonial.product}
              </p>

            </div>

            {/* Footer */}
            <div className="mt-5 flex items-end justify-between gap-4">

              <div>

                {/* Stars */}
                <div className="flex gap-1">

                  {[1, 2, 3, 4, 5].map((star) => (

                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= testimonial.rating
                          ? 'fill-pink-500 text-pink-500'
                          : 'text-pink-100'
                      }
                    />

                  ))}

                </div>

                <p className="mt-3 font-serif text-lg text-maroon-950">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {testimonial.location}
                </p>

              </div>

              <p className="text-right text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {testimonial.date}
              </p>

            </div>

          </article>

        ))}

      </div>

    ) : (

      /* EMPTY STATE */
      <div className="mt-10 rounded-3xl border border-dashed border-pink-200 bg-white py-20 text-center">

        <MessageSquareHeart
          size={42}
          className="mx-auto text-pink-300"
        />

        <h3 className="mt-5 font-serif text-2xl text-maroon-950">
          No reviews found
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

  </section>

  {/* BOTTOM CTA */}
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
