'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Play,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

const salePrice = (product: Product, basePrice: number) =>
  product.isOnSale
    ? Math.max(
        0,
        basePrice -
          (product.discountType === 'percentage'
            ? (basePrice * product.discount) / 100
            : product.discount)
      )
    : basePrice;

/* =========================================================
   DESCRIPTION FORMATTER
   Supports:
   - HTML
   - Plain text
   - Markdown headings
   - Markdown bold text
   - Bullet points
========================================================= */

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const formatInlineText = (text: string) =>
  escapeHtml(text).replace(
    /\*\*(.*?)\*\*/g,
    '<strong>$1</strong>'
  );

const formatDescription = (description: string): string => {
  if (!description?.trim()) return '';

  // If HTML already exists, return it directly
  if (
    /<\/?(p|h1|h2|h3|h4|ul|ol|li|strong|br|div)\b/i.test(
      description
    )
  ) {
    return description;
  }

  const lines = description
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n');

  let html = '';
  let bulletItems: string[] = [];
  let paragraphLines: string[] = [];

  const flushBullets = () => {
    if (bulletItems.length > 0) {
      html += `<ul>${bulletItems
        .map((item) => `<li>${formatInlineText(item)}</li>`)
        .join('')}</ul>`;

      bulletItems = [];
    }
  };

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      html += `<p>${formatInlineText(
        paragraphLines.join(' ')
      )}</p>`;

      paragraphLines = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushParagraph();
      flushBullets();
      return;
    }

    // H3
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushBullets();

      html += `<h3>${formatInlineText(
        trimmed.replace(/^###\s+/, '')
      )}</h3>`;

      return;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      flushBullets();

      html += `<h2>${formatInlineText(
        trimmed.replace(/^##\s+/, '')
      )}</h2>`;

      return;
    }

    // H1
    if (trimmed.startsWith('# ')) {
      flushParagraph();
      flushBullets();

      html += `<h2>${formatInlineText(
        trimmed.replace(/^#\s+/, '')
      )}</h2>`;

      return;
    }

    // Bullet point
    if (/^[-•*]\s+/.test(trimmed)) {
      flushParagraph();

      bulletItems.push(
        trimmed.replace(/^[-•*]\s+/, '')
      );

      return;
    }

    flushBullets();

    paragraphLines.push(trimmed);
  });

  flushParagraph();
  flushBullets();

  return html;
};

/* =========================================================
   MEDIA TYPE
========================================================= */

type MediaItem =
  | {
      type: 'image';
      url: string;
    }
  | {
      type: 'video';
      url: string;
    };

export default function ProductPage() {
  const router = useRouter();

  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useCart();

  const { id: productId } = useParams<{ id: string }>();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] =
    useState('');

  const [quantity, setQuantity] = useState(1);

  const [mediaIndex, setMediaIndex] = useState(0);

  /* =========================================================
     LOAD PRODUCT
  ========================================================= */

  useEffect(() => {
    if (!productId) return;

    let active = true;

    fetch(`/api/products/${productId}`)
      .then((response) =>
        response.ok ? response.json() : null
      )
      .then((data) => {
        if (!active) return;

        const loadedProduct = data?.product || null;

        setProduct(loadedProduct);

        setSelectedSize(
          loadedProduct?.sizes?.find(
            (item: { stock: number }) =>
              item.stock > 0
          )?.size || ''
        );
      })
      .catch(() => {
        if (active) {
          setProduct(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [productId]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#fff8fa] text-maroon-900">
        Loading design…
      </main>
    );
  }

  /* =========================================================
     PRODUCT NOT FOUND
  ========================================================= */

  if (!product) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#fff8fa] text-center">
        <div>
          <h1 className="font-serif text-3xl text-maroon-950">
            Design not found
          </h1>

          <Link
            href="/shop"
            className="mt-5 inline-block rounded-full bg-maroon-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white"
          >
            Return to shop
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     IMAGES
  ========================================================= */

  const imageUrls: string[] =
    Array.isArray(product.imageUrls) &&
    product.imageUrls.length > 0
      ? product.imageUrls.filter(
          (url): url is string =>
            typeof url === 'string' &&
            url.trim().length > 0
        )
      : ['/images/logo.jpeg'];

  /* =========================================================
     VIDEO
  ========================================================= */

  const videoUrl: string =
    typeof product.videoUrl === 'string'
      ? product.videoUrl
      : '';

  /* =========================================================
     PRODUCT MEDIA
  ========================================================= */

  const mediaItems: MediaItem[] = [
    ...imageUrls.map(
      (url): MediaItem => ({
        type: 'image',
        url,
      })
    ),

    ...(videoUrl
      ? [
          {
            type: 'video' as const,
            url: videoUrl,
          },
        ]
      : []),
  ];

  const activeMedia: MediaItem =
    mediaItems[mediaIndex] || mediaItems[0];

  /* =========================================================
     PRODUCT PRICING
  ========================================================= */

  const selectedSizeDetails = product.sizes.find(
    (item) => item.size === selectedSize
  );

  const selectedStock =
    selectedSizeDetails?.stock || 0;

  const basePrice =
    selectedSizeDetails?.price ?? product.price;

  const price = salePrice(product, basePrice);

  const soldOut =
    product.sizes.reduce(
      (total, item) => total + item.stock,
      0
    ) === 0;

  /* =========================================================
     DESCRIPTION
  ========================================================= */

  const descriptionHtml = formatDescription(
    product.description || ''
  );

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const add = () => {
    if (!selectedSize || !selectedStock) return;

    addToCart(
      product,
      selectedSize,
      quantity
    );
  };

  return (
    <main className="min-h-screen bg-[#fff8fa] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* ================= BACK BUTTON ================= */}

        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-maroon-800 transition hover:text-pink-600"
        >
          <ArrowLeft size={16} />
          Back to shop
        </button>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* =====================================================
              PRODUCT MEDIA
          ===================================================== */}

          <section>

            <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] border border-maroon-100 bg-white shadow-luxury">

              {activeMedia.type === 'image' ? (
                <Image
                  src={activeMedia.url}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover object-top"
                />
              ) : (
                <video
                  key={activeMedia.url}
                  src={activeMedia.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                >
                  Your browser does not support video playback.
                </video>
              )}

              {/* SOLD OUT */}

              {soldOut && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center bg-maroon-950/55">
                  <span className="rounded-full border border-white/70 bg-maroon-950 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white">
                    Sold Out
                  </span>
                </div>
              )}

              {/* WISHLIST */}

              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Save to wishlist"
                className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-maroon-800 shadow transition hover:scale-105"
              >
                <Heart
                  size={19}
                  className={
                    isWishlisted(product.id)
                      ? 'fill-current'
                      : ''
                  }
                />
              </button>

            </div>

            {/* =====================================================
                MEDIA THUMBNAILS
            ===================================================== */}

            {mediaItems.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">

                {mediaItems.map(
                  (media: MediaItem, index: number) => (
                    <button
                      key={`${media.type}-${media.url}-${index}`}
                      type="button"
                      onClick={() =>
                        setMediaIndex(index)
                      }
                      className={`relative h-20 w-16 flex-none overflow-hidden rounded-xl border-2 transition ${
                        index === mediaIndex
                          ? 'border-maroon-800'
                          : 'border-transparent'
                      }`}
                    >

                      {media.type === 'image' ? (
                        <Image
                          src={media.url}
                          alt={`${product.name} view ${
                            index + 1
                          }`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="relative flex h-full w-full items-center justify-center bg-maroon-950">

                          <video
                            src={media.url}
                            muted
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 h-full w-full object-cover opacity-60"
                          />

                          <div className="relative z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-maroon-900 shadow-lg">

                            <Play
                              size={15}
                              className="ml-0.5 fill-current"
                            />

                          </div>

                        </div>
                      )}

                    </button>
                  )
                )}

              </div>
            )}

          </section>

          {/* =====================================================
              PRODUCT DETAILS
          ===================================================== */}

          <section className="font-sans">

            <p className="inline-block rounded-full border border-maroon-100 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-maroon-800">
              {product.category}
            </p>

            <h1 className="mt-4 font-serif text-4xl text-maroon-950">
              {product.name}
            </h1>

            {/* PRICE */}

            <div className="mt-6 flex items-center gap-3">

              <span className="text-3xl font-bold text-maroon-800">
                ₹{price.toLocaleString('en-IN')}
              </span>

              {product.isOnSale && (
                <>
                  <span className="text-lg text-maroon-500 line-through">
                    ₹{basePrice.toLocaleString(
                      'en-IN'
                    )}
                  </span>

                  <span className="rounded bg-pink-100 px-2 py-1 text-xs font-bold text-pink-700">
                    SALE
                  </span>
                </>
              )}

            </div>

            {/* =====================================================
                DESCRIPTION
            ===================================================== */}

            <div
              className="
                mt-7
                text-gray-600

                [&_p]:mb-5
                [&_p]:text-[15px]
                [&_p]:leading-7

                [&_h2]:mb-4
                [&_h2]:mt-8
                [&_h2]:font-serif
                [&_h2]:text-2xl
                [&_h2]:font-semibold
                [&_h2]:text-maroon-950

                [&_h3]:mb-4
                [&_h3]:mt-8
                [&_h3]:font-serif
                [&_h3]:text-xl
                [&_h3]:font-semibold
                [&_h3]:text-maroon-950

                [&_strong]:font-semibold
                [&_strong]:text-maroon-900

                [&_ul]:mb-6
                [&_ul]:list-disc
                [&_ul]:space-y-2
                [&_ul]:pl-6

                [&_li]:pl-1
                [&_li]:leading-7
                [&_li]:text-gray-600
              "
              dangerouslySetInnerHTML={{
                __html: descriptionHtml,
              }}
            />

            <div className="my-7 h-px bg-maroon-100" />

            {/* ================= SIZE ================= */}

            <p className="mb-3 text-sm font-bold text-maroon-950">
              Select size
            </p>

            <div className="flex flex-wrap gap-2">

              {product.sizes.map((item) => (
                <button
                  disabled={item.stock < 1}
                  key={item.size}
                  onClick={() => {
                    setSelectedSize(item.size);
                    setQuantity(1);
                  }}
                  className={`h-11 min-w-11 rounded-full border px-3 text-xs font-bold transition ${
                    selectedSize === item.size
                      ? 'border-maroon-800 bg-maroon-800 text-white'
                      : 'border-maroon-100 bg-white text-maroon-950'
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {item.size}
                </button>
              ))}

            </div>

            {soldOut ? (
              <p className="mt-3 text-sm font-semibold text-pink-700">
                This design is sold out. It will be available again after
                restocking.
              </p>
            ) : (
              selectedSize && (
                <p className="mt-2 text-xs text-gray-500">
                  {selectedStock} available · Price shown for size{' '}
                  {selectedSize}
                </p>
              )
            )}

            {/* ================= QUANTITY ================= */}

            <div className="mt-7 flex items-center gap-4">

              <div className="flex items-center rounded-full border border-maroon-200 bg-white">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.max(
                        1,
                        quantity - 1
                      )
                    )
                  }
                  className="p-3"
                >
                  <Minus size={15} />
                </button>

                <span className="w-8 text-center text-sm font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={
                    !selectedStock ||
                    quantity >= selectedStock
                  }
                  onClick={() =>
                    setQuantity(quantity + 1)
                  }
                  className="p-3 disabled:opacity-40"
                >
                  <Plus size={15} />
                </button>

              </div>

            </div>

            {/* ================= ACTION BUTTONS ================= */}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                disabled={!selectedSize || !selectedStock}
                onClick={add}
                className="flex items-center justify-center gap-2 rounded-full bg-maroon-800 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-maroon-950 disabled:opacity-50"
              >
                <ShoppingBag size={16} />
                Add to cart
              </button>

              <button
                type="button"
                disabled={!selectedSize || !selectedStock}
                onClick={() => {
                  add();
                  router.push('/cart');
                }}
                className="rounded-full border border-maroon-800 py-3.5 text-xs font-bold uppercase tracking-wider text-maroon-800 transition hover:bg-maroon-50 disabled:opacity-50"
              >
                Buy now
              </button>

            </div>

          </section>

        </div>
      </div>
    </main>
  );
}