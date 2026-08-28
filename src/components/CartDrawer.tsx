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

  return (
    <>
      {/* Overlay Background */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="fixed inset-0 z-50 bg-maroon-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      {/* Drawer Container */}
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full sm:w-[430px] bg-[#fff8fa] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col font-sans"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-5 bg-white border-b border-maroon-100">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-maroon-900">
              Your Bag
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {cart.length} item{cart.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setCartDrawerOpen(false)}
            className="w-10 h-10 rounded-full bg-maroon-50 flex items-center justify-center text-maroon-800 hover:bg-maroon-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-grow overflow-y-auto px-5 sm:px-6 py-5">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="w-20 h-20 rounded-full bg-maroon-50 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={32} className="text-maroon-700" />
                </div>
                <h3 className="font-serif text-2xl text-maroon-900">
                  Your bag is empty
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-[250px] mx-auto">
                  Looks like you haven't added anything to your bag yet.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setCartDrawerOpen(false)}
                  className="inline-flex items-center gap-2 bg-maroon-800 hover:bg-maroon-900 text-white px-6 py-3 rounded-full mt-6 text-sm font-semibold transition"
                >
                  Start Shopping
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-maroon-50"
                >
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.id}`}
                      onClick={() => setCartDrawerOpen(false)}
                      className="w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-maroon-50 relative border border-maroon-100"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-top"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={`/product/${item.id}`}
                            onClick={() => setCartDrawerOpen(false)}
                            className="font-serif text-sm font-semibold text-maroon-950 hover:text-maroon-700 line-clamp-1 transition"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-gray-400 hover:text-red-500 transition"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Size: <span className="font-semibold text-maroon-900">{item.size}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-maroon-100 rounded-full bg-maroon-50/50">
                          <button
                            onClick={() => decreaseQuantity(item.id, item.size)}
                            className="p-1.5 hover:text-maroon-700 transition"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-maroon-950">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id, item.size)}
                            className="p-1.5 hover:text-maroon-700 transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Total Price */}
                        <span className="font-bold text-sm text-maroon-800">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer / Summary */}
        {cart.length > 0 && (
          <div className="bg-white border-t border-maroon-100 px-5 sm:px-6 py-5">
            {/* Free Shipping Alert */}
            {subtotal < 2999 && (
              <div className="bg-[#fff0f3] rounded-xl px-4 py-2.5 mb-4 border border-maroon-100">
                <p className="text-xs text-maroon-900">
                  Add <strong>₹{(2999 - subtotal).toLocaleString()}</strong> more to unlock <strong>FREE SHIPPING</strong> 🎁
                </p>
              </div>
            )}

            {/* Calculations Panel */}
            <div className="space-y-2 text-sm font-sans">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="h-px bg-maroon-100 my-2" />
              <div className="flex justify-between text-base font-bold text-maroon-950">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Link Actions */}
            <Link
              href="/cart"
              onClick={() => setCartDrawerOpen(false)}
              className="mt-5 w-full bg-maroon-800 hover:bg-maroon-900 text-white py-3.5 rounded-full flex items-center justify-center gap-2 font-semibold transition shadow-lg shadow-maroon-800/20"
            >
              View Cart & Checkout
              <ArrowRight size={18} />
            </Link>
            <p className="text-center text-[10px] text-gray-400 mt-3">
              Secure checkout · Exchange only within 7 days · Premium details
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
