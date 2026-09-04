"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  size: string;
  price: number;
  image: string;
};

type Order = {
  id: string;
  orderId?: string;
  orderNumber?: string;

  createdAt: string;

  total: number;

  status: string;

  paymentStatus: string;

  paymentMethod?: string;

  items: OrderItem[];
};

const statusLabel = (status: string) => {
  return status
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

  return `JE${order.id
    .slice(-8)
    .toUpperCase()}`;
};

const getStatusConfig = (status: string) => {
  const normalized = status?.toLowerCase();

  switch (normalized) {
    case "confirmed":
      return {
        label: "Confirmed",
        icon: CheckCircle2,
        className:
          "bg-green-50 text-green-700 border-green-200",
      };

    case "processing":
      return {
        label: "Processing",
        icon: Package,
        className:
          "bg-amber-50 text-amber-700 border-amber-200",
      };

    case "packed":
      return {
        label: "Packed",
        icon: Package,
        className:
          "bg-purple-50 text-purple-700 border-purple-200",
      };

    case "shipped":
    case "in_transit":
      return {
        label: statusLabel(status),
        icon: Truck,
        className:
          "bg-blue-50 text-blue-700 border-blue-200",
      };

    case "out_for_delivery":
      return {
        label: "Out for delivery",
        icon: Truck,
        className:
          "bg-indigo-50 text-indigo-700 border-indigo-200",
      };

    case "delivered":
      return {
        label: "Delivered",
        icon: CheckCircle2,
        className:
          "bg-green-50 text-green-700 border-green-200",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        icon: Clock3,
        className:
          "bg-red-50 text-red-700 border-red-200",
      };

    default:
      return {
        label: statusLabel(status || "Confirmed"),
        icon: Clock3,
        className:
          "bg-maroon-50 text-maroon-700 border-maroon-100",
      };
  }
};

const getPaymentLabel = (order: Order) => {
  const method =
    order.paymentMethod?.toUpperCase() || "";

  const paymentStatus =
    order.paymentStatus?.toUpperCase() || "";

  if (method === "COD") {
    return "Cash on Delivery";
  }

  if (paymentStatus === "PAID") {
    return "Paid Online";
  }

  return paymentStatus
    ? statusLabel(paymentStatus)
    : "Payment Pending";
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await fetch(
          "/api/orders",
          {
            cache: "no-store",

            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Unable to load your orders",
          );
        }

        if (active) {
          setOrders(data?.orders ?? []);
        }
      } catch (reason) {
        if (active) {
          setOrders([]);

          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load your orders",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  /* ============================================
     LOADING
  ============================================ */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff8fa] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">

          <div className="animate-pulse">

            <div className="h-4 w-32 rounded bg-maroon-100" />

            <div className="mt-4 h-10 w-56 rounded bg-maroon-100" />

            <div className="mt-3 h-4 w-80 max-w-full rounded bg-maroon-50" />

            <div className="mt-10 space-y-5">

              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-maroon-100 bg-white p-6"
                >
                  <div className="flex justify-between gap-6">

                    <div>
                      <div className="h-4 w-40 rounded bg-maroon-100" />

                      <div className="mt-3 h-3 w-28 rounded bg-maroon-50" />

                    </div>

                    <div className="h-8 w-24 rounded-full bg-maroon-50" />

                  </div>

                  <div className="mt-6 flex gap-4">

                    <div className="h-20 w-16 rounded-xl bg-maroon-50" />

                    <div className="flex-1">

                      <div className="h-4 w-48 rounded bg-maroon-100" />

                      <div className="mt-3 h-3 w-32 rounded bg-maroon-50" />

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>
      </main>
    );
  }

  /* ============================================
     PAGE
  ============================================ */

  return (
    <main className="min-h-screen bg-[#fff8fa] px-4 py-10 sm:px-6 sm:py-14">

      <div className="mx-auto max-w-5xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            <div className="flex items-center gap-2">

              <span className="h-px w-8 bg-pink-400" />

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-600">
                Jannat Elegance
              </p>

            </div>

            <h1 className="mt-4 font-serif text-4xl text-maroon-950 sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
              View your purchases, track your delivery,
              and revisit every beautiful piece you have
              ordered from Jannat Elegance.
            </p>

          </div>

          {orders.length > 0 && (

            <div className="rounded-2xl border border-maroon-100 bg-white px-5 py-4 shadow-sm">

              <p className="text-xs uppercase tracking-wider text-gray-400">
                Total orders
              </p>

              <p className="mt-1 text-2xl font-bold text-maroon-950">
                {orders.length}
              </p>

            </div>

          )}

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (

          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {error}
          </div>

        )}

        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {!error && orders.length === 0 && (

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-maroon-100 bg-white">

            <div className="px-6 py-14 text-center sm:px-12 sm:py-20">

              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-maroon-50 text-maroon-800">

                <ShoppingBag size={32} />

              </div>

              <h2 className="mt-7 font-serif text-3xl text-maroon-950">
                Your wardrobe is waiting
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
                You have not placed an order yet.
                Discover our latest collection and find
                something beautifully made for you.
              </p>

              <Link
                href="/shop"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-maroon-800 px-7 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg transition hover:bg-maroon-950"
              >
                Explore collection

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />

              </Link>

            </div>

          </div>

        )}

        {/* ======================================
            ORDER LIST
        ====================================== */}

        {orders.length > 0 && (

          <div className="mt-10 space-y-6">

            {orders.map((order) => {
              const orderNumber =
                getOrderNumber(order);

              const statusConfig =
                getStatusConfig(order.status);

              const StatusIcon =
                statusConfig.icon;

              return (

                <article
                  key={order.id}
                  className="overflow-hidden rounded-[1.75rem] border border-maroon-100 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* ==================================
                      ORDER HEADER
                  ================================== */}

                  <div className="flex flex-col gap-5 border-b border-maroon-50 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Order number
                      </p>

                      <p className="mt-2 font-mono text-sm font-bold tracking-wide text-maroon-950">
                        #{orderNumber}
                      </p>

                      <p className="mt-2 text-xs text-gray-500">

                        Placed on{" "}

                        {new Date(
                          order.createdAt,
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

                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">

                      {/* STATUS */}

                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${statusConfig.className}`}
                      >

                        <StatusIcon size={15} />

                        {statusConfig.label}

                      </div>

                      {/* PAYMENT */}

                      <div className="inline-flex items-center gap-2 rounded-full bg-maroon-50 px-4 py-2 text-xs font-semibold text-maroon-800">

                        <Wallet size={15} />

                        {getPaymentLabel(order)}

                      </div>

                    </div>

                  </div>

                  {/* ==================================
                      ITEMS
                  ================================== */}

                  <div className="divide-y divide-maroon-50">

                    {order.items.map((item) => (

                      <div
                        key={item.id}
                        className="flex gap-4 px-5 py-5 sm:px-7"
                      >

                        {/* IMAGE */}

                        <div className="relative h-24 w-20 flex-none overflow-hidden rounded-2xl bg-maroon-50">

                          <Image
                            src={
                              item.image ||
                              "/images/logo.jpeg"
                            }
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover object-top"
                          />

                        </div>

                        {/* DETAILS */}

                        <div className="flex min-w-0 flex-1 flex-col justify-center">

                          <p className="truncate text-sm font-semibold text-maroon-950 sm:text-base">
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

                          <p className="mt-3 text-sm font-bold text-maroon-800">

                            ₹
                            {(
                              item.price *
                              item.quantity
                            ).toLocaleString(
                              "en-IN",
                            )}

                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                  {/* ==================================
                      FOOTER
                  ================================== */}

                  <div className="flex flex-col gap-5 bg-maroon-50/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                    {/* TOTAL */}

                    <div>

                      <p className="text-xs text-gray-500">
                        Order total
                      </p>

                      <p className="mt-1 text-xl font-bold text-maroon-950">

                        ₹
                        {Number(
                          order.total || 0,
                        ).toLocaleString(
                          "en-IN",
                        )}

                      </p>

                    </div>

                    {/* VIEW BUTTON */}

                    <Link
                      href={`/orders/${order.id}`}
                      className="group inline-flex items-center justify-center gap-3 rounded-full bg-maroon-800 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-maroon-950 hover:shadow-md"
                    >

                      View order details

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />

                    </Link>

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </div>

    </main>
  );
}