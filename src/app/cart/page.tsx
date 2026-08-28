'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
  } = useCart();

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#fff8fa] flex items-center justify-center px-4 font-sans animate-fadeUp">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-maroon-50 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-maroon-800" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-maroon-950 font-normal">Your Bag is Empty</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">
            Discover something beautiful for your upcoming celebration and experience true elegance.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-maroon-800 hover:bg-maroon-900 text-white font-semibold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full mt-8 shadow-md transition"
          >
            Start Shopping
            <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fff8fa] min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Step Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-8 select-none">
          <span className="text-maroon-800 font-extrabold">Shopping Bag</span>
          <ChevronRight size={14} />
          <span className="text-gray-300">Shipping & Payment</span>
          <ChevronRight size={14} />
          <span className="text-gray-300">Confirmation</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start animate-fadeUp">
          
          {/* Bag Items list */}
          <div className="space-y-4">
            <h1 className="font-serif text-3xl sm:text-4.5xl text-maroon-950 font-normal mb-6">Shopping Bag</h1>
            
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="bg-white rounded-[24px] border border-maroon-100/50 p-4 sm:p-5 flex gap-4 shadow-sm"
              >
                <div className="relative w-24 sm:w-28 aspect-[4/5] object-cover rounded-xl overflow-hidden bg-maroon-50/50 border border-maroon-100 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/product/${item.id}`}
                        className="font-serif text-base sm:text-lg text-maroon-950 font-semibold hover:text-maroon-800 transition line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 text-xs text-gray-500 mt-1">
                      <p>Size: <span className="font-semibold text-maroon-900">{item.size}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Counter */}
                    <div className="flex items-center border border-maroon-100 rounded-full bg-maroon-50/50">
                      <button
                        onClick={() => decreaseQuantity(item.id, item.size)}
                        className="p-1.5 hover:text-maroon-700 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-maroon-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id, item.size)}
                        className="p-1.5 hover:text-maroon-700 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Line Item Total */}
                    <strong className="text-maroon-950 font-bold text-sm sm:text-base">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky summary card */}
          <div className="bg-white rounded-[28px] border border-maroon-100/50 p-6 sm:p-8 shadow-luxury h-fit lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl text-maroon-950 font-medium mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-650 font-medium">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-650 font-medium">
                <span>Shipping Fee</span>
                <span className={shipping === 0 ? 'text-green-600 font-bold' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              
              {subtotal < 2999 && (
                <div className="bg-[#fff0f3] rounded-xl px-4 py-2.5 my-2 border border-maroon-100">
                  <p className="text-[11px] text-maroon-900 leading-normal">
                    Add <strong>₹{(2999 - subtotal).toLocaleString()}</strong> more to unlock <strong>FREE SHIPPING</strong> 🎁
                  </p>
                </div>
              )}

              <div className="h-px bg-maroon-100 my-4" />
              <div className="flex justify-between text-lg font-bold text-maroon-950">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full mt-8 bg-maroon-850 hover:bg-maroon-950 text-white py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-maroon-800/15"
            >
              Proceed to Checkout
              <ArrowRight size={14} />
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-gray-400 font-medium">
              <ShieldCheck size={14} className="text-green-600" />
              <span>Exchange only within 7 days &middot; Secure gateway</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
