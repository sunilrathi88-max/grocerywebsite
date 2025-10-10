// FIX: Import React to use React.ReactNode type.
import React from 'react';

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
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
  discount?: number;
  deliverySlot?: {
    date: string;
    time: string;
  };
}