import { Order, Product } from '../types';

export interface ProductPerformance {
  id: number;
  name: string;
  revenue: number;
  unitsSold: number;
}

export interface InventoryAlert {
  id: number;
  name: string;
  stock: number;
  status: 'Low' | 'Out';
}

export const analyticsHelpers = {
  calculateBestSellers: (orders: Order[], products: Product[]): ProductPerformance[] => {
    const productMap = new Map<number, ProductPerformance>();

    // Initialize map with products
    products.forEach((p) => {
      productMap.set(p.id, { id: p.id, name: p.name, revenue: 0, unitsSold: 0 });
    });

    // Aggregate sales
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const current = productMap.get(item.product.id);
        if (current) {
          current.unitsSold += item.quantity;
          current.revenue += item.selectedVariant.price * item.quantity;
        }
      });
    });

    // Convert to array and sort by revenue
    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5
  },

  getInventoryHealth: (products: Product[]): InventoryAlert[] => {
    return products
      .flatMap((p) =>
        p.variants.map((v) => ({
          id: p.id,
          name: `${p.name} (${v.name})`,
          stock: v.stock,
          status: v.stock === 0 ? 'Out' : v.stock < 5 ? 'Low' : 'OK',
        }))
      )
      .filter((item) => item.status !== 'OK')
      .map((item) => ({ ...item, status: item.status as 'Low' | 'Out' }))
      .sort((a, b) => a.stock - b.stock);
  },

  calculateMoMGrowth: (orders: Order[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentMonthRevenue = 0;
    let lastMonthRevenue = 0;

    orders.forEach((order) => {
      const date = new Date(order.date);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        currentMonthRevenue += order.total;
      } else if (date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear) {
        lastMonthRevenue += order.total;
      }
    });

    if (lastMonthRevenue === 0) return 100; // infinite growth if prev is 0
    return ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
  },
};
