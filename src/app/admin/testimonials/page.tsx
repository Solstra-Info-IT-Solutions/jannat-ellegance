'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  MessageSquareQuote,
  RefreshCw,
  Star,
  Trash2,
  X,
} from 'lucide-react';

import AdminShell from '@/components/admin/AdminShell';

type Testimonial = {
  id: string;

  name: string;

  avatarUrl?: string;

  rating: number;

  message: string;

  image?: string;

  isApproved: boolean;

  isActive: boolean;

  createdAt: string;
};

type Filter = 'all' | 'pending' | 'approved' | 'hidden';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<
    Testimonial[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [filter, setFilter] =
    useState<Filter>('all');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  /* =====================================================
     LOAD TESTIMONIALS
  ===================================================== */

  const loadTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        '/api/admin/testimonials',
        {
          credentials: 'include',
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

      setTestimonials(data.testimonials || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load testimonials.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTestimonials();
  }, [loadTestimonials]);

  /* =====================================================
     SUCCESS MESSAGE AUTO HIDE
  ===================================================== */

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      setMessage('');
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [message]);

  /* =====================================================
     UPDATE TESTIMONIAL
  ===================================================== */

  const updateTestimonial = async (
    id: string,
    updates: Partial<
      Pick<Testimonial, 'isApproved' | 'isActive'>
    >
  ) => {
    try {
      setUpdatingId(id);
      setError('');

      const response = await fetch(
        `/api/admin/testimonials/${id}`,
        {
          method: 'PATCH',

          credentials: 'include',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Unable to update testimonial.'
        );
      }

      const updatedTestimonial =
        data.testimonial;

      setTestimonials((current) =>
        current.map((testimonial) =>
          testimonial.id === id
            ? {
                ...testimonial,
                ...updatedTestimonial,

                id:
                  updatedTestimonial.id ||
                  testimonial.id,
              }
            : testimonial
        )
      );

      if (updates.isApproved === true) {
        setMessage(
          'Testimonial approved successfully.'
        );
      } else if (updates.isActive === false) {
        setMessage(
          'Testimonial hidden successfully.'
        );
      } else if (updates.isActive === true) {
        setMessage(
          'Testimonial is now visible.'
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to update testimonial.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* =====================================================
     DELETE TESTIMONIAL
  ===================================================== */

  const deleteTestimonial = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this testimonial?'
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError('');

      const response = await fetch(
        `/api/admin/testimonials/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Unable to delete testimonial.'
        );
      }

      setTestimonials((current) =>
        current.filter(
          (testimonial) =>
            testimonial.id !== id
        )
      );

      setMessage(
        'Testimonial deleted successfully.'
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to delete testimonial.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     FILTERS
  ===================================================== */

  const filteredTestimonials =
    testimonials.filter((testimonial) => {
      if (filter === 'pending') {
        return !testimonial.isApproved;
      }

      if (filter === 'approved') {
        return (
          testimonial.isApproved &&
          testimonial.isActive
        );
      }

      if (filter === 'hidden') {
        return !testimonial.isActive;
      }

      return true;
    });

  const pendingCount = testimonials.filter(
    (item) => !item.isApproved
  ).length;

  const approvedCount = testimonials.filter(
    (item) =>
      item.isApproved && item.isActive
  ).length;

  const hiddenCount = testimonials.filter(
    (item) => !item.isActive
  ).length;

  return (
    <AdminShell title="Testimonials">
      <div className="space-y-6">

        {/* ================= TOP PANEL ================= */}

        <section className="rounded-[28px] border border-maroon-100 bg-[#fff3f6] p-5 sm:p-7">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

            <div className="flex gap-4">

              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-maroon-950 text-pink-200">
                <MessageSquareQuote size={22} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-600">
                  Customer Feedback
                </p>

                <h2 className="mt-1 font-serif text-2xl text-maroon-950">
                  Manage Testimonials
                </h2>

                <p className="mt-1 text-sm text-maroon-800/70">
                  Review, approve, hide or remove customer feedback.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => void loadTestimonials()}
              disabled={loading}
              className="
                inline-flex items-center justify-center gap-2
                rounded-full
                bg-maroon-950
                px-5 py-3
                text-xs font-bold uppercase tracking-wider
                text-white
                transition
                hover:bg-maroon-900
                disabled:opacity-60
              "
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? 'animate-spin'
                    : ''
                }
              />

              Refresh

            </button>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="All Testimonials"
            value={testimonials.length}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />

          <StatCard
            label="Pending Review"
            value={pendingCount}
            active={filter === 'pending'}
            onClick={() => setFilter('pending')}
          />

          <StatCard
            label="Approved"
            value={approvedCount}
            active={filter === 'approved'}
            onClick={() =>
              setFilter('approved')
            }
          />

          <StatCard
            label="Hidden"
            value={hiddenCount}
            active={filter === 'hidden'}
            onClick={() => setFilter('hidden')}
          />

        </section>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError('')}
              className="shrink-0"
              aria-label="Close error"
            >
              <X size={18} />
            </button>

          </div>
        )}

        {/* ================= SUCCESS ================= */}

        {message && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">

            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage('')}
              className="shrink-0"
              aria-label="Close message"
            >
              <X size={18} />
            </button>

          </div>
        )}

        {/* ================= LIST ================= */}

        <section className="overflow-hidden rounded-[28px] border border-maroon-100 bg-[#fff8fa]">

          <div className="flex items-center justify-between border-b border-maroon-100 px-5 py-5 sm:px-7">

            <div>

              <h2 className="font-serif text-xl text-maroon-950">
                Customer Reviews
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {filteredTestimonials.length} testimonial
                {filteredTestimonials.length !== 1
                  ? 's'
                  : ''}
              </p>

            </div>

          </div>

          {/* Loading */}

          {loading ? (
            <div className="grid min-h-[300px] place-items-center">

              <div className="text-center">

                <Loader2
                  size={30}
                  className="mx-auto animate-spin text-maroon-700"
                />

                <p className="mt-4 text-sm text-gray-500">
                  Loading testimonials...
                </p>

              </div>

            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="grid min-h-[300px] place-items-center px-5">

              <div className="text-center">

                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-maroon-50 text-maroon-700">
                  <MessageSquareQuote size={28} />
                </div>

                <h3 className="mt-5 font-serif text-xl text-maroon-950">
                  No testimonials found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Customer testimonials will appear here.
                </p>

              </div>

            </div>
          ) : (
            <div className="divide-y divide-maroon-100">

              {filteredTestimonials.map(
                (testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    updating={
                      updatingId === testimonial.id
                    }
                    deleting={
                      deletingId === testimonial.id
                    }
                    onApprove={() =>
                      void updateTestimonial(
                        testimonial.id,
                        {
                          isApproved: true,
                          isActive: true,
                        }
                      )
                    }
                    onToggleVisibility={() =>
                      void updateTestimonial(
                        testimonial.id,
                        {
                          isActive:
                            !testimonial.isActive,
                        }
                      )
                    }
                    onDelete={() =>
                      void deleteTestimonial(
                        testimonial.id
                      )
                    }
                  />
                )
              )}

            </div>
          )}

        </section>

      </div>
    </AdminShell>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-2xl
        border
        p-5
        text-left
        transition-all
        ${
          active
            ? 'border-maroon-800 bg-maroon-950 text-white shadow-lg'
            : 'border-maroon-100 bg-[#fff3f6] text-maroon-950 hover:border-maroon-300'
        }
      `}
    >
      <p
        className={`
          text-[10px]
          font-bold
          uppercase
          tracking-wider
          ${
            active
              ? 'text-pink-200'
              : 'text-pink-600'
          }
        `}
      >
        {label}
      </p>

      <p className="mt-3 font-serif text-3xl">
        {value}
      </p>

    </button>
  );
}


/* =====================================================
   TESTIMONIAL CARD
===================================================== */

function TestimonialCard({
  testimonial,
  updating,
  deleting,
  onApprove,
  onToggleVisibility,
  onDelete,
}: {
  testimonial: Testimonial;
  updating: boolean;
  deleting: boolean;
  onApprove: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}) {
  const busy = updating || deleting;

  const initials =
    testimonial.name
      ?.charAt(0)
      ?.toUpperCase() || 'C';

  return (
    <div className="p-5 sm:p-7">

      <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">

        {/* ================= CONTENT ================= */}

        <div className="min-w-0 flex-1">

          <div className="flex items-start gap-3">

            {/* Avatar */}

            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">

              {testimonial.avatarUrl ||
              testimonial.image ? (
                <img
                  src={
                    testimonial.avatarUrl ||
                    testimonial.image
                  }
                  alt={testimonial.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-maroon-950 font-serif text-lg text-pink-200">

                  {initials}

                </div>
              )}

            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h3 className="font-semibold text-maroon-950">
                  {testimonial.name}
                </h3>

                {!testimonial.isApproved && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                    Pending
                  </span>
                )}

                {testimonial.isApproved &&
                  testimonial.isActive && (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-700">
                      Approved
                    </span>
                  )}

                {!testimonial.isActive && (
                  <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-gray-600">
                    Hidden
                  </span>
                )}

              </div>

              {/* Stars */}

              <div className="mt-2 flex items-center gap-1">

                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= testimonial.rating
                        ? 'fill-pink-500 text-pink-500'
                        : 'text-gray-300'
                    }
                  />
                ))}

              </div>

            </div>

          </div>

          {/* Message */}

          <blockquote className="mt-5 border-l-2 border-pink-300 pl-4 text-sm leading-7 text-gray-600">

            “{testimonial.message}”

          </blockquote>

          {/* Date */}

          <p className="mt-4 text-[11px] text-gray-400">

            Submitted{' '}

            {new Date(
              testimonial.createdAt
            ).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}

          </p>

        </div>

        {/* ================= ACTIONS ================= */}

        <div className="flex flex-wrap items-center gap-2 lg:w-[180px] lg:flex-col lg:items-stretch">

          {!testimonial.isApproved && (
            <button
              type="button"
              disabled={busy}
              onClick={onApprove}
              className="
                flex items-center justify-center gap-2
                rounded-full
                bg-green-600
                px-4 py-3
                text-xs font-bold
                text-white
                transition
                hover:bg-green-700
                disabled:opacity-50
              "
            >
              {updating ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Check size={15} />
              )}

              Approve

            </button>
          )}

          {testimonial.isApproved && (
            <button
              type="button"
              disabled={busy}
              onClick={onToggleVisibility}
              className="
                flex items-center justify-center gap-2
                rounded-full
                border border-maroon-200
                px-4 py-3
                text-xs font-bold
                text-maroon-800
                transition
                hover:bg-maroon-50
                disabled:opacity-50
              "
            >
              {testimonial.isActive ? (
                <>
                  <EyeOff size={15} />
                  Hide
                </>
              ) : (
                <>
                  <Eye size={15} />
                  Show
                </>
              )}

            </button>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className="
              flex items-center justify-center gap-2
              rounded-full
              border border-red-200
              px-4 py-3
              text-xs font-bold
              text-red-600
              transition
              hover:bg-red-50
              disabled:opacity-50
            "
          >
            {deleting ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={15} />
            )}

            Delete

          </button>

        </div>

      </div>

    </div>
  );
}