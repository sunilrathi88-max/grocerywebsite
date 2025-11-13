import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      // Get all users
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    }
    case 'POST': {
      // Create new user
      const { email, password, name, phone } = req.body;
      const user = await prisma.user.create({
        data: { email, password, name, phone },
      });
      return res.status(201).json(user);
    }
    default:
      return res.status(405).send('Method not allowed');
  }
}
