# Aula 12

Esta aula esta dividida em duas partes:

`backend`
API em Node.js com TypeScript e Express.

`frontend`
Aplicacao React com TypeScript e Vite.

## Estrutura basica

```text
Aula12/
  backend/
    src/
    tests/
    package.json
  frontend/
    src/
    tests/
    package.json
  README.md
```

## O que cada parte faz

### Backend

O backend replica a estrutura da Aula11.

Principais pontos:

`src/main`
Inicializacao do servidor, rotas e injecao de dependencias.

`src/modules/users`
Modulo de usuarios com entidade, repositorio, caso de uso e controller.

`tests`
Testes unitarios do dominio, caso de uso e controller.

### Frontend

O frontend possui um formulario para criar usuarios e uma busca por email usando as rotas:

`POST /users`
`GET /users/search?email=...`

Durante o desenvolvimento, o Vite encaminha as chamadas `/api/users` para o backend.

### Testes E2E

O frontend tambem possui um teste E2E com Playwright.

Esse teste abre a tela, cria um usuario e valida a busca por email.

## Requisitos

Voce precisa ter instalado:

`Node.js`

`npm`

## Como executar o backend

Entre na pasta:

```bash
cd Aula12/backend
```

Instale as dependencias:

```bash
npm install
```

Rode em modo de desenvolvimento:

```bash
npm run dev
```

Servidor padrao:

```text
http://localhost:3000
```

Rota de teste:

```text
GET /health
POST /users
GET /users/search?email=ada@example.com
```

## Como executar o frontend

Em outro terminal, entre na pasta:

```bash
cd Aula12/frontend
```

Instale as dependencias:

```bash
npm install
```

Rode em modo de desenvolvimento:

```bash
npm run dev
```

Endereco padrao:

```text
http://127.0.0.1:5173
```

## Como executar os testes

### Testes do backend

```bash
cd Aula12/backend
npm test
```

### Build do backend

```bash
cd Aula12/backend
npm run build
```

### Build do frontend

```bash
cd Aula12/frontend
npm run build
```

### Testes E2E com Playwright

```bash
cd Aula12/frontend
npm run test:e2e
```

Se for a primeira execucao do Playwright, talvez seja necessario instalar o navegador:

```bash
npx playwright install chromium
```

## Fluxo sugerido para aula

1. Inicie o backend.
2. Inicie o frontend.
3. Abra a interface no navegador.
4. Cadastre um usuario.
5. Rode os testes do backend.
6. Rode o teste E2E do frontend.
