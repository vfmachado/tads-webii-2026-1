# Trabalho III - Backend do Sistema de Controle Financeiro Pessoal

## ENTREGA

## DATA ENTREGA 03/07/2026 AS 23H59


- VIDEO DE APROXIMADAMENTE 10-15 MINUTOS EXPLICANDO A ARQUITETURA, AS DECISOES DE IMPLEMENTACAO (PRINCIPALMENTE USE-CASES E DOMAIN)
- A EXECUCAO DOS TESTES 
- CODIGO-FONTE NO GITHUB

## Overview das aulas 09, 10, 11 e 12

As ultimas aulas prepararam exatamente a base tecnica deste trabalho:

### Aula 09 - Introducao a DDD no backend

- separacao entre `domain`, `application` e `infrastructure`;
- repositorios para isolar persistencia;
- autenticacao e autorizacao no backend;
- organizacao inicial para crescer o projeto sem misturar regra de negocio com detalhes de framework.

### Aula 10 - Casos de uso e inversao de dependencia

- criacao de `use cases`;
- contratos de repositorio;
- normalizacao de dados no dominio;
- primeiros testes unitarios guiando a implementacao.

### Aula 11 - API estruturada e composicao da aplicacao

- `app`, `routes`, `container` e `server` separados;
- controllers mais finos;
- injecao de dependencias;
- testes mais proximos da camada HTTP.

### Aula 12 - Consolidacao do fluxo completo

- ampliacao dos casos de uso;
- continuidade da arquitetura da Aula 11;
- mais cobertura automatizada;
- preparacao para integrar consumidores externos da API.

Este trabalho deve aproveitar essa evolucao. O foco nao e interface, e sim um backend bem organizado, testavel e coerente com a arquitetura trabalhada em aula.

## Contexto

O sistema a ser desenvolvido e um **backend para controle financeiro pessoal**.

Cada usuario deve conseguir:

- criar conta e autenticar-se;
- cadastrar categorias financeiras;
- registrar receitas e despesas;
- filtrar lancamentos;
- consultar saldo mensal;
- consultar relatorio por categoria;
- marcar despesas como pagas.

## Escopo

Este trabalho consiste **apenas na implementacao do backend**.

Nao sera avaliado frontend, template, React, EJS ou qualquer camada visual.

## Objetivo Geral

Construir uma API em Node.js + TypeScript organizada em camadas, com regras de negocio implementadas no backend e cobertura automatizada suficiente para demonstrar o funcionamento do sistema.

## Requisitos Obrigatorios

### 1. Autenticacao

- implementar cadastro de usuario;
- implementar login por email e senha;
- nao permitir email duplicado;
- armazenar senha de forma segura;
- proteger rotas autenticadas.

### 2. Categorias financeiras

- cada usuario deve poder cadastrar suas proprias categorias;
- a API deve permitir criar e listar categorias;
- categorias devem poder ser usadas nos lancamentos;
- nao permitir categorias duplicadas para o mesmo usuario quando fizer sentido pela regra definida pelo grupo.

### 3. Lancamentos financeiros

Implementar cadastro de lancamentos com no minimo:

- tipo: `income` ou `expense`;
- descricao;
- valor;
- data do lancamento;
- categoria;
- usuario dono do lancamento.

Regras minimas:

- despesa nao pode ter valor negativo;
- receita nao pode ter valor negativo;
- lancamentos devem pertencer a um usuario autenticado;
- um usuario nao pode criar lancamento em nome de outro;
- um usuario nao pode visualizar lancamentos de outro.

### 4. Filtros

Implementar listagem de lancamentos com filtros por:

- mes;
- ano;
- categoria.

Os filtros devem ser processados no backend.

### 5. Relatorios calculados no backend

Implementar no minimo:

- saldo mensal;
- relatorio por categoria.

Os calculos devem acontecer no backend, nao apenas na camada de banco e nem em frontend externo.

### 6. Despesa paga ou pendente

- despesas devem possuir estado coerente com a regra definida pelo grupo;
- deve existir rota para marcar despesa como paga;
- a alteracao deve respeitar a autoria do usuario autenticado.

### 7. Testes automatizados

O projeto deve possuir:

- testes unitarios para dominio e casos de uso;
- testes de integracao para as rotas principais;
- comando unico para executar a suite.

## Arquitetura minima esperada

O projeto deve seguir, no minimo, uma estrutura inspirada nas Aulas 10, 11 e 12:

```text
src/
  main/
  modules/
    auth/
    categories/
    transactions/
    reports/
  shared/
tests/
  unit/
  integration/
```

Camadas esperadas:

- `domain`: entidades e contratos;
- `application`: casos de uso e erros de negocio;
- `infrastructure`: implementacoes concretas de repositorios ou servicos;
- `interfaces/http`: controllers e adaptacao HTTP;
- `main`: composicao da aplicacao.

## Pasta-base disponibilizada

Foi adicionada ao repositorio a pasta:

`Trabalhos/trabalho-iii-backend-base/`

Ela contem:

- estrutura inicial do backend;
- arquivos principais de configuracao;
- rotas e controllers-base;
- casos de uso e repositorios em formato de esqueleto;
- testes unitarios e de integracao como guia de implementacao.

Importante:

- os testes fornecidos **nao passam inicialmente**;
- eles foram deixados como especificacao executavel para orientar o desenvolvimento;
- a implementacao final do grupo deve fazer essa suite passar.

## Entregaveis

- codigo-fonte completo do backend;
- `README.md` com instrucoes de instalacao, execucao e teste;
- video mostrando:
  - visao geral da arquitetura;
  - principais regras de negocio;
  - execucao dos testes automatizados;
  - demonstracao das rotas principais.

## Criterios de avaliacao

- (4,0) clareza tecnica da explicacao em video;
- (6,0) funcionamento comprovado pela execucao dos testes e pela coerencia da implementacao.

## Observacoes

- voces podem adaptar os nomes de modulos, entidades e detalhes internos, desde que mantenha o escopo funcional;
- e permitido usar persistencia em memoria, SQLite, Prisma ou outra estrategia compativel com a disciplina, desde que a organizacao arquitetural fique clara;
- a suite fornecida pode ser expandida pelo grupo, mas os testes-base devem continuar fazendo sentido;
- idealmente os testes bases NAO devem ser alterados;
- o foco principal da avaliacao sera backend, regras de negocio e capacidade de explicar a solucao.
