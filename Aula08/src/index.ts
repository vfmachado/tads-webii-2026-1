// CARREGANDO AS VARIAVEIS DE AMBIENTE
import dotenv from 'dotenv';
dotenv.config();

import path from 'node:path';
import express, { Request, Response } from 'express';
import session from 'express-session';
import prisma from './config/prisma';
import { getUploadDriverLabel } from './config/upload';
import {
  findMatchingProductCategories,
  getProductCategoryLabel,
  isProductCategory,
  PRODUCT_CATEGORY_OPTIONS,
} from './constants/product-categories';
import { hashPassword, verifyPassword } from './utils/password';

declare module 'express-session' {
  interface SessionData {
    urls: string[];
    user?: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }
}

const app = express();
const port = process.env.PORT || 3333;

const PUBLIC_SIGNUP_ROLES = ['buyer', 'seller'];
const LOGIN_ROLES = ['buyer', 'seller', 'admin'];

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    buyer: 'Comprador',
    seller: 'Vendedor',
    admin: 'Administrador',
  };

  return labels[role] || role;
}

function redirectWithMessage(path: string, type: 'error' | 'success', message: string) {
  return `${path}?${type}=${encodeURIComponent(message)}`;
}

function getMessage(req: Request, name: 'error' | 'success') {
  const value = req.query[name];

  return typeof value === 'string' ? value : undefined;
}

function requireSeller(req: Request, res: Response, next: express.NextFunction) {
  const role = req.session.user?.role;

  if (!req.session.user || (role !== 'seller' && role !== 'admin')) {
    return res.redirect(redirectWithMessage('/login', 'error', 'Entre como vendedor para acessar o painel.'));
  }

  next();
}

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TUDO ESTÁTICO É SERVIDO PUBLICAMENTE
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'marketmvp-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: true // em prod
  }
}));

app.use((req, res, next) => {
  req.session.urls = req.session.urls || [];
  req.session.urls.push(req.url);
  res.locals.user = req.session.user;
  next();
});

// ALTERAR A ROTA PARA O PADRAO DO PROJETO
app.get('/', async (req, res) => {
  // localhost:3333/ ?search=celular
  const search = String(req.query.search || '').trim();
  const category = String(req.query.category || '').trim();
  const selectedCategory = isProductCategory(category) ? category : '';
  const matchingCategories = findMatchingProductCategories(search);

  const products = await prisma.product.findMany({
    where: {
      ...(selectedCategory
        ? {
            category: selectedCategory,
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
              { category: { contains: search } },
              ...(matchingCategories.length > 0
                ? [{ category: { in: matchingCategories } }]
                : []),
            ],
          }
        : {}),
    },
    include: {
      User: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.render('home', {
    products,
    search,
    selectedCategory,
    categoryOptions: PRODUCT_CATEGORY_OPTIONS,
    roleLabel,
    featuredCategories: PRODUCT_CATEGORY_OPTIONS.slice(0, 4),
    getProductCategoryLabel,
  });
});

app.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect('/');

  res.render('signup', {
    error: getMessage(req, 'error'),
    values: {},
  });
});

import * as z from 'zod';
const Signup = z.object({
  name: z.string().min(3, 'O nome é obrigatório. Minimo de 3 caracteres.').max(100, 'O nome deve ter no máximo 100 caracteres.'),
  cpf: z.string()
    .min(11, 'O CPF é obrigatório. Deve conter 11 caracteres.').max(11, 'O CPF deve conter 11 caraceres'),
  email: z.email('Email inválido.'),
  password: z.string().min(6, 'A senha é obrigatória. Minimo de 6 caracteres.').max(100, 'A senha deve ter no máximo 100 caracteres.'),
  confirmPassword: z.string().min(6, 'A confirmação de senha é obrigatória. Minimo de 6 caracteres.').max(100, 'A confirmação de senha deve ter no máximo 100 caracteres.'),
  role: z.enum(['buyer', 'seller'], 'Escolha comprador ou vendedor para criar sua conta.'),

}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas informadas nao conferem.'
});

// ZOD YUP JOI
app.post('/signup', async (req, res) => {
  
  const payload = req.body;
  const {success, data, error } = Signup.safeParse(payload);
  
  // melhorar
  if (!success) {
    console.log({ error})
    // const error = error.map((err) => err.message).join(' ');
    // return res.status(400).render('signup', {
    //   error,
    //   values: payload,
    // });
    return res.render('signup', {
      error: error.message,
      values: payload,
    });
  }
  
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { cpf: data.cpf },
        { email: data.email },
      ],
    },
  });

  if (existingUser) {
    return res.status(400).render('signup', {
      error: 'Ja existe uma conta com este CPF ou email.',
      // values,
    });
  }

  const { confirmPassword, ...userData } = data;
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashPassword(data.password),
    },
  });

  // quando o cadastro é feito, uma sessao já é gerada e nao preciso fazer o login
  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  if (user.role === 'seller') {
    return res.redirect('/seller-dashboard');
  }

  return res.redirect('/');
});

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');

  res.render('login', {
    error: getMessage(req, 'error'),
    values: {},
  });
});

// EXERCICIO - É AJUSTAR PARA O PADRAO MVC
app.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const role = String(req.body.role || 'buyer');
  const values = { email, role };

  if (!email || !password || !role) {
    return res.status(400).render('login', {
      error: 'Informe email, senha e tipo de conta.',
      values,
    });
  }

  if (!LOGIN_ROLES.includes(role)) {
    return res.status(400).render('login', {
      error: 'Tipo de conta invalido.',
      values,
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).render('login', {
      error: 'Email ou senha invalidos.',
      values,
    });
  }

  if (user.role !== role) {
    return res.status(401).render('login', {
      error: `Esta conta esta cadastrada como ${roleLabel(user.role)}.`,
      values,
    });
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  if (user.role === 'seller' || user.role === 'admin') {
    return res.redirect('/seller-dashboard');
  }

  return res.redirect('/');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/seller-dashboard', requireSeller, async (req, res) => {
  const products = await prisma.product.findMany({
    where: req.session.user!.role === 'admin'
      ? undefined
      : {
          userId: req.session.user!.id,
        },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.render('seller-dashboard', {
    products,
    error: getMessage(req, 'error'),
    success: getMessage(req, 'success'),
    uploadDriverLabel: getUploadDriverLabel(),
    categoryOptions: PRODUCT_CATEGORY_OPTIONS,
    getProductCategoryLabel,
  });
});

import usersController from './controllers/UsersController';
app.use('/users', usersController);

import productsController from './controllers/ProductsController';
app.use('/products', productsController);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
