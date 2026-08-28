'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const orderId = useSearchParams().get('orderId');
  return <main className="grid min-h-[70vh] place-items-center bg-[#fff8fa] px-4"><section className="max-w-lg rounded-3xl border border-maroon-100 bg-white p-8 text-center shadow-luxury"><CheckCircle2 className="mx-auto h-16 w-16 text-green-600" /><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-pink-600">Payment successful</p><h1 className="mt-2 font-serif text-4xl text-maroon-950">Your order is confirmed</h1><p className="mt-4 text-sm leading-6 text-gray-600">We have sent your order confirmation to your email address. You can follow fulfilment status in My Orders.</p>{orderId && <p className="mt-4 font-mono text-xs text-maroon-800">Order #{orderId.slice(-8).toUpperCase()}</p>}<div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/orders" className="rounded-full bg-maroon-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white">View my orders</Link><Link href="/shop" className="rounded-full border border-maroon-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-maroon-800">Continue shopping</Link></div></section></main>;
}
export default function CheckoutSuccessPage() { return <Suspense fallback={<main className="min-h-[70vh] bg-[#fff8fa]" />}><SuccessContent /></Suspense>; }
