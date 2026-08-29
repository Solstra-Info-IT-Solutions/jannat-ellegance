import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  cart: CartItem[]; wishlist: Product[]; cartDrawerOpen: boolean; setCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, size: string, quantity?: number) => void; removeFromCart: (id: string, size: string) => void;
  increaseQuantity: (id: string, size: string) => void; decreaseQuantity: (id: string, size: string) => void; clearCart: () => void;
  setCart: (cart: CartItem[]) => void; setWishlist: (wishlist: Product[]) => void; toggleWishlist: (product: Product) => void; isWishlisted: (id: string) => boolean;
}
export const useCartStore = create<CartState>()(persist((set, get) => ({
  cart: [], wishlist: [], cartDrawerOpen: false,
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  addToCart: (product, size, quantity = 1) => {
    const availableStock = product.sizes.find((item) => item.size === size)?.stock || 0;
    if (availableStock < 1) return;
    const cart = get().cart; const existing = cart.find((item) => item.id === product.id && item.size === size);
    const salePrice = product.salePrice ?? (product.isOnSale ? Math.max(0, product.price - (product.discountType === 'percentage' ? product.price * product.discount / 100 : product.discount)) : product.price);
    const nextQuantity = Math.min(availableStock, (existing?.quantity || 0) + quantity);
    const next = existing ? cart.map((item) => item === existing ? { ...item, price: salePrice, quantity: nextQuantity } : item) : [...cart, { id: product.id, name: product.name, price: salePrice, category: product.category, size, image: product.imageUrls[0] || '/images/logo.jpeg', quantity: Math.min(quantity, availableStock) }];
    set({ cart: next, cartDrawerOpen: true });
  },
  removeFromCart: (id, size) => set({ cart: get().cart.filter((item) => !(item.id === id && item.size === size)) }),
  increaseQuantity: (id, size) => set({ cart: get().cart.map((item) => item.id === id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item) }),
  decreaseQuantity: (id, size) => set({ cart: get().cart.map((item) => item.id === id && item.size === size ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0) }),
  clearCart: () => set({ cart: [] }), setCart: (cart) => set({ cart }), setWishlist: (wishlist) => set({ wishlist }),
  toggleWishlist: (product) => set({ wishlist: get().wishlist.some((item) => item.id === product.id) ? get().wishlist.filter((item) => item.id !== product.id) : [...get().wishlist, product] }),
  isWishlisted: (id) => get().wishlist.some((item) => item.id === id),
}), { name: 'jannat-elegance-cart-storage', partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }) }));
