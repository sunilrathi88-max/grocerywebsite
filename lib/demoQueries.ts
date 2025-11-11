import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllProducts() {
  return await prisma.product.findMany({ include: { category: true } });
}

export async function getAllCategories() {
  return await prisma.category.findMany();
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function getAllPromoCodes() {
  return await prisma.promoCode.findMany();
}

// Example: Get products with price > 20000
export async function getPremiumProducts() {
  return await prisma.product.findMany({ where: { price: { gt: 20000 } } });
}

// Example: Get single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({ where: { slug }, include: { category: true } });
}