import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      // Get all categories
      const categories = await prisma.category.findMany();
      return res.status(200).json(categories);
    }
    case 'POST': {
      // Create new category
      const { name, slug, image } = req.body;
      const category = await prisma.category.create({
        data: { name, slug, image }
      });
      return res.status(201).json(category);
    }
    default:
      return res.status(405).send('Method not allowed');
  }
}
