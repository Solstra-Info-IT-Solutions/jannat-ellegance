export type ProductSize = { size: 'S' | 'M' | 'L' | 'XL' | 'XXL'; stock: number; price?: number };

export interface Product {
  id: string; name: string; category: string; categoryId: string; price: number; discount: number;
  discountType: 'percentage' | 'flat'; isOnSale: boolean; isFeatured?: boolean; description: string; sizes: ProductSize[];
  imageUrls: string[]; metaTitle?: string; metaDescription?: string; oldPrice?: number;
  salePrice?: number;
}
export interface CartItem { id: string; name: string; price: number; category: string; size: string; image: string; quantity: number; }
export interface OrderItem { productId: string; name: string; price: number; quantity: number; size: string; image: string; }
export interface Order {
  id: string; customerName: string; customerEmail: string; customerPhone: string; shippingAddress: string; city: string; state: string; postalCode: string;
  items: OrderItem[]; subtotal: number; shipping: number; total: number; paymentId?: string; paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'exchanged'; createdAt: string;
}
