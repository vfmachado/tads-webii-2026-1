import { NextFunction, Request, Response, Router } from 'express';
import prisma from '../config/prisma';

const router = Router();

function requireSeller(req: Request, res: Response, next: NextFunction) {
  const role = req.session.user?.role;

  if (!req.session.user || (role !== 'seller' && role !== 'admin')) {
    if (req.accepts('html')) {
      return res.redirect('/login?error=Entre como vendedor para publicar produtos.');
    }

    return res.status(403).json({ message: 'Seller login required' });
  }

  next();
}

router.get('/', async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.json(products);
});

router.post('/', requireSeller, async (req: Request, res: Response) => {
  // validacao precisa ser mais inteligente (zod)
  const name = String(req.body.name || '').trim();
  const description = String(req.body.description || '').trim();
  const category = String(req.body.category || '').trim();
  const price = Number.parseFloat(String(req.body.price || '').replace(',', '.'));
  const stock = Number.parseInt(String(req.body.stock || ''), 10);

  if (!name || !description || !category || Number.isNaN(price) || Number.isNaN(stock)) {
    if (req.accepts('html')) {
      return res.redirect('/seller-dashboard?error=Preencha todos os campos do produto.');
    }

    return res.status(400).json({ message: 'Name, description, category, price and stock are required' });
  }

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        category,
        price,
        stock,
        userId: req.session.user!.id,
      }
    });
  } catch (error) {
    console.error(error);
    if (req.accepts('html')) {
      return res.redirect('/seller-dashboard?error=Nao foi possivel publicar o produto.');
    }

    return res.status(500).json({ message: 'Error creating product' });
  }

  if (req.accepts('html')) {
    return res.redirect('/seller-dashboard?success=Produto publicado com sucesso.');
  }

  return res.json({ message: 'Product created successfully' });
});

export default router;
