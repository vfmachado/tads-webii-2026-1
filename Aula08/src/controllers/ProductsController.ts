import { NextFunction, Request, Response, Router } from 'express';
import prisma from '../config/prisma';
import { productImageUpload, removeLocalProductImage } from '../config/upload';
import { storeProductImage } from '../services/product-image-storage';
import { isProductCategory } from '../constants/product-categories';

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

function uploadProductImage(req: Request, res: Response, next: NextFunction) {
  productImageUpload.single('image')(req, res, (error: unknown) => {
    if (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel processar a imagem enviada.';

      if (req.accepts('html')) {
        return res.redirect(`/seller-dashboard?error=${encodeURIComponent(message)}`);
      }

      return res.status(400).json({ message });
    }

    next();
  });
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

router.post('/', requireSeller, uploadProductImage, async (req: Request, res: Response) => {
  // validacao precisa ser mais inteligente (zod)
  const name = String(req.body.name || '').trim();
  const description = String(req.body.description || '').trim();
  const category = String(req.body.category || '').trim();
  const price = Number.parseFloat(String(req.body.price || '').replace(',', '.'));
  const stock = Number.parseInt(String(req.body.stock || ''), 10);

  if (!name || !description || !category || Number.isNaN(price) || Number.isNaN(stock)) {
    await removeLocalProductImage(req.file);

    if (req.accepts('html')) {
      return res.redirect('/seller-dashboard?error=Preencha todos os campos do produto.');
    }

    return res.status(400).json({ message: 'Name, description, category, price and stock are required' });
  }

  if (!isProductCategory(category)) {
    await removeLocalProductImage(req.file);

    if (req.accepts('html')) {
      return res.redirect('/seller-dashboard?error=Selecione uma categoria valida.');
    }

    return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    const storedImage = await storeProductImage(req.file);

    await prisma.product.create({
      data: {
        name,
        description,
        category,
        price,
        stock,
        imageUrl: storedImage?.imageUrl,
        imageStorage: storedImage?.imageStorage,
        userId: req.session.user!.id,
      }
    });
  } catch (error) {
    await removeLocalProductImage(req.file);
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
