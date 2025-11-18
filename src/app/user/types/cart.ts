// types/cart.ts
export type CartItem = {
  _id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  name?: string;
  price: number;
  quantity: number;
  image?: string;
  meta?: Record<string, any>;
};

export type Cart = {
  _id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  totalQuantity: number;
  totalPrice: number;
};
