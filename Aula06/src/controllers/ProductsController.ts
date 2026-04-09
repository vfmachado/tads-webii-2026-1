import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';

const router = Router();

const prisma = new PrismaClient({
  log: ['query', 'info', 'error', 'warn']
});

router.get('/', async (req: Request, res: Response) => {
  
  const products = await prisma.product.findMany();
  return res.json(products);
});

router.post('/', async (req: Request, res: Response) => {
  const product = req.body;

  try {
    await prisma.product.create({
      data: product
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating product' });
  }

  return res.json({ message: 'Product created successfully' });
});

export default router;

