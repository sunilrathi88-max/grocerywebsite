import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      // Get all orders, optionally filtered by userId
      const { userId } = req.query;
      let orders;
      if (userId && typeof userId === 'string') {
        orders = await prisma.order.findMany({
          where: { userId },
          include: { items: { include: { product: true } } },
        });
      } else {
        orders = await prisma.order.findMany({
          include: { items: { include: { product: true } } },
        });
      }
      return res.status(200).json(orders);
    }
    case 'POST': {
      // Create a new order
      const { userId, items, paymentMethod, shippingAddress, deliverySlot } = req.body;
      if (!userId || !Array.isArray(items) || !paymentMethod || !shippingAddress)
        return res.status(400).json({ error: 'Missing required fields' });
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const order = await prisma.order.create({
        data: {
          userId,
          paymentMethod,
          shippingAddress,
          deliverySlot,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price,
            })),
          },
          subtotal,
          total: subtotal,
        },
        include: { items: true },
      });
      return res.status(201).json(order);
    }
    default:
      return res.status(405).send('Method not allowed');
  }
}
