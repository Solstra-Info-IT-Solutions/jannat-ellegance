'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  Sparkles,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartDrawer: React.FC = () => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
    cartDrawerOpen,
    setCartDrawerOpen,
  } = useCart();

  if (!cartDrawerOpen) return null;

  const remainingForFreeShipping = 0;

  const shippingProgress = 100;

  const itemCount = cart.reduce(
    (totalItems, item) => totalItems + item.quantity,
    0
  );

  return (
    <>
      {/* ================= OVERLAY ================= */}

      <div
        onClick={() => setCartDrawerOpen(false)}
        className="
          fixed inset-0
          z-[9998]
          bg-maroon-950/55
          backdrop-blur-sm
          animate-in fade-in duration-300
        "
      />

      {/* ================= CART DRAWER ================= */}

      <aside
        className="
          fixed right-0 top-0
          z-[9999]
          flex h-[100dvh]
          w-full max-w-[440px]
          flex-col
          overflow-hidden
          border-l border-pink-200/70
          bg-[#fff8fa]
          shadow-[-20px_0_60px_rgba(65,8,28,0.25)]
          animate-in slide-in-from-right duration-300
        "
      >
        {/* ================= HEADER ================= */}

        <div className="relative shrink-0 overflow-hidden border-b border-pink-200/60 bg-gradient-to-r from-maroon-950 via-rose-950 to-maroon-900 px-5 py-5 text-white sm:px-6">

          {/* Background Decorations */}

          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-pink-500/20 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-16 left-10 h-28 w-28 rounded-full bg-rose-400/10 blur-2xl" />

          <div className="relative flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
                <ShoppingBag size={20} className="text-pink-200" />
              </div>

              <div>
                <div className="flex items-center gap-2">

                  <h2 className="font-serif text-2xl font-semibold">
                    Your Bag
                  </h2>

                  <Sparkles
                    size={15}
                    className="text-pink-300"
                  />

                </div>

                <p className="mt-0.5 text-xs text-pink-100/70">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} in your bag
                </p>

              </div>

            </div>

            <button
              onClick={() => setCartDrawerOpen(false)}
              aria-label="Close cart"
              className="
                grid h-10 w-10 place-items-center
                rounded-full
                border border-white/15
                bg-white/10
                text-white
                backdrop-blur
                transition-all duration-300
                hover:rotate-90
                hover:bg-white/20
              "
            >
              <X size={20} />
            </button>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">

          {/* ================= EMPTY CART ================= */}

          {cart.length === 0 ? (

            <div className="flex min-h-full items-center justify-center py-16 text-center">

              <div className="max-w-xs">

                <div className="relative mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-pink-100 to-rose-100">

                  <div className="absolute inset-2 rounded-full border border-pink-200" />

                  <ShoppingBag
                    size={34}
                    className="relative text-maroon-800"
                  />

                </div>

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-600">
                  Your Collection Awaits
                </p>

                <h3 className="mt-3 font-serif text-3xl text-maroon-950">
                  Your bag is empty
                </h3>

                <p className="mt-3 text-sm leading-6 text-maroon-900/55">
                  Discover elegant styles and find something beautiful for your next special moment.
                </p>

                <Link
                  href="/shop"
                  onClick={() => setCartDrawerOpen(false)}
                  className="
                    mt-7 inline-flex items-center gap-2
                    rounded-full
                    bg-gradient-to-r from-rose-900 to-pink-600
                    px-6 py-3.5
                    text-sm font-semibold text-white
                    shadow-lg shadow-pink-200
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >
                  Explore Collection
                  <ArrowRight size={17} />
                </Link>

              </div>

            </div>

          ) : (

            <>
              {/* ================= CART ITEMS ================= */}

              <div className="space-y-4">

                {cart.map((item) => (

                  <article
                    key={`${item.id}-${item.size}`}
                    className="
                      group relative
                      overflow-hidden
                      rounded-2xl
                      border border-pink-200/60
                      bg-gradient-to-br from-[#fffafd] to-pink-50/70
                      p-3
                      shadow-sm
                      transition-all duration-300
                      hover:border-pink-300
                      hover:shadow-md
                    "
                  >

                    <div className="flex gap-3">

                      {/* Product Image */}

                      <Link
                        href={`/product/${item.id}`}
                        onClick={() => setCartDrawerOpen(false)}
                        className="
                          relative h-24 w-20
                          shrink-0 overflow-hidden
                          rounded-xl
                          border border-pink-200/70
                          bg-pink-50
                        "
                      >

                        <Image
                          src={item.image || '/images/logo.jpeg'}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="
                            object-cover object-top
                            transition-transform duration-500
                            group-hover:scale-105
                          "
                        />

                      </Link>

                      {/* Product Details */}

                      <div className="flex min-w-0 flex-1 flex-col justify-between">

                        <div>

                          <div className="flex items-start justify-between gap-3">

                            <Link
                              href={`/product/${item.id}`}
                              onClick={() => setCartDrawerOpen(false)}
                              className="
                                line-clamp-1
                                font-serif text-base font-semibold
                                text-maroon-950
                                transition-colors
                                hover:text-pink-600
                              "
                            >
                              {item.name}
                            </Link>

                            <button
                              onClick={() =>
                                removeFromCart(item.id, item.size)
                              }
                              aria-label={`Remove ${item.name}`}
                              className="
                                grid h-8 w-8 shrink-0 place-items-center
                                rounded-full
                                text-maroon-400
                                transition-all
                                hover:bg-red-50
                                hover:text-red-500
                              "
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                          <div className="mt-1.5 inline-flex items-center rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1">

                            <span className="text-[10px] text-maroon-700">
                              Size:
                            </span>

                            <span className="ml-1 text-[10px] font-bold text-maroon-950">
                              {item.size}
                            </span>

                          </div>

                        </div>

                        {/* Bottom Controls */}

                        <div className="mt-3 flex items-center justify-between gap-3">

                          {/* Quantity */}

                          <div
                            className="
                              flex items-center
                              rounded-full
                              border border-pink-200
                              bg-[#fff8fa]
                              p-1
                            "
                          >

                            <button
                              onClick={() =>
                                decreaseQuantity(item.id, item.size)
                              }
                              className="
                                grid h-7 w-7 place-items-center
                                rounded-full
                                text-maroon-700
                                transition
                                hover:bg-pink-100
                              "
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>

                            <span className="w-7 text-center text-xs font-bold text-maroon-950">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(item.id, item.size)
                              }
                              className="
                                grid h-7 w-7 place-items-center
                                rounded-full
                                bg-maroon-900
                                text-white
                                shadow-sm
                                transition
                                hover:bg-pink-600
                              "
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>

                          </div>

                          {/* Price */}

                          <div className="text-right">

                            <p className="text-[10px] text-maroon-900/45">
                              Total
                            </p>

                            <p className="text-sm font-bold text-maroon-900">
                              ₹
                              {(item.price * item.quantity).toLocaleString(
                                'en-IN'
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

              {/* ================= FREE SHIPPING ================= */}

              <div className="mt-6 rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 p-4">

                <div className="flex items-center justify-center gap-3 text-center">

                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-maroon-900 text-pink-200">
                    <Truck size={16} />
                  </div>

                  <div className="min-w-0">

                    {remainingForFreeShipping > 0 ? (
                      <>
                        <p className="text-center text-xs leading-5 text-maroon-900">
                          Add{' '}
                          <strong>
                            ₹
                            {remainingForFreeShipping.toLocaleString(
                              'en-IN'
                            )}
                          </strong>{' '}
                          more to unlock{' '}
                          <strong className="text-pink-600">
                            FREE SHIPPING
                          </strong>{' '}
                          🎁
                        </p>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-pink-200">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-rose-900 to-pink-500 transition-all duration-500"
                            style={{
                              width: `${shippingProgress}%`,
                            }}
                          />

                        </div>

                      </>
                    ) : (

                      <p className="text-center text-xs font-semibold leading-5 text-green-700">
                        🎉 Congratulations! You've unlocked FREE SHIPPING.
                      </p>

                    )}

                  </div>

                </div>

              </div>

            </>

          )}

        </div>

        {/* ================= FOOTER ================= */}

        {cart.length > 0 && (

          <div className="
            shrink-0
            border-t border-pink-200/70
            bg-gradient-to-b from-[#fffafd] to-[#fff3f6]
            px-5 py-5 sm:px-6
          ">

            {/* Price Summary */}

            <div className="space-y-3">

              <div className="flex items-center justify-between text-sm text-maroon-900/65">

                <span>Subtotal</span>

                <span className="font-medium">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>

              </div>

              <div className="flex items-center justify-between text-sm text-maroon-900/65">

                <span>Shipping</span>

                <span
                  className={
                    shipping === 0
                      ? 'font-semibold text-green-600'
                      : 'font-medium'
                  }
                >
                  {shipping === 0
                    ? 'FREE'
                    : `₹${shipping.toLocaleString('en-IN')}`}
                </span>

              </div>

              <div className="border-t border-pink-200/70 pt-3">

                <div className="flex items-center justify-between">

                  <span className="font-serif text-xl font-semibold text-maroon-950">
                    Total
                  </span>

                  <span className="font-serif text-xl font-bold text-maroon-950">
                    ₹{total.toLocaleString('en-IN')}
                  </span>

                </div>

              </div>

            </div>

            {/* Checkout Button */}

            <Link
              href="/cart"
              onClick={() => setCartDrawerOpen(false)}
              className="
                group mt-5
                flex w-full items-center justify-center gap-3
                rounded-full
                bg-gradient-to-r from-maroon-950 via-rose-900 to-pink-600
                px-5 py-4
                text-sm font-bold text-white
                shadow-lg shadow-maroon-900/20
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
              "
            >

              View Cart & Checkout

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </Link>

            {/* Security Text */}

            <div className="mt-4 flex items-center justify-center gap-2 text-center">

              <ShieldCheck size={14} className="text-pink-500" />

              <p className="text-[10px] text-maroon-900/45">
                Secure checkout · Premium shopping experience
              </p>

            </div>

          </div>

        )}

      </aside>
    </>
  );
};

export default CartDrawer;
