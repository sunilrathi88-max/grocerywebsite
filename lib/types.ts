// Product type
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  weight: number;
  sku: string;
  origin?: string;
  grade?: string;
  certification?: string;
  spicelevel?: string;
  stock: number;
  status: string;
  images: string;
  categoryId: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
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
