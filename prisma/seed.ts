import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
  // Categories
  const spices = await prisma.category.create({ data: { name: 'Spices', slug: 'spices' } });
  const grains = await prisma.category.create({ data: { name: 'Grains', slug: 'grains' } });
  const beverages = await prisma.category.create({ data: { name: 'Beverages', slug: 'beverages' } });
  const snacks = await prisma.category.create({ data: { name: 'Snacks', slug: 'snacks' } });

  // Products
  await prisma.product.create({ data: { name: 'Organic Turmeric Powder', slug: 'organic-turmeric-powder', description: 'Pure and organic turmeric powder.', price: 18000, weight: 250, sku: 'TURM250', stock: 100, status: 'active', images: 'https://via.placeholder.com/150', categoryId: spices.id } });
  await prisma.product.create({ data: { name: 'Premium Basmati Rice', slug: 'premium-basmati-rice', description: 'Aromatic premium basmati rice.', price: 95000, weight: 5000, sku: 'BASM5000', stock: 40, status: 'active', images: 'https://via.placeholder.com/150', categoryId: grains.id } });
  await prisma.product.create({ data: { name: 'Green Tea Classic', slug: 'green-tea-classic', description: 'Premium green tea leaves.', price: 25000, weight: 100, sku: 'GTEA100', stock: 70, status: 'active', images: 'https://via.placeholder.com/150', categoryId: beverages.id } });
  await prisma.product.create({ data: { name: 'Multigrain Chips', slug: 'multigrain-chips', description: 'Healthy crispy multigrain chips.', price: 12000, weight: 150, sku: 'MCHIPS150', stock: 60, status: 'active', images: 'https://via.placeholder.com/150', categoryId: snacks.id } });

  // Users
  await prisma.user.create({ data: { email: 'admin@grocery.com', password: 'hashed_password_12345', name: 'Admin User', phone: '9876543210' } });
  await prisma.user.create({ data: { email: 'customer@grocery.com', password: 'hashed_password_54321', name: 'Customer User', phone: '8888888888' } });

  // Promo Code
  await prisma.promoCode.create({ data: { code: 'WELCOME10', discount: 10, discountType: 'percent', active: true } });
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
