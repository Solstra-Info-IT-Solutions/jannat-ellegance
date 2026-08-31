'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CartItem, Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useAuth } from './AuthProvider';

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  increaseQuantity: (id: string, size: string) => void;
  decreaseQuantity: (id: string, size: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const cartLineKey = (item: Pick<CartItem, 'id' | 'size'>) => `${item.id}:${item.size}`;

// Do not let a slow account-cart request erase a cart item added in this tab.
// Local quantities win for matching lines and are validated again by the server
// before checkout or cart persistence.
const mergeCarts = (accountCart: CartItem[], browserCart: CartItem[]) => {
  const merged = new Map(accountCart.map((item) => [cartLineKey(item), item]));
  browserCart.forEach((item) => merged.set(cartLineKey(item), item));
  return Array.from(merged.values());
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, status } = useAuth();
  const store = useCartStore();
  const [cartHydratedForUser, setCartHydratedForUser] = useState('');
  const mergedWishlistUser = useRef('');
  const cartIds = useMemo(() => Array.from(new Set(store.cart.map((item) => item.id))).join(','), [store.cart]);

  useEffect(() => {
    if (status !== 'authenticated' || !user) {
      setCartHydratedForUser('');
      return;
    }
    let cancelled = false;
    setCartHydratedForUser('');

    fetch('/api/cart', { credentials: 'include' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (cancelled) return;
        if (data?.success) {
          const currentBrowserCart = useCartStore.getState().cart;
          useCartStore.getState().setCart(mergeCarts(data.cart || [], currentBrowserCart));
        }
        setCartHydratedForUser(user.id);
      })
      .catch(() => { if (!cancelled) setCartHydratedForUser(user.id); });

    return () => { cancelled = true; };
  }, [status, user?.id]);

  // Wait for the account cart to be loaded/merged before syncing. Without this,
  // an empty browser cart can race a saved cart and permanently overwrite it.
  useEffect(() => {
    if (status !== 'authenticated' || !user || cartHydratedForUser !== user.id) return;
    const timer = setTimeout(() => {
      fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: store.cart.map(({ id, size, quantity }) => ({ id, size, quantity })) }),
      }).catch(() => undefined);
    }, 500);
    return () => clearTimeout(timer);
  }, [store.cart, status, user?.id, cartHydratedForUser]);

  useEffect(() => {
    if (status === 'unauthenticated') mergedWishlistUser.current = '';
  }, [status]);

  useEffect(() => {
    if (status !== 'authenticated' || !user || mergedWishlistUser.current === user.id) return;
    let cancelled = false;
    const localIds = Array.from(new Set(store.wishlist.map((product) => product.id)));
    fetch('/api/wishlist/sync', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productIds: localIds }) })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (!cancelled && data?.success) { store.setWishlist(data.products); mergedWishlistUser.current = user.id; } })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [status, user?.id]);

  // Deleted, unpublished, sold-out, and price-changed items are reconciled
  // against the product API while the cart remains open.
  useEffect(() => {
    if (!cartIds) return;
    let cancelled = false;
    const ids = cartIds.split(',');
    Promise.all(ids.map((id) => fetch(`/api/products/${id}`).then((response) => response.ok ? response.json() : null)))
      .then((responses) => {
        if (cancelled) return;
        const products = new Map(responses.filter((response) => response?.product).map((response) => [response.product.id, response.product]));
        const updated = useCartStore.getState().cart.flatMap((item) => {
          const product = products.get(item.id);
          const selectedSize = product?.sizes.find((size: { size: string; stock: number; price?: number }) => size.size === item.size);
          const stock = selectedSize?.stock || 0;
          if (!product || stock < 1) return [];
          const sizePrice = selectedSize?.price ?? product.price;
          const price = product.isOnSale ? Math.max(0, sizePrice - (product.discountType === 'percentage' ? sizePrice * product.discount / 100 : product.discount)) : sizePrice;
          return [{ ...item, price, quantity: Math.min(item.quantity, stock) }];
        });
        if (JSON.stringify(updated) !== JSON.stringify(useCartStore.getState().cart)) useCartStore.getState().setCart(updated);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [cartIds]);

  const cartCount = store.cart.length;
  const subtotal = useMemo(() => store.cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [store.cart]);
  const shipping = 0;
  const toggleWishlist = (product: Product) => {
    const saved = store.isWishlisted(product.id);
    store.toggleWishlist(product);
    if (status !== 'authenticated' || !user) return;
    const request = saved
      ? fetch(`/api/wishlist/items/${product.id}`, { method: 'DELETE', credentials: 'include' })
      : fetch(`/api/wishlist/items/${product.id}`, { method: 'POST', credentials: 'include' });
    request.then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.success) store.setWishlist(data.products); })
      .catch(() => fetch('/api/wishlist', { credentials: 'include' }).then((response) => response.ok ? response.json() : null).then((data) => data?.success && store.setWishlist(data.products)).catch(() => undefined));
  };

  return <CartContext.Provider value={{ ...store, toggleWishlist, cartCount, subtotal, shipping, total: subtotal + shipping }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
