## AULA 03 - PADRAO MVC

# 1. Por quê?

Em aplicações pequenas é comum escrever tudo no mesmo arquivo.

Exemplo simples (anti-padrão):

```javascript
app.get("/users", async (req, res) => {
  const users = await db.query("SELECT * FROM users")

  let html = "<h1>Users</h1>"

  users.forEach(user => {
    html += `<p>${user.name}</p>`
  })

  res.send(html)
})
```

Problemas:

* Mistura **acesso a dados**
* **Lógica da aplicação**
* **Interface do usuário**

Isso gera:

* código difícil de manter
* baixa reutilização
* difícil de testar

Para resolver isso usamos **arquiteturas organizadas**, como **MVC**.



# 2. O que é MVC

MVC é um **padrão arquitetural** que separa responsabilidades em três camadas.

MVC significa:

| Camada     | Responsabilidade          |
| - | - |
| Model      | Dados e regras de negócio |
| View       | Interface com o usuário   |
| Controller | Intermedia Model e View   |



# 3. Estrutura conceitual

```
Usuário
   |
   v
Controller
   |
   v
Model
   |
   v
Banco de dados

Controller
   |
   v
View
   |
   v
Usuário
```

Fluxo:

1. Usuário faz requisição
2. Controller recebe a requisição
3. Controller consulta o Model
4. Model acessa dados
5. Controller envia dados para View
6. View gera resposta para o usuário



# 4. Responsabilidades de cada camada

## Model

Responsável por:

* acesso ao banco de dados
* regras de negócio
* validações
* representação de entidades

Exemplo:

```
User
Product
Order
Invoice
```

Exemplo em JavaScript:

```javascript
class UserModel {

  static async findAll(db) {
    return db.query("SELECT * FROM users")
  }

}
```



## View

Responsável por:

* apresentação
* interface
* renderização de dados

Exemplos:

* HTML
* React
* Templates (EJS, Handlebars)

Exemplo simples:

```html
<h1>Lista de Usuários</h1>

<ul>
  <% users.forEach(user => { %>
    <li><%= user.name %></li>
  <% }) %>
</ul>
```



## Controller

Responsável por:

* receber requisições HTTP
* chamar o Model
* escolher qual View retornar
* preparar os dados para a View

Exemplo:

```javascript
const UserModel = require("../models/UserModel")

class UserController {

  static async list(req, res) {

    const users = await UserModel.findAll()

    res.render("users", { users })

  }

}
```



# 5. Estrutura de pastas típica

Em projetos MVC a organização costuma ser:

```
project
│
├── controllers
│     UserController.js
│
├── models
│     UserModel.js
│
├── views
│     users.ejs
│
├── routes
│     userRoutes.js
│
├── app.js
```



# 6. Fluxo de uma requisição (passo a passo)

Exemplo:

```
GET /users
```

Fluxo:

```
Browser
   |
   v
Route
   |
   v
Controller
   |
   v
Model
   |
   v
Database
   |
   v
Controller
   |
   v
View
   |
   v
Browser
```



# 7. Exemplo prático (Node.js + Express)

## Estrutura

```
project
│
├── controllers
│     UserController.js
│
├── models
│     UserModel.js
│
├── routes
│     userRoutes.js
│
├── views
│     users.ejs
│
└── app.js
```



# Model

```javascript
class UserModel {

  static users = [
    { id: 1, name: "Ana" },
    { id: 2, name: "Carlos" }
  ]

  static findAll() {
    return this.users
  }

}

module.exports = UserModel
```



# Controller

```javascript
const UserModel = require("../models/UserModel")

class UserController {

  static list(req, res) {

    const users = UserModel.findAll()

    res.render("users", { users })

  }

}

module.exports = UserController
```



# Routes

```javascript
const express = require("express")
const router = express.Router()

const UserController = require("../controllers/UserController")

router.get("/users", UserController.list)

module.exports = router
```



# View (EJS)

```html
<h1>Users</h1>

<ul>
  <% users.forEach(user => { %>
    <li><%= user.name %></li>
  <% }) %>
</ul>
```



# app.js

```javascript
const express = require("express")
const app = express()

const userRoutes = require("./routes/userRoutes")

app.set("view engine", "ejs")

app.use(userRoutes)

app.listen(3000, () => {
  console.log("Server running")
})
```



# 8. Benefícios do MVC

## Separação de responsabilidades

Cada camada tem um papel claro.



## Manutenção mais fácil

Alterar a interface não afeta o Model.



## Código mais organizado

Projetos grandes precisam de organização.



## Testabilidade

É possível testar:

* Models isoladamente
* Controllers isoladamente



# 9. Desvantagens

* Pode ser **exagero para projetos muito pequenos**
* Exige **disciplina na organização**
* Pode gerar **muitos arquivos**



# 10. MVC em frameworks conhecidos

| Tecnologia    | Implementação MVC     |
| Spring Boot   | MVC clássico          |
| Ruby on Rails | MVC                   |
| Django        | MTV (variação do MVC) |
| ASP.NET       | MVC                   |
| Laravel       | MVC                   |
| Express       | MVC manual            |

