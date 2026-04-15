// CARREGANDO AS VARIAVEIS DE AMBIENTE
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import session from 'express-session';
import prisma from './config/prisma';
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

app.get('/', async (req, res) => {
  const search = String(req.query.search || '').trim();

  const products = await prisma.product.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { category: { contains: search } },
          ],
        }
      : undefined,
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
    roleLabel,
  });
});

app.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect('/');

  res.render('signup', {
    error: getMessage(req, 'error'),
    values: {},
  });
});

app.post('/signup', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const cpf = String(req.body.cpf || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const confirmPassword = String(req.body.confirmPassword || '');
  const role = String(req.body.role || 'buyer');

  const values = { name, cpf, email, role };

  if (!name || !cpf || !email || !password || !confirmPassword || !role) {
    return res.status(400).render('signup', {
      error: 'Preencha todos os campos para criar sua conta.',
      values,
    });
  }

  if (!PUBLIC_SIGNUP_ROLES.includes(role)) {
    return res.status(400).render('signup', {
      error: 'Escolha comprador ou vendedor para criar sua conta.',
      values,
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).render('signup', {
      error: 'As senhas informadas nao conferem.',
      values,
    });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { cpf },
        { email },
      ],
    },
  });

  if (existingUser) {
    return res.status(400).render('signup', {
      error: 'Ja existe uma conta com este CPF ou email.',
      values,
    });
  }

  const user = await prisma.user.create({
    data: {
      name,
      cpf,
      email,
      password: hashPassword(password),
      role,
    },
  });

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
  });
});

import usersController from './controllers/UsersController';
app.use('/users', usersController);

import productsController from './controllers/ProductsController';
app.use('/products', productsController);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
