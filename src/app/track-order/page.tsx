'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import {
ArrowLeft,
Package,
Search,
MapPin,
Truck,
CheckCircle2,
Circle,
Clock3,
ExternalLink,
ReceiptText,
Sparkles,
} from 'lucide-react';

type TrackingStatus =
| 'confirmed'
| 'processing'
| 'packed'
| 'shipped'
| 'in_transit'
| 'out_for_delivery'
| 'delivered'
| 'cancelled';

type StatusHistory = {
status: TrackingStatus;
changedAt: string;
};

type TrackedOrder = {
id: string;
createdAt: string;
customerName: string;
customerPhone: string;
status: TrackingStatus;
total: number;
items: {
id: string;
name: string;
quantity: number;
size: string;
image?: string;
}[];
shippingInfo: {
courierName?: string;
trackingNumber?: string;
trackingUrl?: string;
};
statusHistory: StatusHistory[];
};

const trackingSteps: {
status: TrackingStatus;
title: string;
description: string;
icon: React.ElementType;
}[] = [
{
status: 'confirmed',
title: 'Order Confirmed',
description: 'Your order has been successfully confirmed.',
icon: CheckCircle2,
},
{
status: 'processing',
title: 'Processing',
description: 'We are preparing your beautiful order.',
icon: Clock3,
},
{
status: 'packed',
title: 'Order Packed',
description: 'Your order has been carefully packed.',
icon: Package,
},
{
status: 'shipped',
title: 'Order Shipped',
description: 'Your order is now on its way.',
icon: Truck,
},
{
status: 'in_transit',
title: 'In Transit',
description: 'Your package is travelling towards you.',
icon: MapPin,
},
{
status: 'out_for_delivery',
title: 'Out for Delivery',
description: 'Your order will arrive very soon.',
icon: Truck,
},
{
status: 'delivered',
title: 'Delivered',
description: 'Your order has been successfully delivered.',
icon: CheckCircle2,
},
];

const formatOrderId = (id: string) => {
const cleanId = id.replace(/^JE/i, '').trim();

return `JE${cleanId.toUpperCase()}`;
};

export default function TrackOrderPage() {
const [orderId, setOrderId] = useState('');
const [loading, setLoading] = useState(false);
const [searched, setSearched] = useState(false);

const [order, setOrder] = useState<TrackedOrder | null>(null);
const [error, setError] = useState('');

const handleTrackOrder = async (event: FormEvent) => {
event.preventDefault();

const trimmedOrderId = orderId.trim();

if (!trimmedOrderId) {
  setError('Please enter your Order ID.');
  setOrder(null);
  return;
}

setLoading(true);
setError('');
setOrder(null);
setSearched(true);

try {
  /*
    BACKEND API CONNECTION

    Recommended API:

    GET /api/orders/track?orderId=YOUR_ORDER_ID

    Expected response:

    {
      order: {
        ...
      }
    }
  */

  const response = await fetch(
    `/api/orders/track?orderId=${encodeURIComponent(
      trimmedOrderId
    )}`,
    {
      credentials: 'include',
      cache: 'no-store',
    }
  );

  const data = await response.json();

  if (!response.ok || !data?.order) {
    setError(
      data?.error ||
        'We could not find an order with this Order ID.'
    );

    return;
  }

  setOrder(data.order);
} catch {
  setError(
    'Something went wrong while tracking your order. Please try again.'
  );
} finally {
  setLoading(false);
}

};

const currentStepIndex = order
? trackingSteps.findIndex(
(step) => step.status === order.status
)
: -1;

const getStatusHistory = (status: TrackingStatus) => {
return order?.statusHistory?.find(
(item) => item.status === status
);
};

return ( <main className="min-h-screen bg-[#fff8fa] py-8 sm:py-12"> <div className="mx-auto max-w-5xl px-4 sm:px-6">

    {/* Back Navigation */}
    <Link
      href="/profile"
      className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-maroon-800 transition hover:text-pink-600"
    >
      <ArrowLeft size={17} />
      Back to Profile
    </Link>

    {/* HERO / SEARCH CARD */}
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-950 via-maroon-900 to-pink-700 px-5 py-10 text-white shadow-xl sm:px-10 sm:py-14">

      {/* Background Decorations */}
      <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-rose-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-2xl text-center">

        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
          <Package size={30} className="text-pink-200" />
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-pink-200">
          <Sparkles size={14} />
          Jannat Elegance
          <Sparkles size={14} />
        </p>

        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
          Track Your Order
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-pink-100/80 sm:text-base">
          Enter your order ID to see the latest journey of your
          Jannat Elegance order.
        </p>

        {/* TRACK FORM */}
        <form
          onSubmit={handleTrackOrder}
          className="mt-8"
        >
          <div className="flex flex-col gap-3 rounded-[1.5rem] bg-white/10 p-3 backdrop-blur sm:flex-row">

            <div className="relative flex-1">

              <ReceiptText
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300"
              />

              <input
                type="text"
                value={orderId}
                onChange={(event) => {
                  setOrderId(event.target.value);
                  setError('');
                }}
                placeholder="Enter your Order ID (e.g. JE12345678)"
                className="w-full rounded-xl border border-white/10 bg-white px-11 py-4 text-sm font-semibold text-maroon-950 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-pink-300/40"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Tracking...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Track Order
                </>
              )}
            </button>

          </div>

          <p className="mt-4 text-xs text-pink-100/60">
            Your Order ID can be found in your order details and
            order confirmation.
          </p>

        </form>

      </div>

    </section>

    {/* ERROR STATE */}
    {searched && error && (
      <section className="mt-8 animate-in fade-in slide-in-from-bottom-3 duration-500">

        <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50">
            <Package size={25} className="text-red-500" />
          </div>

          <h2 className="mt-5 font-serif text-2xl text-maroon-950">
            Order Not Found
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            {error}
          </p>

          <button
            onClick={() => {
              setOrderId('');
              setError('');
              setSearched(false);
            }}
            className="mt-6 rounded-full border border-pink-200 bg-pink-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-pink-700 transition hover:bg-pink-100"
          >
            Try Again
          </button>

        </div>

      </section>
    )}

    {/* ORDER TRACKING RESULT */}
    {order && (
      <section className="mt-8 animate-in fade-in slide-in-from-bottom-5 duration-700">

        {/* ORDER SUMMARY */}
        <div className="rounded-3xl border border-maroon-100 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 border-b border-maroon-100 pb-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
                Order Details
              </p>

              <h2 className="mt-2 font-serif text-3xl text-maroon-950">
                Order {formatOrderId(order.id.slice(-8))}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Placed on{' '}
                {new Date(order.createdAt).toLocaleString(
                  'en-IN'
                )}
              </p>

            </div>

            {/* CURRENT STATUS */}
            <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 px-6 py-4 sm:text-right">

              <p className="text-xs font-bold uppercase tracking-wider text-pink-600">
                Current Status
              </p>

              <p className="mt-2 flex items-center gap-2 font-serif text-xl text-maroon-950 sm:justify-end">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-70" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-pink-600" />
                </span>

                {trackingSteps.find(
                  (step) => step.status === order.status
                )?.title || order.status}
              </p>

            </div>

          </div>

          {/* TRACKING TIMELINE */}
          <div className="py-8">

            <div className="mb-8">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
                Delivery Journey
              </p>

              <h3 className="mt-2 font-serif text-3xl text-maroon-950">
                Your Order Journey
              </h3>

            </div>

            <div className="relative">

              {trackingSteps.map((step, index) => {
                const Icon = step.icon;

                const isCompleted =
                  index <= currentStepIndex;

                const isCurrent =
                  index === currentStepIndex;

                const history =
                  getStatusHistory(step.status);

                return (
                  <div
                    key={step.status}
                    className="relative flex gap-5 pb-8 last:pb-0"
                  >

                    {/* Timeline Line */}
                    {index !==
                      trackingSteps.length - 1 && (
                      <div
                        className={`absolute left-[22px] top-12 h-[calc(100%-20px)] w-[2px] ${
                          isCompleted
                            ? 'bg-gradient-to-b from-pink-500 to-rose-300'
                            : 'bg-pink-100'
                        }`}
                      />
                    )}

                    {/* Timeline Icon */}
                    <div
                      className={`relative z-10 grid h-11 w-11 flex-none place-items-center rounded-full border transition-all duration-500 ${
                        isCurrent
                          ? 'scale-110 border-pink-500 bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-pink-300/50'
                          : isCompleted
                          ? 'border-pink-200 bg-pink-50 text-pink-600'
                          : 'border-gray-100 bg-white text-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <Icon size={19} />
                      ) : (
                        <Circle size={17} />
                      )}
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 pb-2 pt-1">

                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                        <h4
                          className={`font-bold ${
                            isCompleted
                              ? 'text-maroon-950'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.title}
                        </h4>

                        {history && (
                          <span className="text-xs text-gray-400">
                            {new Date(
                              history.changedAt
                            ).toLocaleString('en-IN')}
                          </span>
                        )}

                      </div>

                      <p
                        className={`mt-1 text-sm leading-6 ${
                          isCompleted
                            ? 'text-gray-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.description}
                      </p>

                      {isCurrent && (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-700">

                          <span className="h-2 w-2 animate-pulse rounded-full bg-pink-500" />

                          Current Order Status

                        </div>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* SHIPPING INFORMATION */}
          {(order.shippingInfo?.courierName ||
            order.shippingInfo?.trackingNumber) && (
            <div className="border-t border-maroon-100 pt-7">

              <div className="rounded-3xl bg-gradient-to-br from-[#fff8fa] to-pink-50 p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-pink-600">
                      Shipping Information
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-maroon-950">
                      {order.shippingInfo.courierName ||
                        'Courier Assigned Soon'}
                    </h3>

                    {order.shippingInfo
                      .trackingNumber && (
                      <p className="mt-2 text-sm text-gray-600">
                        Tracking Number:{' '}
                        <strong className="text-maroon-950">
                          {
                            order.shippingInfo
                              .trackingNumber
                          }
                        </strong>
                      </p>
                    )}

                  </div>

                  {order.shippingInfo.trackingUrl && (
                    <a
                      href={order.shippingInfo.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-maroon-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-pink-600"
                    >
                      <ExternalLink size={15} />
                      Track with Courier
                    </a>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ORDER ITEMS */}
          <div className="mt-8 border-t border-maroon-100 pt-7">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-pink-600">
                  Your Purchase
                </p>

                <h3 className="mt-2 font-serif text-2xl text-maroon-950">
                  Order Items
                </h3>
              </div>

              <span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-bold text-pink-700">
                {order.items.length}{' '}
                {order.items.length === 1
                  ? 'Item'
                  : 'Items'}
              </span>

            </div>

            <div className="mt-5 space-y-3">

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white p-4 transition hover:border-pink-200 hover:shadow-sm"
                >

                  <div className="grid h-14 w-14 flex-none place-items-center rounded-xl bg-pink-50">
                    <Package
                      size={22}
                      className="text-pink-500"
                    />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate font-semibold text-maroon-950">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Size {item.size} · Quantity{' '}
                      {item.quantity}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* ACTION BUTTON */}
          <div className="mt-8 border-t border-maroon-100 pt-6 text-center">

            <Link
              href={`/orders/${order.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <ReceiptText size={16} />
              View Complete Order Details
            </Link>

          </div>

        </div>

      </section>
    )}

    {/* INITIAL STATE */}
    {!searched && !order && (
      <section className="mt-10 grid gap-4 sm:grid-cols-3">

        <div className="rounded-3xl border border-pink-100 bg-white p-6 text-center shadow-sm">

          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-pink-50 text-pink-600">
            <ReceiptText size={21} />
          </div>

          <h3 className="mt-4 font-serif text-xl text-maroon-950">
            Enter Order ID
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter the unique Order ID you received after placing
            your order.
          </p>

        </div>

        <div className="rounded-3xl border border-pink-100 bg-white p-6 text-center shadow-sm">

          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-pink-50 text-pink-600">
            <Search size={21} />
          </div>

          <h3 className="mt-4 font-serif text-xl text-maroon-950">
            Track Progress
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            See exactly where your order is in its delivery
            journey.
          </p>

        </div>

        <div className="rounded-3xl border border-pink-100 bg-white p-6 text-center shadow-sm">

          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-pink-50 text-pink-600">
            <Truck size={21} />
          </div>

          <h3 className="mt-4 font-serif text-xl text-maroon-950">
            Stay Updated
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Get the latest shipping and delivery status of your
            Jannat Elegance order.
          </p>

        </div>

      </section>
    )}

  </div>
</main>

);
}
