'use client';
import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { CartItem, Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useAuth } from './AuthProvider';
interface CartContextType {
  cart: CartItem[]; wishlist: Product[]; cartCount: number; subtotal: number; shipping: number; total: number; cartDrawerOpen: boolean; setCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, quantity?: number) => void; removeFromCart: (id: string, size: string) => void; increaseQuantity: (id: string, size: string) => void; decreaseQuantity: (id: string, size: string) => void;
  clearCart: () => void; toggleWishlist: (product: Product) => void; isWishlisted: (id: string) => boolean;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, status } = useAuth(); const store = useCartStore();
  const mergedWishlistUser = useRef('');
  const cartIds = useMemo(() => Array.from(new Set(store.cart.map((item) => item.id))).join(','), [store.cart]);
  useEffect(() => { if (status !== 'authenticated' || !user) return; let cancelled = false; fetch('/api/cart', { credentials: 'include' }).then((res) => res.ok ? res.json() : null).then((data) => { if (!cancelled && data?.success) store.setCart(data.cart); }).catch(() => undefined); return () => { cancelled = true; }; }, [status, user?.id]);
  useEffect(() => { if (status !== 'authenticated' || !user) return; const timer = setTimeout(() => { fetch('/api/cart', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cart: store.cart.map(({ id, size, quantity }) => ({ id, size, quantity })) }) }).catch(() => undefined); }, 500); return () => clearTimeout(timer); }, [store.cart, status, user?.id]);
  useEffect(() => { if (status === 'unauthenticated') mergedWishlistUser.current = ''; }, [status]);
  useEffect(() => { if (status !== 'authenticated' || !user || mergedWishlistUser.current === user.id) return; let cancelled = false; const localIds = Array.from(new Set(store.wishlist.map((product) => product.id))); fetch('/api/wishlist/sync', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productIds: localIds }) }).then((res) => res.ok ? res.json() : null).then((data) => { if (!cancelled && data?.success) { store.setWishlist(data.products); mergedWishlistUser.current = user.id; } }).catch(() => undefined); return () => { cancelled = true; }; }, [status, user?.id]);
  // Keep persisted carts in sync with product changes. Deleted, unpublished, and
  // sold-out size lines are removed locally as well as from signed-in carts.
  useEffect(() => { if (!cartIds) return; let cancelled = false; const ids = cartIds.split(','); Promise.all(ids.map((id) => fetch(`/api/products/${id}`).then((res) => res.ok ? res.json() : null))).then((responses) => { if (cancelled) return; const products = new Map(responses.filter((response) => response?.product).map((response) => [response.product.id, response.product])); const updated = store.cart.flatMap((item) => { const product = products.get(item.id); const selectedSize = product?.sizes.find((size: { size: string; stock: number; price?: number }) => size.size === item.size); const stock = selectedSize?.stock || 0; if (!product || stock < 1) return []; const sizePrice = selectedSize?.price ?? product.price; const price = product.isOnSale ? Math.max(0, sizePrice - (product.discountType === 'percentage' ? sizePrice * product.discount / 100 : product.discount)) : sizePrice; return [{ ...item, price, quantity: Math.min(item.quantity, stock) }]; }); if (JSON.stringify(updated) !== JSON.stringify(store.cart)) store.setCart(updated); }).catch(() => undefined); return () => { cancelled = true; }; }, [cartIds]);
  const cartCount = store.cart.length;
  const subtotal = useMemo(() => store.cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [store.cart]); const shipping = subtotal === 0 || subtotal >= 2999 ? 0 : 99;
  const toggleWishlist = (product: Product) => { const saved = store.isWishlisted(product.id); store.toggleWishlist(product); if (status !== 'authenticated' || !user) return; const request = saved ? fetch(`/api/wishlist/items/${product.id}`, { method: 'DELETE', credentials: 'include' }) : fetch(`/api/wishlist/items/${product.id}`, { method: 'POST', credentials: 'include' }); request.then((res) => res.ok ? res.json() : null).then((data) => { if (data?.success) store.setWishlist(data.products); }).catch(() => fetch('/api/wishlist', { credentials: 'include' }).then((res) => res.ok ? res.json() : null).then((data) => data?.success && store.setWishlist(data.products)).catch(() => undefined)); };
  return <CartContext.Provider value={{ ...store, toggleWishlist, cartCount, subtotal, shipping, total: subtotal + shipping }}>{children}</CartContext.Provider>;
};
export const useCart = () => { const context = useContext(CartContext); if (!context) throw new Error('useCart must be used within a CartProvider'); return context; };
