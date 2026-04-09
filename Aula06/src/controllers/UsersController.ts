import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';

const router = Router();

const prisma = new PrismaClient({
  log: ['query', 'info', 'error', 'warn']
});

router.get('/', async (req: Request, res: Response) => {
  
  const users = await prisma.user.findMany();
  return res.json(users);
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.query;

  const include = {
    Products: {
      
    }
  }
  if (name) {
    include.Products.where = {
      name: {
        contains: String(name)
      }
    }
  }

  const user = await prisma.user.findUnique({
    where: { 
      id: Number(id)
    },
    include: include
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
});

router.post('/', async (req: Request, res: Response) => {
  const user = req.body;
  
  // nao pode existir cpf e email iguais
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { cpf: user.cpf },
        { email: user.email }
      ]
    }
  });

  if (existingUser) {
    return res.status(400).json({ message: 'CPF or email already exists' });
  }

  try {
    await prisma.user.create({
      data: user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating user' });
  }

  return res.json({ message: 'User created successfully' });
});

export default router;

