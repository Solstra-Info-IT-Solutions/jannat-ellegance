'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const image = product.imageUrls[0] || '/images/logo.jpeg';
  const totalStock = product.sizes.reduce((total, item) => total + item.stock, 0);
  const soldOut = totalStock === 0;
  const firstAvailableSize = product.sizes.find((item) => item.stock > 0)?.size;
  const prices = product.sizes.map((item) => {
    const basePrice = item.price ?? product.price;
    return product.isOnSale ? Math.max(0, basePrice - (product.discountType === 'percentage' ? basePrice * product.discount / 100 : product.discount)) : basePrice;
  });
  const lowestPrice = prices.length ? Math.min(...prices) : product.price;
  const hasPriceRange = new Set(prices).size > 1;

  return <article className="group relative overflow-hidden rounded-[24px] border border-maroon-50 bg-white shadow-sm transition hover:shadow-luxury">
    <div className="relative aspect-[4/5] overflow-hidden bg-maroon-50">
      <Link href={`/product/${product.id}`} className="block h-full"><Image src={image} alt={product.name} fill className="object-cover object-top transition duration-500 group-hover:scale-105" /></Link>
      {soldOut && <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-maroon-950/55"><span className="rounded-full border border-white/70 bg-maroon-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">Sold Out</span></div>}
      {product.isOnSale && <span className="absolute left-4 top-4 rounded-full bg-maroon-800 px-3 py-1 text-[10px] font-bold uppercase text-white">Sale</span>}
      <button onClick={() => toggleWishlist(product)} aria-label="Save to wishlist" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-maroon-700 shadow"><Heart size={16} className={isWishlisted(product.id) ? 'fill-current' : ''} /></button>
      {firstAvailableSize && <button onClick={() => addToCart(product, firstAvailableSize)} className="absolute bottom-4 left-4 right-4 flex translate-y-16 items-center justify-center gap-2 rounded-full bg-maroon-850 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition group-hover:translate-y-0"><ShoppingBag size={14} />Quick add</button>}
    </div>
    <div className="p-4 sm:p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-pink-600">{product.category}</p><Link href={`/product/${product.id}`}><h3 className="mt-1 truncate font-serif text-base font-semibold text-maroon-950 hover:text-maroon-700">{product.name}</h3></Link><div className="mt-3 flex items-center gap-2"><span className="font-bold text-maroon-800">{hasPriceRange ? 'From ' : ''}₹{lowestPrice.toLocaleString('en-IN')}</span>{product.isOnSale && <span className="text-xs text-maroon-500 line-through">₹{product.price.toLocaleString('en-IN')}</span>}</div></div>
  </article>;
}
