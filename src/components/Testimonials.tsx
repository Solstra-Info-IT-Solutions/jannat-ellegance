'use client';

import { Star, Quote, Sparkles } from 'lucide-react';
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
const displayedTestimonials = testimonials.slice(0, 3);
const hasMoreTestimonials = testimonials.length > 3;

return ( <section className="relative overflow-hidden bg-[#fff8fa] py-20 sm:py-24">

  {/* Background Decorations */}
  <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />
  <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Section Header */}
    <div className="mx-auto max-w-2xl text-center">

      <div className="flex items-center justify-center gap-2 text-pink-600">
        <Sparkles size={16} />

        <span className="text-xs font-bold uppercase tracking-[0.3em]">
          Customer Love
        </span>

        <Sparkles size={16} />
      </div>

      <h2 className="mt-4 font-serif text-4xl font-semibold text-rose-950 sm:text-5xl">
        Loved by Our Queens
      </h2>

      <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />

      <p className="mt-5 text-sm leading-7 text-rose-900/60 sm:text-base">
        Every outfit tells a story. Here's what our beautiful customers
        have to say about their experience with Jannat Elegance.
      </p>
    </div>

    {/* Testimonials */}
    <div className="mt-14 flex gap-5 overflow-x-auto pb-5 pt-2 scrollbar-hide">

      {displayedTestimonials.map((testimonial) => (
        <article
          key={testimonial.id}
          className="group relative min-w-[300px] flex-1 overflow-hidden rounded-3xl border border-pink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:min-w-[340px]"
        >

          {/* Quote Icon */}
          <div className="absolute right-5 top-5 text-pink-100 transition group-hover:text-pink-200">
            <Quote size={55} fill="currentColor" />
          </div>

          {/* Stars */}
          <div className="relative flex gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={16}
                className={
                  index < testimonial.rating
                    ? 'fill-pink-500 text-pink-500'
                    : 'text-pink-200'
                }
              />
            ))}
          </div>

          {/* Review */}
          <p className="relative mt-5 min-h-[120px] text-sm leading-7 text-rose-950/70">
            "{testimonial.review}"
          </p>

          {/* Divider */}
          <div className="my-6 h-px w-full bg-gradient-to-r from-pink-100 via-rose-200 to-transparent" />

          {/* Customer */}
          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-900 font-serif text-lg font-semibold text-white shadow-md">
              {testimonial.name.charAt(0)}
            </div>

            <div>
              <h3 className="font-semibold text-rose-950">
                {testimonial.name}
              </h3>

              <p className="mt-0.5 text-xs text-rose-900/50">
                {testimonial.location}
              </p>
            </div>

          </div>

        </article>
      ))}
    </div>

    {/* View All Button - Only if more than 6 testimonials */}
    {hasMoreTestimonials && (
      <div className="mt-10 flex justify-center">
        <Link
          href="/testimonials"
          className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-rose-900 to-pink-600 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          View All Testimonials

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    )}

  </div>
</section>

);
}
