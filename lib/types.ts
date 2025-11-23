// Product type - Updated with comprehensive e-commerce schema
export interface Product {
  // Core Fields
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  stock: number;
  status: string;
  images: string;
  categoryId: string;
  
  // Existing Custom Fields
  weight?: number;
  sku?: string;
  origin?: string;
  grade?: string;
  certification?: string;
  spicelevel?: string;
  
  // New E-commerce Fields
  tags?: string[];
  brand?: string;
  barcode?: string;
  featured?: boolean;
  bestseller?: boolean;
  new_arrival?: boolean;
  discount_percent?: number;
  compare_price?: number;
  min_order_qty?: number;
  max_order_qty?: number;
  rating?: number;
  review_count?: number;
  meta_title?: string;
  meta_description?: string;
  variants?: ProductVariant[];
  related_products?: string[];
  
  // Weight & Dimensions
  weight_value?: number;
  weight_unit?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  
  // Product Specifics
  origin_country?: string;
  certifications?: string[];
  allergen_info?: string;
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sodium?: number;
    [key: string]: any;
  };
  
  // Relations
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

// Product Variant type
export interface ProductVariant {
  id: string;
  name: string; // e.g., "100g", "500g", "1kg"
  sku?: string;
  price: number;
  compare_price?: number;
  stock: number;
  weight_value?: number;
  weight_unit?: string;
  image?: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent_id?: string;
  createdAt?: string;
}

// User type
export interface User {
  id: string;
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Promo Code type
export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  discountType: string;
  active: boolean;
  createdAt?: string;
  expiresAt?: string;
}

// CartItem type
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addedAt?: string;
  product?: Product;
}

// Order type
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
}

// OrderItem type
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

// Product Review type
export interface ProductReview {
  id: string;
  product_id: string;
  user_id?: string;
  author: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  helpful: number;
  images?: string[];
  createdAt: string;
}
