import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      // Get all products
      const products = await prisma.product.findMany({
        include: { category: true }
      });
      return res.status(200).json(products);
    }
    case 'POST': {
      // Create new product
      const { name, slug, description, price, weight, sku, stock, status, categoryId } = req.body;
      const product = await prisma.product.create({
        data: { name, slug, description, price, weight, sku, stock, status, categoryId }
      });
      return res.status(201).json(product);
    }
    default:
      return res.status(405).send('Method not allowed');
  }
}
