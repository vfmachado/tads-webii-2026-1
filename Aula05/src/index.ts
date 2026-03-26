// CARREGANDO AS VARIAVEIS DE AMBIENTE
import dotenv from 'dotenv';
dotenv.config();

// ESSE CONSOLE NAO DEVERIA ESTAR AQUI - OS LOGS DA APLICACAO EM PRODUCAO DEVEM SER ACESSIVEL PELO TIME DE DESENVOLVIMENTO, LOGO NAO PODEMOS LOGAR DADOS SENSIVEIS (ENV)
if (process.env.STAGE == 'dev')
  console.log({ env: process.env})

// if (process.env.STAGE == 'prod') {
//   console.log = () => {};
// }

import express from 'express';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    urls: []
    // userId: string; // Add your custom properties here
    // views: number;
    // // You can also add complex objects or types
    user?: {
      name: string;
      role: string;
    };
  }
}

import * as PersonController from './controllers/PersonController';
import { isAdmin } from './middleware/isAdmin';

const app = express();
const port = process.env.PORT || 3333;
 
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.urlencoded({ extended: true }));

// middleware de sessoes
app.use(session({
  secret: process.env.SESSION_SECRET!,    // ! nao nulo/undefined
  saveUninitialized: true,
  cookie: {
    // secure: true // em prod
  }
}))


app.use((req, res, next) => {

  req.session.urls = req.session.urls || [];
  (req.session.urls as any).push(req.url);

  console.log({
    id_sessao: req.sessionID,
    sessao: req.session
  })
  next();
})


app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/')
  
  res.render('login');
})

app.post('/login', (req, res) => {
  const { nome, password } = req.body;
  // validar esse nome e logar ESTE USUARIO
  // consulta no banco, valida a senha com bcrypt
  // https://www.npmjs.com/package/bcryptjs
  if (password == "ADMIN") {
    req.session.user = { 
      name: nome,
      role: 'admin'
    }

    return res.send("LOGIN COM SUCESSO")
  }

  return res.send("LOGIN INVALIDO")

})

app.get('/', PersonController.index);
app.post('/people', isAdmin, /*middlewareLog, sendNotification, accessWarning, temRole(['manager', 'admin']) */ PersonController.create);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
