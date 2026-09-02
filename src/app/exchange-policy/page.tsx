'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RefundPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#fff8fa] py-12 sm:py-16 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-maroon-800 transition mb-8"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <article className="bg-white rounded-[32px] border border-maroon-100 p-8 sm:p-12 shadow-sm space-y-6 text-gray-700 leading-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-maroon-950 font-normal border-b border-maroon-100 pb-4">
            Exchange Policy
          </h1>
          <p className="text-xs text-gray-400">Last updated: August 2026</p>

          {/* Prominent Highlight Alert Box */}
          <div className="bg-[#fff0f3] border-l-4 border-maroon-800 rounded-2xl p-6 my-6 flex gap-4 items-start">
            <AlertTriangle className="text-maroon-800 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-maroon-950 text-base uppercase tracking-wider">Exchange Guarantee</h3>
              <p className="text-maroon-900 font-bold text-sm sm:text-base mt-1">
                No Return, No Refund — Only Exchange
              </p>
              <p className="text-xs text-maroon-800/80 mt-1 leading-relaxed">
                At Jannat Elegance, we take pride in the quality and craftsmanship of our traditional Indian garments. Once a purchase is finalized, we do not accept returns or process monetary refunds. However, we are happy to offer sizing and variant exchanges.
              </p>
            </div>
          </div>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">1. Exchange Period</h2>
          <p>
            You may request an exchange for your item within <strong>7 days</strong> from the date of delivery. Any requests submitted after this 7-day period will unfortunately not be eligible for exchange.
          </p>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">2. Conditions for Exchange</h2>
          <p>
            To be eligible for an exchange, your garment must meet the following criteria:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>The item must be unused, unwashed, and in the same pristine condition that you received it.</li>
            <li>It must have all original Jannat Elegance tags, packaging, and labels fully attached.</li>
            <li>Proof of transaction (Invoice / Order ID / Payment confirmation) must be provided.</li>
          </ul>

          <h2 className="font-serif text-xl text-maroon-950 font-bold mt-8">3. How to Request an Exchange</h2>
          <p>
            To initiate an exchange, please contact our support team at <strong className="text-maroon-850">jannatelegance05@gmail.com</strong> or send a message via our WhatsApp floating support button with your Order Reference ID. Our boutique staff will guide you through the address shipping coordinates.
          </p>

          <div className="border-t border-maroon-100/50 pt-6 mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
            <ShieldCheck size={16} className="text-green-600" />
            <span>Designed with grace &middot; Made to be remembered</span>
          </div>
        </article>
      </div>
    </main>
  );
}
