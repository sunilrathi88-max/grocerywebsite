import { useState, useEffect } from 'react';
import { getProducts, getCategories, getPromoCodes, getUsers, getPromoCodes as getRecipes } from "../lib/api";
import { Product, Category, PromoCode, User } from "../lib/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getProducts().then(p => { setProducts(p); setLoading(false); });
  }, []);
  return { products, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCategories().then(p => { setCategories(p); setLoading(false); });
  }, []);
  return { categories, loading };
}

export function usePromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getPromoCodes().then(p => { setPromoCodes(p); setLoading(false); });
  }, []);
  return { promoCodes, loading };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUsers().then(u => { setUsers(u); setLoading(false); });
  }, []);
  return { users, loading };
}
