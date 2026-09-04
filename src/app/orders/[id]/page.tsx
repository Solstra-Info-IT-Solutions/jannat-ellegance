// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import {
// ArrowLeft,
// ExternalLink,
// Printer,
// ReceiptText,
// Star,
// } from 'lucide-react';

// import ProductCard from '@/components/ProductCard';
// import ReviewForm from '@/components/ReviewForm';
// import { Product } from '@/types';

// type OrderItem = {
// id: string;
// productId: string;
// name: string;
// quantity: number;
// size: string;
// price: number;
// image: string;
// };

// type Order = {
// id: string;
// createdAt: string;
// customerName: string;
// customerEmail: string;
// customerPhone: string;
// shippingAddress: string;
// city: string;
// state: string;
// postalCode: string;
// subtotal: number;
// shipping: number;
// total: number;
// paymentId?: string;
// paymentStatus: string;
// status: string;

// shippingInfo: {
// courierName: string;
// trackingNumber: string;
// trackingUrl: string;
// };

// statusHistory: Array<{
// status: string;
// changedAt: string;
// }>;

// items: OrderItem[];
// };

// const flow = [
// 'confirmed',
// 'processing',
// 'packed',
// 'shipped',
// 'in_transit',
// 'out_for_delivery',
// 'delivered',
// ];

// const label = (value: string) =>
// value
// .replace(/_/g, ' ')
// .replace(/\b\w/g, (character) => character.toUpperCase());

// export default function OrderDetailPage() {
// const { id: orderId } = useParams<{ id: string }>();

// const [order, setOrder] = useState<Order | null>(null);
// const [related, setRelated] = useState<Product[]>([]);
// const [loading, setLoading] = useState(true);

// // Review Modal State
// const [reviewProduct, setReviewProduct] =
// useState<OrderItem | null>(null);

// useEffect(() => {
// if (!orderId) return;

// fetch(`/api/orders/${orderId}`, {
//   credentials: 'include',
//   cache: 'no-store',
// })
//   .then((response) =>
//     response.ok ? response.json() : null
//   )
//   .then((data) => {
//     setOrder(data?.order || null);
//     setRelated(data?.relatedProducts || []);
//   })
//   .catch(() => {
//     setOrder(null);
//   })
//   .finally(() => {
//     setLoading(false);
//   });

// }, [orderId]);

// // Loading
// if (loading) {
// return ( <main className="grid min-h-[60vh] place-items-center bg-[#fff8fa] text-sm text-gray-500">
// Loading order… </main>
// );
// }

// // Order Not Found
// if (!order) {
// return ( <main className="grid min-h-[60vh] place-items-center bg-[#fff8fa]"> <div className="text-center"> <h1 className="font-serif text-3xl text-maroon-950">
// Order not found </h1>

//       <Link
//         href="/orders"
//         className="mt-5 inline-block rounded-full bg-maroon-800 px-5 py-3 text-xs font-bold uppercase text-white"
//       >
//         My orders
//       </Link>
//     </div>
//   </main>
// );

// }

// const currentIndex = flow.indexOf(order.status);

// const historyByStatus = new Map(
// order.statusHistory.map((entry) => [
// entry.status,
// entry,
// ])
// );

// const isCancelled = order.status === 'cancelled';

// return (
// <> <main className="min-h-screen bg-[#fff8fa] py-10 print:bg-white"> <div className="mx-auto max-w-5xl px-4 sm:px-6">

//       {/* Top Navigation */}
//       <div className="mb-7 flex items-center justify-between print:hidden">

//         <Link
//           href="/orders"
//           className="flex items-center gap-2 text-sm font-bold text-maroon-800"
//         >
//           <ArrowLeft size={16} />
//           Back to orders
//         </Link>

//         <button
//           onClick={() => window.print()}
//           className="flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm"
//         >
//           <Printer size={15} />
//           Print receipt
//         </button>

//       </div>

//       {/* Order Receipt */}
//       <section className="rounded-3xl border border-maroon-100 bg-white p-6 shadow-sm sm:p-9">

//         {/* Order Header */}
//         <div className="flex flex-wrap justify-between gap-5 border-b border-maroon-100 pb-6">

//           <div>
//             <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-pink-600">
//               <ReceiptText size={15} />
//               Jannat Elegance receipt
//             </p>

//             <h1 className="mt-2 font-serif text-3xl text-maroon-950">
//               Order JE{order.id.slice(-8).toUpperCase()}
//             </h1>

//             <p className="mt-2 text-sm text-gray-500">
//               Placed{' '}
//               {new Date(order.createdAt).toLocaleString(
//                 'en-IN'
//               )}
//             </p>
//           </div>

//           <div className="text-right">
//             <p className="text-sm font-bold uppercase text-maroon-800">
//               {label(order.status)}
//             </p>

//             <p className="mt-2 text-xl font-bold text-maroon-950">
//               ₹{order.total.toLocaleString('en-IN')}
//             </p>

//             <p className="mt-1 text-xs text-gray-500">
//               Payment: {order.paymentStatus}
//             </p>
//           </div>

//         </div>

//         {/* Order Status */}
//         <div className="py-7">

//           <h2 className="font-serif text-2xl text-maroon-950">
//             Order status
//           </h2>

//           {isCancelled ? (
//             <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">

//               <strong>Cancelled</strong>

//               {order.statusHistory.find(
//                 (entry) =>
//                   entry.status === 'cancelled'
//               ) && (
//                 <p className="mt-1">
//                   {new Date(
//                     order.statusHistory.find(
//                       (entry) =>
//                         entry.status === 'cancelled'
//                     )!.changedAt
//                   ).toLocaleString('en-IN')}
//                 </p>
//               )}

//             </div>
//           ) : (
//             <ol className="mt-5 grid gap-3 sm:grid-cols-2">

//               {flow.map((status, index) => {
//                 const entry =
//                   historyByStatus.get(status);

//                 const complete =
//                   index <= currentIndex;

//                 return (
//                   <li
//                     key={status}
//                     className={`rounded-xl border p-3 text-sm ${
//                       complete
//                         ? 'border-maroon-200 bg-maroon-50 text-maroon-950'
//                         : 'border-gray-100 text-gray-400'
//                     }`}
//                   >
//                     <p className="font-bold">
//                       {complete ? '✓ ' : '○ '}
//                       {label(status)}
//                     </p>

//                     {entry && (
//                       <p className="mt-1 text-xs text-gray-500">
//                         {new Date(
//                           entry.changedAt
//                         ).toLocaleString('en-IN')}
//                       </p>
//                     )}
//                   </li>
//                 );
//               })}

//             </ol>
//           )}

//         </div>

//         {/* Shipping Details */}
//         {(order.shippingInfo.courierName ||
//           order.shippingInfo.trackingNumber) && (
//           <div className="border-t border-maroon-100 py-7">

//             <h2 className="font-serif text-2xl text-maroon-950">
//               Shipping details
//             </h2>

//             <div className="mt-4 rounded-2xl bg-maroon-50 p-4 text-sm text-maroon-950">

//               <p>
//                 Courier:{' '}
//                 <strong>
//                   {order.shippingInfo.courierName ||
//                     'Assigned soon'}
//                 </strong>
//               </p>

//               {order.shippingInfo.trackingNumber && (
//                 <p className="mt-2">
//                   Tracking number:{' '}
//                   <strong>
//                     {order.shippingInfo.trackingNumber}
//                   </strong>
//                 </p>
//               )}

//               {order.shippingInfo.trackingUrl && (
//                 <a
//                   href={order.shippingInfo.trackingUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="mt-4 inline-flex items-center gap-1 rounded-full bg-maroon-800 px-4 py-2 text-xs font-bold text-white"
//                 >
//                   <ExternalLink size={13} />
//                   Track package
//                 </a>
//               )}

//             </div>

//           </div>
//         )}

//         {/* Address & Payment */}
//         <div className="grid gap-7 border-t border-maroon-100 py-7 sm:grid-cols-2">

//           <div>
//             <p className="text-xs font-bold uppercase tracking-wider text-maroon-900">
//               Delivery address
//             </p>

//             <p className="mt-2 text-sm font-semibold text-maroon-950">
//               {order.customerName}
//             </p>

//             <p className="mt-1 text-sm leading-6 text-gray-600">
//               {order.shippingAddress}
//               <br />

//               {order.city}, {order.state} –{' '}
//               {order.postalCode}

//               <br />

//               {order.customerPhone}
//             </p>
//           </div>

//           <div>
//             <p className="text-xs font-bold uppercase tracking-wider text-maroon-900">
//               Payment reference
//             </p>

//             <p className="mt-2 break-all font-mono text-xs text-gray-600">
//               {order.paymentId ||
//                 'Payment processing reference unavailable'}
//             </p>
//           </div>

//         </div>

//         {/* Purchased Items */}
//         <div className="border-t border-maroon-100 pt-6">

//           <h2 className="font-serif text-2xl text-maroon-950">
//             Items purchased
//           </h2>

//           <div className="mt-4 divide-y divide-maroon-50">

//             {order.items.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex gap-4 py-5"
//               >

//                 {/* Product Image */}
//                 <div className="relative h-24 w-20 flex-none overflow-hidden rounded-xl bg-maroon-50">
//                   <Image
//                     src={
//                       item.image ||
//                       '/images/logo.jpeg'
//                     }
//                     alt={item.name}
//                     fill
//                     className="object-cover object-top"
//                   />
//                 </div>

//                 {/* Product Information */}
//                 <div className="flex min-w-0 flex-1 items-center justify-between gap-3">

//                   <div>

//                     <p className="font-semibold text-maroon-950">
//                       {item.name}
//                     </p>

//                     <p className="mt-1 text-sm text-gray-500">
//                       Size {item.size} · Quantity{' '}
//                       {item.quantity}
//                     </p>

//                     <p className="mt-2 text-sm font-bold text-maroon-800">
//                       ₹
//                       {item.price.toLocaleString(
//                         'en-IN'
//                       )}{' '}
//                       each
//                     </p>

//                     {/* ADD REVIEW BUTTON */}
//                     {order.status === 'delivered' && (
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setReviewProduct(item)
//                         }
//                         className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-pink-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-600 hover:text-white hover:shadow-lg"
//                       >
//                         <Star size={15} />
//                         Add a Review
//                       </button>
//                     )}

//                   </div>

//                   {/* Product Total */}
//                   <p className="font-bold text-maroon-950">
//                     ₹
//                     {(
//                       item.price *
//                       item.quantity
//                     ).toLocaleString('en-IN')}
//                   </p>

//                 </div>

//               </div>
//             ))}

//           </div>

//         </div>

//         {/* Price Summary */}
//         <div className="ml-auto mt-6 max-w-sm space-y-2 border-t border-maroon-100 pt-5 text-sm">

//           <p className="flex justify-between text-gray-600">
//             <span>Subtotal</span>

//             <span>
//               ₹
//               {order.subtotal.toLocaleString(
//                 'en-IN'
//               )}
//             </span>
//           </p>

//           <p className="flex justify-between text-gray-600">
//             <span>Shipping</span>

//             <span>
//               {order.shipping
//                 ? `₹${order.shipping.toLocaleString(
//                     'en-IN'
//                   )}`
//                 : 'Free'}
//             </span>
//           </p>

//           <p className="flex justify-between text-lg font-bold text-maroon-950">
//             <span>Total paid</span>

//             <span>
//               ₹
//               {order.total.toLocaleString(
//                 'en-IN'
//               )}
//             </span>
//           </p>

//         </div>

//       </section>

//       {/* Related Products */}
//       {related.length > 0 && (
//         <section className="mt-12 print:hidden">

//           <div className="mb-6 text-center">
//             <p className="text-xs font-bold uppercase tracking-[.2em] text-pink-600">
//               You may also like
//             </p>

//             <h2 className="mt-2 font-serif text-3xl text-maroon-950">
//               More from this collection
//             </h2>
//           </div>

//           <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
//             {related.map((product) => (
//               <ProductCard
//                 key={product.id}
//                 product={product}
//               />
//             ))}
//           </div>

//         </section>
//       )}

//     </div>
//   </main>

//   {/* REVIEW MODAL */}
//   {reviewProduct && (
//     <ReviewForm
//       productName={reviewProduct.name}
//       onClose={() => setReviewProduct(null)}
//     />
//   )}
// </>

// );
// }




"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  ReceiptText,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type OrderItem = {
  id: string;
  productId?: string;
  name: string;
  quantity: number;
  size: string;
  price: number;
  image: string;
};

type ShippingInfo = {
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
};

type StatusHistory = {
  status: string;
  changedAt: string;
};

type ShippingAddress = {
  name?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
};

type Order = {
  id: string;
  _id?: string;

  orderId?: string;
  orderNumber?: string;

  createdAt: string;

  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;

  status: string;

  paymentStatus?: string;
  paymentMethod?: string;

  subtotal?: number;
  shipping?: number;
  shippingAmount?: number;
  total: number;

  items: OrderItem[];

  address?: ShippingAddress;
  shippingAddress?: ShippingAddress;

  shippingInfo?: ShippingInfo;

  statusHistory?: StatusHistory[];
};

/* =========================================================
   HELPERS
========================================================= */

const statusLabel = (status: string) => {
  return String(status || "confirmed")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
};

const getOrderNumber = (order: Order) => {
  if (order.orderId) {
    return order.orderId;
  }

  if (order.orderNumber) {
    return order.orderNumber;
  }

  return `JE${String(
    order.id || order._id || "",
  )
    .slice(-8)
    .toUpperCase()}`;
};

const getStatusConfig = (status: string) => {
  const normalized = String(status || "")
    .toLowerCase()
    .trim();

  switch (normalized) {
    case "confirmed":
      return {
        label: "Confirmed",
        icon: CheckCircle2,
        className:
          "border-green-200 bg-green-50 text-green-700",
      };

    case "processing":
      return {
        label: "Processing",
        icon: Package,
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
      };

    case "packed":
      return {
        label: "Packed",
        icon: Package,
        className:
          "border-purple-200 bg-purple-50 text-purple-700",
      };

    case "shipped":
      return {
        label: "Shipped",
        icon: Truck,
        className:
          "border-blue-200 bg-blue-50 text-blue-700",
      };

    case "in_transit":
      return {
        label: "In Transit",
        icon: Truck,
        className:
          "border-blue-200 bg-blue-50 text-blue-700",
      };

    case "out_for_delivery":
      return {
        label: "Out for Delivery",
        icon: Truck,
        className:
          "border-indigo-200 bg-indigo-50 text-indigo-700",
      };

    case "delivered":
      return {
        label: "Delivered",
        icon: CheckCircle2,
        className:
          "border-green-200 bg-green-50 text-green-700",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        icon: Clock3,
        className:
          "border-red-200 bg-red-50 text-red-700",
      };

    default:
      return {
        label: statusLabel(status),
        icon: Clock3,
        className:
          "border-maroon-100 bg-maroon-50 text-maroon-800",
      };
  }
};

const getPaymentDetails = (order: Order) => {
  const method = String(
    order.paymentMethod || "",
  ).toUpperCase();

  const status = String(
    order.paymentStatus || "",
  ).toUpperCase();

  if (method === "COD") {
    return {
      label: "Cash on Delivery",
      description:
        status === "PAID"
          ? "Payment received"
          : "Pay when your order is delivered",
    };
  }

  if (status === "PAID") {
    return {
      label: "Paid Online",
      description:
        "Your payment has been successfully received",
    };
  }

  return {
    label: method || "Payment Pending",
    description:
      status === "PENDING"
        ? "Payment is pending"
        : statusLabel(status || "Pending"),
  };
};

const getShippingAddress = (
  order: Order,
): ShippingAddress => {
  return (
    order.shippingAddress ||
    order.address ||
    {}
  );
};

/* =========================================================
   STATUS TIMELINE
========================================================= */

const timelineSteps = [
  {
    status: "confirmed",
    label: "Order Confirmed",
    icon: CheckCircle2,
  },
  {
    status: "processing",
    label: "Processing",
    icon: Package,
  },
  {
    status: "packed",
    label: "Packed",
    icon: Package,
  },
  {
    status: "shipped",
    label: "Shipped",
    icon: Truck,
  },
  {
    status: "out_for_delivery",
    label: "Out for Delivery",
    icon: Truck,
  },
  {
    status: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function OrderDetailsPage() {
  const params = useParams();

  const id = String(params?.id || "");

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD ORDER
  ======================================================= */

  useEffect(() => {
    if (!id) {
      return;
    }

    let active = true;

    const loadOrder = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await fetch(
          `/api/orders/${encodeURIComponent(id)}`,
          {
            cache: "no-store",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Unable to load this order",
          );
        }

        if (active) {
          setOrder(data?.order || null);
        }
      } catch (reason) {
        if (active) {
          setOrder(null);

          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load this order",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [id]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff8fa] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl animate-pulse">

          <div className="h-4 w-32 rounded bg-maroon-100" />

          <div className="mt-5 h-10 w-64 rounded bg-maroon-100" />

          <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_360px]">

            <div className="space-y-6">

              <div className="h-64 rounded-[2rem] bg-white" />

              <div className="h-80 rounded-[2rem] bg-white" />

            </div>

            <div className="h-96 rounded-[2rem] bg-white" />

          </div>

        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR / NOT FOUND
  ======================================================= */

  if (error || !order) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#fff8fa] px-4">

        <div className="max-w-md rounded-[2rem] border border-maroon-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-600">
            <ReceiptText size={28} />
          </div>

          <h1 className="mt-6 font-serif text-3xl text-maroon-950">
            Order unavailable
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {error ||
              "We could not find this order."}
          </p>

          <Link
            href="/orders"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-maroon-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-maroon-950"
          >
            <ArrowLeft size={16} />

            Back to orders
          </Link>

        </div>

      </main>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const orderNumber =
    getOrderNumber(order);

  const statusConfig =
    getStatusConfig(order.status);

  const StatusIcon =
    statusConfig.icon;

  const payment =
    getPaymentDetails(order);

  const shippingAddress =
    getShippingAddress(order);

  const shipping =
    order.shippingInfo || {};

  const itemSubtotal =
    order.items?.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0,
    ) || 0;

  const subtotal =
    Number(order.subtotal ?? itemSubtotal);

  const shippingAmount =
    Number(
      order.shippingAmount ??
        order.shipping ??
        0,
    );

  const total =
    Number(order.total || 0);

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#fff8fa] px-4 py-8 sm:px-6 sm:py-12">

      <div className="mx-auto max-w-6xl">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-maroon-800 transition hover:text-maroon-950"
        >
          <ArrowLeft size={16} />

          Back to My Orders
        </Link>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mt-7 flex flex-col gap-6 rounded-[2rem] border border-maroon-100 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <span className="h-px w-8 bg-pink-400" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-600">
                Jannat Elegance
              </p>

            </div>

            <h1 className="mt-4 font-serif text-3xl text-maroon-950 sm:text-4xl">
              Order Details
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Order{" "}

              <span className="font-mono font-bold text-maroon-900">
                #{orderNumber}
              </span>

            </p>

            <p className="mt-1 text-xs text-gray-400">

              Placed on{" "}

              {new Date(
                order.createdAt,
              ).toLocaleString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                },
              )}

            </p>

          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold ${statusConfig.className}`}
          >

            <StatusIcon size={18} />

            {statusConfig.label}

          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* ===============================================
              LEFT COLUMN
          =============================================== */}

          <div className="space-y-7">

            {/* =============================================
                ORDER ITEMS
            ============================================= */}

            <section className="overflow-hidden rounded-[2rem] border border-maroon-100 bg-white shadow-sm">

              <div className="flex items-center gap-3 border-b border-maroon-50 px-6 py-5">

                <div className="grid h-10 w-10 place-items-center rounded-full bg-maroon-50 text-maroon-800">
                  <ShoppingBag size={19} />
                </div>

                <div>

                  <h2 className="font-serif text-2xl text-maroon-950">
                    Your Items
                  </h2>

                  <p className="text-xs text-gray-500">
                    {order.items.length}{" "}

                    {order.items.length === 1
                      ? "item"
                      : "items"}{" "}

                    in this order
                  </p>

                </div>

              </div>

              <div className="divide-y divide-maroon-50">

                {order.items.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4 px-6 py-5"
                  >

                    <div className="relative h-28 w-24 flex-none overflow-hidden rounded-2xl bg-maroon-50">

                      <Image
                        src={
                          item.image ||
                          "/images/logo.jpeg"
                        }
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover object-top"
                      />

                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-center">

                      <p className="text-sm font-semibold text-maroon-950 sm:text-base">
                        {item.name}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">

                        Size{" "}

                        <span className="font-semibold text-maroon-800">
                          {item.size || "—"}
                        </span>

                        <span className="mx-2 text-gray-300">
                          •
                        </span>

                        Quantity{" "}

                        <span className="font-semibold text-maroon-800">
                          {item.quantity}
                        </span>

                      </p>

                      <p className="mt-3 text-base font-bold text-maroon-800">

                        ₹
                        {(
                          Number(item.price || 0) *
                          Number(item.quantity || 0)
                        ).toLocaleString(
                          "en-IN",
                        )}

                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </section>

            {/* =============================================
                ORDER TIMELINE
            ============================================= */}

            <section className="rounded-[2rem] border border-maroon-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="grid h-10 w-10 place-items-center rounded-full bg-maroon-50 text-maroon-800">
                  <Clock3 size={19} />
                </div>

                <div>

                  <h2 className="font-serif text-2xl text-maroon-950">
                    Order Journey
                  </h2>

                  <p className="text-xs text-gray-500">
                    Track the progress of your order
                  </p>

                </div>

              </div>

              {order.status === "cancelled" ? (

                <div className="mt-7 rounded-2xl border border-red-100 bg-red-50 p-5">

                  <p className="font-semibold text-red-700">
                    This order has been cancelled.
                  </p>

                </div>

              ) : (

                <div className="mt-8 space-y-6">

                  {timelineSteps.map(
                    (step, index) => {
                      const StepIcon =
                        step.icon;

                      const historyEntry =
                        order.statusHistory?.find(
                          (entry) =>
                            entry.status ===
                            step.status,
                        );

                      const currentIndex =
                        timelineSteps.findIndex(
                          (item) =>
                            item.status ===
                            order.status,
                        );

                      const active =
                        Boolean(historyEntry) ||
                        index <= currentIndex;

                      return (

                        <div
                          key={step.status}
                          className="relative flex gap-4"
                        >

                          {index <
                            timelineSteps.length -
                              1 && (
                            <span
                              className={`absolute left-5 top-11 h-8 w-px ${
                                active
                                  ? "bg-maroon-300"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 grid h-10 w-10 flex-none place-items-center rounded-full ${
                              active
                                ? "bg-maroon-800 text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >

                            <StepIcon size={17} />

                          </div>

                          <div className="pb-3">

                            <p
                              className={`text-sm font-semibold ${
                                active
                                  ? "text-maroon-950"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </p>

                            {historyEntry?.changedAt && (

                              <p className="mt-1 text-xs text-gray-500">

                                {new Date(
                                  historyEntry.changedAt,
                                ).toLocaleString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                  },
                                )}

                              </p>

                            )}

                          </div>

                        </div>
                      );
                    },
                  )}

                </div>

              )}

            </section>

          </div>

          {/* ===============================================
              RIGHT COLUMN
          =============================================== */}

          <aside className="space-y-7">

            {/* =============================================
                PAYMENT SUMMARY
            ============================================= */}

            <section className="rounded-[2rem] border border-maroon-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="grid h-10 w-10 place-items-center rounded-full bg-maroon-50 text-maroon-800">
                  <Wallet size={19} />
                </div>

                <div>

                  <h2 className="font-serif text-xl text-maroon-950">
                    Payment
                  </h2>

                  <p className="text-xs text-gray-500">
                    {payment.label}
                  </p>

                </div>

              </div>

              <div className="mt-6 rounded-2xl bg-maroon-50 p-4">

                <div className="flex gap-3">

                  <CreditCard
                    size={19}
                    className="mt-0.5 text-maroon-800"
                  />

                  <div>

                    <p className="text-sm font-bold text-maroon-950">
                      {payment.label}
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      {payment.description}
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* =============================================
                DELIVERY ADDRESS
            ============================================= */}

            <section className="rounded-[2rem] border border-maroon-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="grid h-10 w-10 place-items-center rounded-full bg-maroon-50 text-maroon-800">
                  <MapPin size={19} />
                </div>

                <h2 className="font-serif text-xl text-maroon-950">
                  Delivery Address
                </h2>

              </div>

              <div className="mt-6 text-sm leading-relaxed text-gray-600">

                <p className="font-semibold text-maroon-950">
                  {shippingAddress.name ||
                    order.customerName ||
                    "Customer"}
                </p>

                {shippingAddress.phone && (

                  <p className="mt-1">
                    {shippingAddress.phone}
                  </p>

                )}

                {shippingAddress.addressLine && (

                  <p className="mt-3">
                    {shippingAddress.addressLine}
                  </p>

                )}

                {shippingAddress.landmark && (

                  <p className="mt-1">
                    Landmark:{" "}
                    {shippingAddress.landmark}
                  </p>

                )}

                {(shippingAddress.city ||
                  shippingAddress.state ||
                  shippingAddress.pincode) && (

                  <p className="mt-1">

                    {[
                      shippingAddress.city,
                      shippingAddress.state,
                      shippingAddress.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}

                  </p>

                )}

              </div>

            </section>

            {/* =============================================
                SHIPPING / TRACKING
            ============================================= */}

            {(shipping.courierName ||
              shipping.trackingNumber) && (

              <section className="rounded-[2rem] border border-maroon-100 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="grid h-10 w-10 place-items-center rounded-full bg-maroon-50 text-maroon-800">
                    <Truck size={19} />
                  </div>

                  <h2 className="font-serif text-xl text-maroon-950">
                    Shipping
                  </h2>

                </div>

                <div className="mt-6 space-y-4 text-sm">

                  {shipping.courierName && (

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Courier
                      </p>

                      <p className="mt-1 font-semibold text-maroon-950">
                        {shipping.courierName}
                      </p>

                    </div>

                  )}

                  {shipping.trackingNumber && (

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Tracking Number
                      </p>

                      <p className="mt-1 break-all font-mono text-sm font-semibold text-maroon-950">
                        {shipping.trackingNumber}
                      </p>

                    </div>

                  )}

                  {shipping.trackingUrl && (

                    <a
                      href={shipping.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-maroon-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-maroon-950"
                    >
                      Track Shipment

                      <ArrowRight size={15} />

                    </a>

                  )}

                </div>

              </section>

            )}

            {/* =============================================
                BILL SUMMARY
            ============================================= */}

            <section className="rounded-[2rem] border border-maroon-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="grid h-10 w-10 place-items-center rounded-full bg-maroon-50 text-maroon-800">
                  <ReceiptText size={19} />
                </div>

                <h2 className="font-serif text-xl text-maroon-950">
                  Order Summary
                </h2>

              </div>

              <div className="mt-6 space-y-3 text-sm">

                <div className="flex justify-between text-gray-600">

                  <span>Subtotal</span>

                  <span>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN",
                    )}
                  </span>

                </div>

                <div className="flex justify-between text-gray-600">

                  <span>Shipping</span>

                  <span>
                    {shippingAmount > 0
                      ? `₹${shippingAmount.toLocaleString(
                          "en-IN",
                        )}`
                      : "Free"}
                  </span>

                </div>

                <div className="my-4 border-t border-maroon-100" />

                <div className="flex justify-between text-lg font-bold text-maroon-950">

                  <span>Total</span>

                  <span>
                    ₹
                    {total.toLocaleString(
                      "en-IN",
                    )}
                  </span>

                </div>

              </div>

            </section>

          </aside>

        </div>

      </div>

    </main>
  );
}