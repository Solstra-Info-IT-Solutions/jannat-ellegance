'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Category = { _id: string; name: string; imageUrl?: string; productCount?: number };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/products/categories/list', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load categories')))
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return <main className="min-h-screen bg-[#fff8fa] py-10 sm:py-14"><div className="mx-auto max-w-6xl px-4 sm:px-6"><div className="mb-9 text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-600">Jannat Elegance</p><h1 className="mt-2 font-serif text-4xl text-maroon-950">All Categories</h1><p className="mt-3 text-sm text-gray-500">Explore every collection, chosen by our boutique team.</p></div>{loading ? <p className="py-16 text-center text-sm text-gray-500">Loading categories…</p> : categories.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">{categories.map((category) => <Link key={category._id} href={`/shop?category=${category._id}`} className="group overflow-hidden rounded-2xl border border-maroon-100 bg-white p-2 text-center shadow-sm transition hover:border-pink-300 hover:shadow-luxury"><div className="relative aspect-square overflow-hidden rounded-xl bg-pink-50"><Image src={category.imageUrl || '/images/logo.jpeg'} alt={category.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover object-top transition duration-500 group-hover:scale-105" /></div><p className="mt-3 truncate px-1 text-sm font-bold text-maroon-950">{category.name}</p><p className="mb-2 mt-1 text-xs text-gray-500">{category.productCount || 0} design{category.productCount === 1 ? '' : 's'}</p></Link>)}</div> : <p className="rounded-3xl border border-maroon-100 bg-white p-12 text-center text-sm text-gray-500">No categories are available yet.</p>}</div></main>;
}
