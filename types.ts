import React from 'react';

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  verifiedPurchase?: boolean;
  date?: string;
}

export interface QnA {
  id: number;
  author: string;
  question: string;
  answer?: string;
}

export interface Variant {
  id: number;
  name: string; // e.g., "1g", "250g"
  price: number;
  salePrice?: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  videos?: string[];
  category: string;
  variants: Variant[];
  reviews: Review[];
  qna?: QnA[];
  nutrition?: { key: string; value: string }[];
  origin?: string;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  selectedVariant: Variant;
  quantity: number;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
  icon?: React.ReactNode;
}

export interface Address {
  id: number;
  type: 'Shipping' | 'Billing';
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  addresses: Address[];
  isAdmin: boolean;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  deliveryMethod: string;
  paymentMethod: string;
  shippingCost: number;
  discount?: number;
  deliverySlot?: {
    date: string;
    time: string;
  };
}
// FIX: Added Testimonial interface to be shared across components.
export interface Testimonial {
  id: number;
  name: string;
  quote: string;
  rating: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  content: string; // This could be markdown or HTML string
  tags: string[];
}
