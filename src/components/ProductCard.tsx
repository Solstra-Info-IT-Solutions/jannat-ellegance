'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
Heart,
ShoppingBag,
Eye,
Sparkles,
ArrowUpRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
const { addToCart, toggleWishlist, isWishlisted } = useCart();

const image = product.imageUrls[0] || '/images/logo.jpeg';

const totalStock = product.sizes.reduce(
(total, item) => total + item.stock,
0
);

const soldOut = totalStock === 0;

const firstAvailableSize = product.sizes.find(
(item) => item.stock > 0
)?.size;

const prices = product.sizes.map((item) => {
const basePrice = item.price ?? product.price;

if (!product.isOnSale) return basePrice;

return Math.max(
  0,
  basePrice -
    (product.discountType === 'percentage'
      ? (basePrice * product.discount) / 100
      : product.discount)
);


});

const lowestPrice = prices.length
? Math.min(...prices)
: product.price;

const hasPriceRange = new Set(prices).size > 1;

const wishlisted = isWishlisted(product.id);

const discountLabel =
product.isOnSale && product.discount
? product.discountType === 'percentage'
? `${product.discount}% OFF`
: `₹${product.discount} OFF`
: null;

return ( <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-pink-100/80 bg-white shadow-[0_8px_30px_rgb(136,19,55,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-pink-200 hover:shadow-[0_25px_60px_rgba(136,19,55,0.16)]">

  {/* ================= IMAGE SECTION ================= */}

  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-pink-50 via-[#fff8fa] to-rose-100">

    {/* Product Image */}

    <Link
      href={`/product/${product.id}`}
      className="absolute inset-0 block"
    >
      <Image
        src={image}
        alt={product.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
      />
    </Link>

    {/* Luxury Gradient Overlay */}

    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-950/30 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

    {/* ================= BADGES ================= */}

    <div className="absolute left-4 top-4 z-20 flex flex-col items-start gap-2">

      {product.isOnSale && (
        <span className="rounded-full bg-gradient-to-r from-rose-900 to-pink-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">

          SALE

        </span>
      )}

      {discountLabel && (
        <span className="rounded-full border border-pink-200 bg-white/95 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-pink-600 shadow-sm backdrop-blur">

          {discountLabel}

        </span>
      )}

    </div>

    {/* ================= WISHLIST ================= */}

    <button
      onClick={() => toggleWishlist(product)}
      aria-label={
        wishlisted
          ? 'Remove from wishlist'
          : 'Add to wishlist'
      }
      className={`absolute right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full border shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95 ${
        wishlisted
          ? 'border-pink-300 bg-pink-500 text-white'
          : 'border-white/80 bg-white/90 text-maroon-800 hover:bg-pink-50'
      }`}
    >
      <Heart
        size={17}
        strokeWidth={2}
        className={wishlisted ? 'fill-current' : ''}
      />
    </button>

    {/* ================= QUICK VIEW ================= */}

    <Link
      href={`/product/${product.id}`}
      aria-label="View product"
      className="absolute right-4 top-16 z-20 grid h-10 w-10 translate-x-16 place-items-center rounded-full border border-white/80 bg-white/90 text-maroon-800 opacity-0 shadow-lg backdrop-blur transition-all duration-500 hover:scale-110 hover:bg-pink-50 group-hover:translate-x-0 group-hover:opacity-100"
    >
      <Eye size={17} />
    </Link>

    {/* ================= SOLD OUT ================= */}

    {soldOut && (
      <div className="absolute inset-0 z-30 grid place-items-center bg-maroon-950/60 backdrop-blur-[2px]">

        <div className="rounded-full border border-white/30 bg-maroon-950/90 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl">

          Sold Out

        </div>

      </div>
    )}

    {/* ================= QUICK ADD ================= */}

    {!soldOut && firstAvailableSize && (
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">

        <button
          onClick={() =>
            addToCart(product, firstAvailableSize)
          }
          className="flex w-full translate-y-20 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-maroon-950 via-rose-900 to-pink-700 px-4 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white opacity-0 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] group-hover:translate-y-0 group-hover:opacity-100"
        >

          <ShoppingBag size={16} />

          Quick Add To Bag

        </button>

      </div>
    )}

    {/* Mobile Bottom Indicator */}

    {!soldOut && (
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60" />
    )}

  </div>

  {/* ================= PRODUCT DETAILS ================= */}

  <div className="flex flex-1 flex-col p-4 sm:p-5">

    {/* Category */}

    <div className="flex items-center justify-between gap-2">

      <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-pink-600">

        <Sparkles size={11} />

        {product.category}

      </p>

      <ArrowUpRight
        size={15}
        className="text-pink-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-pink-600"
      />

    </div>

    {/* Product Name */}

    <Link
      href={`/product/${product.id}`}
      className="mt-2"
    >
      <h3 className="line-clamp-2 min-h-[3rem] font-serif text-lg font-semibold leading-snug text-maroon-950 transition-colors duration-300 group-hover:text-rose-700 sm:text-xl">

        {product.name}

      </h3>
    </Link>

    {/* Divider */}

    <div className="my-4 h-px w-full bg-gradient-to-r from-pink-200 via-maroon-100 to-transparent" />

    {/* Price */}

    <div className="mt-auto flex flex-wrap items-end justify-between gap-3">

      <div>

        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-maroon-400">

          {hasPriceRange ? 'Starting From' : 'Price'}

        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">

          <span className="font-serif text-xl font-bold text-maroon-950 sm:text-2xl">

            {hasPriceRange ? 'From ' : ''}₹
            {lowestPrice.toLocaleString('en-IN')}

          </span>

        </div>

      </div>

      {/* Original Price */}

      {product.isOnSale && (
        <div className="text-right">

          <p className="text-[9px] font-bold uppercase tracking-wider text-maroon-400">

            MRP

          </p>

          <p className="mt-1 text-xs font-medium text-maroon-400 line-through">

            ₹{product.price.toLocaleString('en-IN')}

          </p>

        </div>
      )}

    </div>

    {/* Bottom Action - Mobile Friendly */}

    {!soldOut && firstAvailableSize && (
      <button
        onClick={() =>
          addToCart(product, firstAvailableSize)
        }
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-maroon-900 transition-all duration-300 hover:border-pink-400 hover:bg-gradient-to-r hover:from-rose-900 hover:to-pink-600 hover:text-white sm:hidden"
      >

        <ShoppingBag size={15} />

        Add To Bag

      </button>
    )}

  </div>

</article>

);
}
