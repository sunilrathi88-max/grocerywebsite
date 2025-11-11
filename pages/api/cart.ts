import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      // Get all cart items for a user (userId from query)
      const { userId } = req.query;
      if (!userId || typeof userId !== 'string') return res.status(400).json({ error: 'Missing userId' });
      const cartItems = await prisma.cartItem.findMany({ where: { userId }, include: { product: true } });
      return res.status(200).json(cartItems);
    }
    case 'POST': {
      // Add or update cart item
      const { userId, productId, quantity } = req.body;
      if (!userId || !productId || typeof quantity !== 'number') return res.status(400).json({ error: 'Missing fields' });
      const cartItem = await prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId } },
        update: { quantity },
        create: { userId, productId, quantity }
      });
      return res.status(200).json(cartItem);
    }
    case 'DELETE': {
      // Remove cart item
      const { userId, productId } = req.body;
      if (!userId || !productId) return res.status(400).json({ error: 'Missing fields' });
      await prisma.cartItem.delete({ where: { userId_productId: { userId, productId } } });
      return res.status(204).end();
    }
    default:
      return res.status(405).send('Method not allowed');
  }
}
