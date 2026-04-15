import { Request, Response, Router } from 'express';
import prisma from '../config/prisma';
import { hashPassword } from '../utils/password';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.query;

  const include: {
    Products: {
      where?: {
        name: {
          contains: string;
        };
      };
    };
  } = {
    Products: {}
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
  const user = {
    name: String(req.body.name || '').trim(),
    email: String(req.body.email || '').trim().toLowerCase(),
    password: String(req.body.password || ''),
    cpf: String(req.body.cpf || '').trim(),
    role: String(req.body.role || 'buyer'),
  };

  if (!user.name || !user.email || !user.password || !user.cpf) {
    return res.status(400).json({ message: 'Name, email, password and CPF are required' });
  }
  
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
      data: {
        ...user,
        password: hashPassword(user.password),
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating user' });
  }

  return res.json({ message: 'User created successfully' });
});

export default router;
