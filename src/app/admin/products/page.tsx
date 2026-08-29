'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

type Product = { id: string; name: string; category: string; price: number; imageUrls: string[]; isActive: boolean; status: string; sizes: { size: string; stock: number }[] };
type Category = { _id: string; name: string };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState('');

  const load = () => fetch(`/api/admin/products?page=${page}&search=${encodeURIComponent(search)}&category=${category}`, { credentials: 'include' })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) throw new Error(data.error);
      setProducts(data.products);
      setPages(data.pages);
    })
    .catch(() => setError('Unable to load products.'));

  useEffect(() => {
    fetch('/api/admin/categories', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [page, search, category]);

  const remove = async (id: string) => {
    if (!window.confirm('Permanently delete this product? It will be removed from every customer cart and cannot be restored.')) return;
    const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!response.ok) return setError('Unable to delete product.');
    load();
  };

  return <AdminShell title="Product Management">
    <div className="mb-5 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-700" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search products" className="w-full rounded-full border border-maroon-100 bg-white py-3 pl-10 pr-4 text-sm" /></div>
      <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="rounded-full border border-maroon-100 bg-white px-4 text-sm"><option value="">All categories</option>{categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select>
      <Link href="/admin/categories" className="inline-flex items-center justify-center rounded-full border border-pink-200 bg-pink-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-maroon-850">Manage categories</Link>
      <Link href="/admin/products/new" className="inline-flex items-center justify-center gap-2 rounded-full bg-maroon-800 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"><Plus size={16} />Add product</Link>
    </div>
    {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="overflow-x-auto rounded-3xl border border-maroon-100 bg-white">
      <table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-maroon-50 text-xs uppercase text-maroon-900"><tr><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th><th className="p-4"></th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-t border-maroon-50"><td className="p-4"><div className="flex items-center gap-3"><img src={product.imageUrls[0] || '/images/logo.jpeg'} alt="" className="h-11 w-9 rounded object-cover" /><span className="font-semibold text-maroon-950">{product.name}</span></div></td><td className="p-4 text-gray-600">{product.category}</td><td className="p-4 font-semibold">₹{product.price.toLocaleString('en-IN')}</td><td className="p-4">{product.sizes.reduce((sum, item) => sum + item.stock, 0)}</td><td className="p-4"><span className="rounded-full bg-maroon-50 px-3 py-1 text-xs font-bold capitalize text-maroon-800">{product.isActive ? product.status : 'hidden'}</span></td><td className="p-4"><div className="flex gap-3"><Link href={`/admin/products/${product.id}/edit`} className="text-maroon-800" aria-label={`Edit ${product.name}`}><Pencil size={16} /></Link><button onClick={() => remove(product.id)} className="text-red-600" aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table>
      {!products.length && <p className="p-10 text-center text-sm text-gray-500">No products found.</p>}
    </div>
    <div className="mt-5 flex items-center justify-between"><p className="text-sm text-gray-500">Page {page} of {pages}</p><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-full border border-maroon-100 p-2 disabled:opacity-40"><ChevronLeft size={16} /></button><button disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-full border border-maroon-100 p-2 disabled:opacity-40"><ChevronRight size={16} /></button></div></div>
  </AdminShell>;
}
