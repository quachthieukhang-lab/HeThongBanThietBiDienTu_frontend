export interface ServicePackageLite {
  _id: string;
  name: string;
  price: number;
  description?: string;
  duration?: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  facets?: any[];
  servicePackages?: ServicePackageLite[]; 
}
