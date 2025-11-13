import { Product, Category, User, PromoCode, CartItem, Order } from './types';

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Product APIs
export function getProducts(): Promise<Product[]> {
  return fetcher<Product[]>('/api/products');
}
export function createProduct(product: Partial<Product>): Promise<Product> {
  return fetcher<Product>('/api/products', { method: 'POST', body: JSON.stringify(product) });
}

// Category APIs
export function getCategories(): Promise<Category[]> {
  return fetcher<Category[]>('/api/categories');
}
export function createCategory(category: Partial<Category>): Promise<Category> {
  return fetcher<Category>('/api/categories', { method: 'POST', body: JSON.stringify(category) });
}

// User APIs
export function getUsers(): Promise<User[]> {
  return fetcher<User[]>('/api/users');
}
export function createUser(user: Partial<User>): Promise<User> {
  return fetcher<User>('/api/users', { method: 'POST', body: JSON.stringify(user) });
}

// PromoCode APIs
export function getPromoCodes(): Promise<PromoCode[]> {
  return fetcher<PromoCode[]>('/api/promocodes');
}
export function createPromoCode(promo: Partial<PromoCode>): Promise<PromoCode> {
  return fetcher<PromoCode>('/api/promocodes', { method: 'POST', body: JSON.stringify(promo) });
}
