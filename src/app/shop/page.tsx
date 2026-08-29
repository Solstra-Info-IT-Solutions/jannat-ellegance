'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
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
  const wishlistOnly = searchParams.get('wishlist') === 'true';
  const categoryFromLink = searchParams.get('category') || '';
  const searchFromLink = searchParams.get('search') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(categoryFromLink);
  const [search, setSearch] = useState(searchFromLink);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setCategory(categoryFromLink); setSearch(searchFromLink); setPage(1);
  }, [categoryFromLink, searchFromLink]);

  useEffect(() => {
    fetch('/api/products/categories/list', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load categories')))
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (wishlistOnly) { setLoading(false); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true); setError('');
      const query = new URLSearchParams({ page: String(page), limit: '24' });
      if (category) query.set('category', category);
      if (search.trim()) query.set('search', search.trim());
      if (selectedSizes.length) query.set('size', selectedSizes.join(','));
      if (minPrice.trim()) query.set('minPrice', minPrice);
      if (maxPrice.trim()) query.set('maxPrice', maxPrice);
      if (sort !== 'featured') query.set('sort', sort);
      try {
        const response = await fetch(`/api/products?${query.toString()}`, { cache: 'no-store', signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load products');
        setProducts(data.products || []); setPages(data.pages || 1); setTotal(data.total || 0);
      } catch (reason) {
        if ((reason as Error).name !== 'AbortError') { setProducts([]); setError('Unable to load products. Please try again.'); }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [category, search, selectedSizes, minPrice, maxPrice, sort, page, wishlistOnly]);

  const wishlistResults = useMemo(() => wishlist.filter((product) => {
    const text = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    const selectedCategory = categories.find((item) => item._id === category)?.name || category;
    const matchesCategory = !category || product.categoryId === category || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !search.trim() || text.includes(search.trim().toLowerCase());
    const matchesSize = !selectedSizes.length || product.sizes.some((item) => selectedSizes.includes(item.size) && item.stock > 0);
    const price = product.salePrice ?? product.price;
    const matchesMin = !minPrice || price >= Number(minPrice);
    const matchesMax = !maxPrice || price <= Number(maxPrice);
    return matchesCategory && matchesSearch && matchesSize && matchesMin && matchesMax;
  }).sort((a, b) => sort === 'price_asc' ? (a.salePrice ?? a.price) - (b.salePrice ?? b.price) : sort === 'price_desc' ? (b.salePrice ?? b.price) - (a.salePrice ?? a.price) : 0), [wishlist, category, categories, search, selectedSizes, minPrice, maxPrice, sort]);

  const visibleProducts = wishlistOnly ? wishlistResults : products;
  const activeCategory = categories.find((item) => item._id === category)?.name || category;
  const count = wishlistOnly ? wishlistResults.length : total;
  const resetFilters = () => { setSelectedSizes([]); setMinPrice(''); setMaxPrice(''); setSort('featured'); setPage(1); };
  const selectCategory = (value: string) => { setCategory(value); setPage(1); };
  const toggleSize = (size: string) => { setSelectedSizes((items) => items.includes(size) ? items.filter((item) => item !== size) : [...items, size]); setPage(1); };

  return <main className="min-h-screen bg-[#fff8fa] py-8 sm:py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6">
    <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.2em] text-pink-600">Jannat Elegance</p><h1 className="mt-2 font-serif text-4xl text-maroon-950">{wishlistOnly ? 'My Wishlist' : 'Design Portfolio'}</h1><p className="mt-2 text-sm text-gray-500">{loading ? 'Loading designs…' : `${count} ${wishlistOnly ? 'saved design' : 'design'}${count === 1 ? '' : 's'}${activeCategory ? ` in ${activeCategory}` : ''}`}</p></div>
    <div className="flex flex-wrap gap-2 border-y border-pink-100 py-4"><button type="button" onClick={() => selectCategory('')} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${!category ? 'border-maroon-850 bg-maroon-850 text-white' : 'border-pink-200 bg-white text-maroon-850 hover:bg-pink-50'}`}>All categories</button>{categories.map((item) => <button type="button" key={item._id} onClick={() => selectCategory(item._id)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${category === item._id ? 'border-maroon-850 bg-maroon-850 text-white' : 'border-pink-200 bg-white text-maroon-850 hover:bg-pink-50'}`}>{item.name}</button>)}</div>
    <div className="my-6 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-maroon-700" size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search designs, descriptions or categories" className="w-full rounded-full border border-maroon-100 bg-white py-3 pl-11 pr-4 text-sm text-maroon-950 outline-none transition focus:border-maroon-800" /></div><button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-maroon-850"><SlidersHorizontal size={15} />Filters<ChevronDown size={15} className={filtersOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></button><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="rounded-full border border-maroon-100 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-maroon-850 outline-none"><option value="featured">Latest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></div>
    <div className={`grid gap-8 ${filtersOpen ? 'lg:grid-cols-[250px_1fr]' : ''}`}>
      {filtersOpen && <aside className="h-fit rounded-3xl border border-maroon-100 bg-white p-5"><div className="flex items-center justify-between"><p className="flex items-center gap-2 font-serif text-lg text-maroon-950"><SlidersHorizontal size={17} />Filters</p><button type="button" onClick={resetFilters} className="text-xs font-bold text-pink-700">Clear all</button></div><div className="mt-5 border-t border-maroon-100 pt-5"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-maroon-900">Price range</p><div className="grid grid-cols-2 gap-2"><label className="text-xs text-gray-500">Min ₹<input inputMode="decimal" value={minPrice} onChange={(event) => { setMinPrice(event.target.value.replace(/[^0-9.]/g, '')); setPage(1); }} placeholder="0" className="mt-1 w-full rounded-lg border border-maroon-100 p-2 text-sm text-maroon-950" /></label><label className="text-xs text-gray-500">Max ₹<input inputMode="decimal" value={maxPrice} onChange={(event) => { setMaxPrice(event.target.value.replace(/[^0-9.]/g, '')); setPage(1); }} placeholder="Any" className="mt-1 w-full rounded-lg border border-maroon-100 p-2 text-sm text-maroon-950" /></label></div></div><div className="mt-5 border-t border-maroon-100 pt-5"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-maroon-900">Sizes</p><div className="flex flex-wrap gap-2">{sizes.map((size) => <button type="button" key={size} onClick={() => toggleSize(size)} className={`h-9 min-w-9 rounded-full border px-2 text-xs font-bold ${selectedSizes.includes(size) ? 'border-maroon-850 bg-maroon-850 text-white' : 'border-maroon-100 bg-white text-maroon-900'}`}>{size}</button>)}</div></div></aside>}
      <section>{error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{loading ? <p className="py-16 text-center text-sm text-gray-500">Loading designs…</p> : visibleProducts.length === 0 ? <div className="rounded-3xl border border-maroon-100 bg-white p-14 text-center"><p className="font-serif text-2xl text-maroon-950">No products found.</p><p className="mt-2 text-sm text-gray-500">Try another search term or clear your filters.</p>{wishlistOnly && <p className="mt-3 text-sm text-gray-500">Save a product with the heart button to add it to your wishlist.</p>}</div> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-6">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}{!wishlistOnly && pages > 1 && <div className="mt-8 flex items-center justify-center gap-4"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-pink-200 bg-white text-maroon-850 disabled:opacity-40" aria-label="Previous page"><ChevronLeft size={17} /></button><span className="text-sm text-gray-500">Page {page} of {pages}</span><button type="button" disabled={page >= pages} onClick={() => setPage((value) => value + 1)} className="grid h-10 w-10 place-items-center rounded-full border border-pink-200 bg-white text-maroon-850 disabled:opacity-40" aria-label="Next page"><ChevronRight size={17} /></button></div>}</section>
    </div>
  </div></main>;
}
