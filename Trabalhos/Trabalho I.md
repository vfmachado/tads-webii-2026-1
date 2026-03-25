# Trabalho I - Sistema de Usuarios (Template 1)

## ENTREGA

VIDEO DE APROXIMADAMENTE 15 MINUTOS PASSANDO PELAS FUNCIONALIDADES (5) & CODIGO (10) + CODIGO-FONTE NO GITHUB
DATA 08/04/2026

## Contexto

Neste trabalho, a turma deve utilizar o **Template 1** (pasta `Template-T1/`) como base visual para desenvolver uma aplicacao web com autenticacao e controle de acesso por tipo de usuario.

O foco da atividade e implementar o fluxo completo de:

- criacao de conta;
- login;
- separacao de permissoes por perfil;
- administracao de usuarios por um perfil administrador.

## Objetivo Geral

Construir uma aplicacao funcional em que cada usuario tenha um perfil (admin, comprador ou vendedor), com interfaces e acoes adequadas ao seu nivel de acesso.

## Requisitos Obrigatorios

### 1. Criacao de conta

- Implementar tela/formulario de cadastro de novos usuarios.
- Campos minimos sugeridos: nome, email, senha e tipo de usuario.
- Nao permitir cadastro com email duplicado.
- A senha deve ser armazenada de forma segura (hash).

### 2. Login

- Implementar autenticacao por email e senha.
- Criar sessao/autenticacao (ex.: cookie de sessao ou JWT).
- Garantir que rotas protegidas exijam usuario autenticado.

### 3. Tipos de usuario

Cada conta deve possuir exatamente um dos seguintes perfis:

- **Admin**
- **Comprador**
- **Vendedor**

O sistema deve restringir acessos conforme o perfil. Exemplo:

- paginas administrativas acessiveis apenas por admin;
- funcionalidades especificas de vendedor restritas ao vendedor;
- funcionalidades de comprador restritas ao comprador.

### 4. Gestao de usuarios (apenas admin)

Ao logar como **admin**, o sistema deve disponibilizar uma area de gerenciamento de usuarios contendo:

- listagem de usuarios cadastrados;
- visualizacao do tipo de cada usuario;
- acao para **desativar perfil** de usuarios.

Regras para desativacao:

- usuario desativado nao pode realizar login;
- status do usuario deve ficar claro na listagem (ativo/inativo);
- a acao de desativar deve exigir permissao de admin.

### 5. Validacao de e-mail por senha unica

- Ao criar conta, o usuario deve receber uma **senha/codigo unico de validacao** por e-mail.
- A conta so pode ser considerada ativa para login apos validacao do e-mail.
- Implementar tela/rota para informar o codigo recebido.
- O codigo deve ter validade limitada (ex.: 15 a 30 minutos).
- Caso o codigo expire, deve existir opcao de reenvio.

### 6. Auditoria de logs de acoes

- Toda acao da aplicacao que **nao seja GET** deve ser registrada em uma tabela de logs.
- A tabela de logs deve armazenar no minimo:
	- data/hora da acao;
	- usuario responsavel (quando autenticado);
	- metodo HTTP (POST, PUT, PATCH, DELETE etc.);
	- rota/endpoint acessado;
	- resumo da acao executada.
- A gravacao do log deve ocorrer mesmo em caso de erro de negocio (quando a requisicao foi tentada).
- A leitura dos logs deve ser restrita ao perfil admin.

## Requisitos Tecnicos Minimos

- Utilizar o Template 1 como base de interface.
- Organizar o codigo em camadas (rotas, controladores, servicos/modelos), quando aplicavel.
- Validar dados de entrada no backend.
- Tratar mensagens de erro e sucesso de forma clara para o usuario.
- Garantir trilha de auditoria para operacoes nao-GET.

## Entregaveis

- Codigo-fonte completo do projeto.
- Arquivo `README.md` com:
	- instrucoes de instalacao e execucao;
	- usuarios de teste (incluindo admin);
	- descricao resumida das funcionalidades implementadas.

## Criterios de Avaliacao

- (2,0) funcionamento correto de cadastro e login;
- (2,0) auditoria de logs de acoes;
- (2,0) implementacao correta de validacao de e-mail por senha unica;
- (1,0) aplicacao correta de controle de acesso por perfil;
- (1,0) listagem e funcionamento da desativacao de usuarios pelo admin;
- (1,0) qualidade da organizacao do codigo;
- (1,0) usabilidade e integracao com o template fornecido.

## Observacoes

- E permitido evoluir layout e componentes do template, desde que a identidade base seja mantida.

