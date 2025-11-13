import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      // Get all promo codes
      const promoCodes = await prisma.promoCode.findMany();
      return res.status(200).json(promoCodes);
    }
    case 'POST': {
      // Create new promo code
      const { code, discount, discountType, active } = req.body;
      const promoCode = await prisma.promoCode.create({
        data: { code, discount, discountType, active },
      });
      return res.status(201).json(promoCode);
    }
    default:
      return res.status(405).send('Method not allowed');
  }
}
