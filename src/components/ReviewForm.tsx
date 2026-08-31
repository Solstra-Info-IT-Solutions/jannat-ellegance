'use client';

import { FormEvent, useState } from 'react';

import {
  CheckCircle2,
  Loader2,
  MessageSquareHeart,
  Star,
  X,
} from 'lucide-react';

import toast from 'react-hot-toast';

type ReviewFormProps = {
  productName: string;
  onClose: () => void;
};

export default function ReviewForm({
  productName,
  onClose,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    if (rating === 0) {
      toast.error('Please select a star rating.');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',

        credentials: 'include',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          productName,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            'Unable to submit your review.'
        );
      }

      toast.success(
        data.message ||
          'Thank you! Your review has been submitted.'
      );

      setRating(0);
      setHoverRating(0);
      setComment('');

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to submit your review.'
      );
    } finally {
      setLoading(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-rose-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-2xl">

        {/* Header */}

        <div className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-pink-700 px-6 py-8 text-white sm:px-8">

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-300/20 blur-3xl" />

          <div className="relative flex items-start justify-between gap-5">

            <div>
              <div className="flex items-center gap-2 text-pink-200">

                <MessageSquareHeart size={16} />

                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Customer Experience
                </span>

              </div>

              <h2 className="mt-3 font-serif text-3xl">
                Share Your Review
              </h2>

              <p className="mt-2 text-sm leading-6 text-pink-100/80">
                We would love to know about your experience.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="grid h-10 w-10 flex-none place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50"
              aria-label="Close review form"
            >
              <X size={19} />
            </button>

          </div>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8"
        >

          {/* Product */}

          <div className="rounded-2xl bg-[#fff8fa] p-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-pink-600">
              Reviewing
            </p>

            <p className="mt-1 font-serif text-xl text-maroon-950">
              {productName}
            </p>

          </div>

          {/* Rating */}

          <div className="mt-7">

            <div className="flex items-center justify-between">

              <label className="text-sm font-bold text-maroon-950">
                Your Rating
              </label>

              <span className="text-xs font-medium text-pink-600">
                {rating
                  ? `${rating} / 5 Stars`
                  : 'Select your rating'}
              </span>

            </div>

            <div className="mt-4 flex gap-2">

              {[1, 2, 3, 4, 5].map((star) => (

                <button
                  key={star}
                  type="button"
                  disabled={loading}
                  onClick={() => setRating(star)}
                  onMouseEnter={() =>
                    setHoverRating(star)
                  }
                  onMouseLeave={() =>
                    setHoverRating(0)
                  }
                  className="transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed"
                  aria-label={`${star} star`}
                >

                  <Star
                    size={36}
                    className={
                      star <= activeRating
                        ? 'fill-pink-500 text-pink-500'
                        : 'text-pink-200'
                    }
                  />

                </button>

              ))}

            </div>

          </div>

          {/* Review */}

          <div className="mt-7">

            <div className="flex items-center justify-between">

              <label
                htmlFor="review-comment"
                className="text-sm font-bold text-maroon-950"
              >
                Your Experience
              </label>

              <span className="text-xs text-gray-400">
                {comment.length}/1000
              </span>

            </div>

            <textarea
              id="review-comment"
              value={comment}
              disabled={loading}
              onChange={(event) =>
                setComment(event.target.value)
              }
              maxLength={1000}
              rows={6}
              placeholder="Tell us about the quality, design, fitting and your overall experience..."
              className="mt-3 w-full resize-none rounded-2xl border border-maroon-100 bg-[#fffafb] p-4 text-sm leading-6 text-maroon-950 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-gray-400">
              Minimum 10 characters required.
            </p>

          </div>

          {/* Info */}

          <div className="mt-5 flex gap-3 rounded-2xl bg-pink-50 p-4 text-xs leading-5 text-rose-800">

            <CheckCircle2
              size={17}
              className="mt-0.5 flex-none text-pink-600"
            />

            <p>
              Your review will be submitted for admin approval.
            </p>

          </div>

          {/* Buttons */}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-full border border-maroon-200 px-6 py-3 text-xs font-bold uppercase tracking-wider text-maroon-800 transition hover:bg-maroon-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}