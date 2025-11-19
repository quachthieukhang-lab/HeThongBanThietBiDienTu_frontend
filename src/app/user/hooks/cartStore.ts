// stores/cartStore.ts
import { create } from 'zustand';

// Định nghĩa kiểu dữ liệu cho store
interface CartStore {
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCart: (amount?: number) => void;
  decrementCart: (amount?: number) => void;
}

// Tạo store với TypeScript
export const useCartStore = create<CartStore>((set) => ({
  cartCount: 0,
  
  setCartCount: (count: number) => set({ cartCount: count }),
  
  incrementCart: (amount: number = 1) => 
    set((state) => ({ cartCount: state.cartCount + amount })),
    
  decrementCart: (amount: number = 1) => 
    set((state) => ({ cartCount: Math.max(0, state.cartCount - amount )})),
}));

