import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      // Get all recipes (optionally filter by cuisineType, diet, season)
      const { cuisineType, diet, season } = req.query;
      const recipes = await prisma.recipe.findMany({
        where: {
          ...(cuisineType ? { cuisineType: String(cuisineType) } : {}),
          ...(diet ? { diet: String(diet) } : {}),
          ...(season ? { season: String(season) } : {})
        },
        include: { ingredients: true }
      });
      return res.status(200).json(recipes);
    }
    case 'POST': {
      // Create recipe
      const { title, slug, description, image, prepTime, servings, difficulty, ingredients, instructions, tips, cuisineType, diet, season } = req.body;
      if (!title || !slug || !instructions || !Array.isArray(ingredients)) return res.status(400).json({ error: "Missing required fields" });
      const recipe = await prisma.recipe.create({
        data: {
          title,
          slug,
          description,
          image,
          prepTime,
          servings,
          difficulty,
          instructions,
          tips,
          cuisineType,
          diet,
          season,
          ingredients: { create: ingredients.map((i: any) => ({ name: i.name, quantity: i.quantity, unit: i.unit, productId: i.productId })) }
        },
        include: { ingredients: true }
      });
      return res.status(201).json(recipe);
    }
    default:
      return res.status(405).send('Method not allowed');
  }
}
