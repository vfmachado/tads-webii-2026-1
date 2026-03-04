# TypeScript + Express Overview

## TypeScript Basics

TypeScript is JavaScript with static typing.

### Common types

```ts
const name: string = 'Vinicius';
const age: number = 20;
const isActive: boolean = true;
const tags: string[] = ['api', 'express'];
```

### Interfaces

```ts
interface User {
  id: number;
  name: string;
  email?: string; // optional
}
```

### `interface` vs `type`

Both can describe object shapes, but they have different strengths.

Use `interface` when:

- you define object/class contracts
- you want declaration merging
- you want `implements` in classes with a clear contract

Use `type` when:

- you need unions/intersections
- you define aliases for primitives/tuples/functions
- you compose complex types

Examples:

```ts
interface Person {
  id: number;
  name: string;
}

interface Person {
  email?: string; // declaration merging (only interface)
}

type Status = 'active' | 'inactive'; // union (type alias)
type Point = [number, number]; // tuple
type PersonWithStatus = Person & { status: Status }; // intersection
```

### Class definition

Classes are blueprints for objects with properties, constructor, and methods.

```ts
interface Identifiable {
  id: number;
}

class Product implements Identifiable {
  constructor(
    public id: number,
    public name: string,
    private price: number
  ) {}

  getPrice(): number {
    return this.price;
  }

  setPrice(newPrice: number): void {
    if (newPrice <= 0) throw new Error('Price must be greater than 0');
    this.price = newPrice;
  }
}

const p = new Product(1, 'Notebook', 3500);
console.log(p.getPrice());
```

### Functions with types

```ts
function sum(a: number, b: number): number {
  return a + b;
}
```

## Express Core Concepts

### `Request` and `Response`

- `Request` (`req`): data sent by the client (params, query, body, headers).
- `Response` (`res`): what the server sends back (status, JSON, text).

Example:

```ts
import { Request, Response } from 'express';

function getHello(req: Request, res: Response): void {
  const name = req.query.name ?? 'world';
  res.status(200).json({ message: `Hello, ${name}` });
}
```

### Route methods (HTTP methods)

- `GET`: read data
- `POST`: create data
- `PUT`: replace data
- `PATCH`: update part of data
- `DELETE`: remove data

Example:

```ts
app.get('/users', handler);
app.post('/users', handler);
app.put('/users/:id', handler);
app.patch('/users/:id', handler);
app.delete('/users/:id', handler);
```

### Middleware

Middleware runs between request and response. It can:

- read/modify `req` and `res`
- validate/authenticate
- end the response
- call `next()` to continue

Example:

```ts
import { Request, Response, NextFunction } from 'express';

function logger(req: Request, _res: Response, next: NextFunction): void {
  console.log(`${req.method} ${req.path}`);
  next();
}

app.use(logger);
```

### Middleware order

Order matters. Express executes middleware/routes from top to bottom:

```ts
app.use(express.json()); // 1. parse JSON body
app.use(logger); // 2. custom logger
app.get('/health', (_req, res) => res.send('ok')); // 3. route
```

## Typed route example

```ts
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

type CreateUserBody = {
  name: string;
  email: string;
};

app.post(
  '/users',
  (req: Request<{}, {}, CreateUserBody>, res: Response) => {
    const { name, email } = req.body;
    res.status(201).json({ id: 1, name, email });
  }
);
```

## Quick tips

- Use `strict: true` in `tsconfig.json`.
- Validate incoming data (body/query/params).
- Use middleware for reusable logic (auth, logging, error handling).
- Keep route handlers small; move business logic to services.
