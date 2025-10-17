export interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  stock: number;
  category_id?: string;
  capacity: string;
  material: 'metallic' | 'plastic';
  color: string;
  images: string[];
  variants?: ProductVariant[];
  sku: string;
  meta_title?: string;
  meta_description?: string;
  slug: string;
  featured?: boolean;
  active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  capacity: string;
  color: string;
  stock: number;
  price_modifier?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  order_number: string;
  customer_info: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping_cost: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: ShippingAddress;
  shipping_provider?: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total: number;
  variant?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  notes?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'refunded';

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase?: number;
  max_uses?: number;
  current_uses: number;
  valid_from: string;
  valid_until: string;
  active: boolean;
}

export interface ShippingZone {
  id: string;
  name: string;
  postal_codes: string[];
  base_rate: number;
  additional_rate_per_kg: number;
  estimated_days: number;
  provider: string;
}

export interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}
