'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

type Category = { _id: string; name: string };
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ShopPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#fff8fa] py-16 text-center text-sm text-gray-500">Loading designs…</main>}><ShopContent /></Suspense>;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const { wishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sort, setSort] = useState('featured');
  const categoryFromLink = searchParams.get('category') || '';
  const wishlistOnly = searchParams.get('wishlist') === 'true';
  const wishlistedIds = useMemo(() => new Set(wishlist.map((product) => product.id)), [wishlist]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?limit=48').then((response) => response.json()),
      fetch('/api/products/categories/list').then((response) => response.json()),
    ]).then(([productData, categoryData]) => {
      setProducts(productData.products || []);
      setCategories(categoryData.categories || []);
    }).catch(() => undefined).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => products.filter((product) => {
    const activeCategory = category || categoryFromLink;
    const categoryMatch = !activeCategory
      || product.categoryId === activeCategory
      || product.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesText = !search || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(search.toLowerCase());
    const matchesSize = !selectedSizes.length || product.sizes.some((item) => selectedSizes.includes(item.size) && item.stock > 0);
    return categoryMatch && matchesText && matchesSize && (!wishlistOnly || wishlistedIds.has(product.id));
  }).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0), [products, category, categoryFromLink, wishlistOnly, wishlistedIds, search, selectedSizes, sort]);

  const toggleSize = (size: string) => setSelectedSizes((items) => items.includes(size) ? items.filter((item) => item !== size) : [...items, size]);
  const title = wishlistOnly ? 'My Wishlist' : 'Design Portfolio';
  const countText = wishlistOnly ? `${filtered.length} saved design${filtered.length === 1 ? '' : 's'}` : `${filtered.length} available designs`;

  return <main className="min-h-screen bg-[#fff8fa] py-8 sm:py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-600">Jannat Elegance</p><h1 className="mt-2 font-serif text-4xl text-maroon-950">{title}</h1><p className="mt-2 text-sm text-gray-500">{loading ? 'Loading designs…' : countText}</p></div><div className="flex gap-3"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-700" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search designs" className="w-full rounded-full border border-maroon-100 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-maroon-800 sm:w-60" /></div><select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-full border border-maroon-100 bg-white px-4 text-xs font-bold uppercase text-maroon-900 outline-none"><option value="featured">Featured</option><option value="low">Price: low</option><option value="high">Price: high</option></select></div></div>
    <div className="grid gap-9 lg:grid-cols-[230px_1fr]"><aside className="h-fit rounded-3xl border border-maroon-100 bg-white p-5"><p className="flex items-center gap-2 font-serif text-lg text-maroon-950"><SlidersHorizontal size={17} />Filters</p><div className="mt-5 border-t border-maroon-100 pt-5"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-maroon-900">Categories</p><button onClick={() => setCategory('')} className={`mb-2 block text-left text-sm ${!category ? 'font-bold text-pink-600' : 'text-gray-600'}`}>All designs</button>{categories.map((item) => <button key={item._id} onClick={() => setCategory(item._id)} className={`mb-2 block text-left text-sm ${category === item._id ? 'font-bold text-pink-600' : 'text-gray-600'}`}>{item.name}</button>)}</div><div className="mt-5 border-t border-maroon-100 pt-5"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-maroon-900">Sizes</p><div className="flex flex-wrap gap-2">{sizes.map((size) => <button key={size} onClick={() => toggleSize(size)} className={`h-9 min-w-9 rounded-full border px-2 text-xs font-bold ${selectedSizes.includes(size) ? 'border-maroon-850 bg-maroon-850 text-white' : 'border-maroon-100 text-maroon-900'}`}>{size}</button>)}</div></div></aside><section>{!loading && filtered.length === 0 ? <div className="rounded-3xl border border-maroon-100 bg-white p-14 text-center text-gray-500">{wishlistOnly ? 'Your wishlist is empty. Save a design with the heart button to see it here.' : 'No live products match these filters.'}</div> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-6">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>}</section></div>
  </div></main>;
}
