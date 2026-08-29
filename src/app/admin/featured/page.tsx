'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Star } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

type Product = { id: string; name: string; category: string; price: number; salePrice?: number; imageUrls: string[]; isOnSale: boolean };

export default function AdminFeaturedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/admin/products?featured=true&limit=50', { credentials: 'include', cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load featured products')))
      .then((data) => setProducts(data.products || []))
      .catch(() => setError('Unable to load featured products.'));
  }, []);

  return <AdminShell title="Featured Masterpieces"><section className="rounded-3xl border border-maroon-100 bg-white p-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-serif text-2xl text-maroon-950">Homepage selection</h2><p className="mt-1 text-sm text-gray-500">Edit any featured product’s name, description, images, stock, size prices, sale, or visibility.</p></div><Link href="/admin/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-maroon-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"><Star size={15} />Manage products</Link></div>{error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{products.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.id} className="overflow-hidden rounded-2xl border border-pink-100 bg-pink-50/60"><img src={product.imageUrls[0] || '/images/logo.jpeg'} alt={product.name} className="aspect-[4/3] w-full object-cover object-top" /><div className="p-4"><p className="text-xs font-bold uppercase tracking-wider text-pink-600">{product.category}</p><h3 className="mt-1 font-serif text-xl text-maroon-950">{product.name}</h3><p className="mt-2 font-bold text-maroon-850">₹{(product.salePrice ?? product.price).toLocaleString('en-IN')}{product.isOnSale && <span className="ml-2 text-xs font-normal text-gray-500 line-through">₹{product.price.toLocaleString('en-IN')}</span>}</p><Link href={`/admin/products/${product.id}/edit`} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-pink-200 bg-white px-4 py-2 text-xs font-bold text-maroon-850"><Pencil size={14} />Edit featured product</Link></div></article>)}</div> : <div className="py-14 text-center"><p className="font-serif text-2xl text-maroon-950">No featured products yet.</p><p className="mt-2 text-sm text-gray-500">Edit a product and enable “Feature on home page”.</p></div>}</section></AdminShell>;
}
