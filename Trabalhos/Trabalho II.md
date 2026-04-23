# Trabalho II - Evolucao do Marketplace

## ENTREGA

VIDEO DE APROXIMADAMENTE 15 MINUTOS PASSANDO PELAS FUNCIONALIDADES (5) & CODIGO (10) + CODIGO-FONTE NO GITHUB
DATA A DEFINIR EM AULA

## Contexto

Neste trabalho, a turma deve **estender o projeto desenvolvido a partir do Trabalho I, Aula 07 e Aula 08**.

A base ja possui autenticacao, separacao por perfis, painel do vendedor e cadastro de produtos com upload de imagem. Agora o objetivo e evoluir a aplicacao para um marketplace mais completo, com:

- perfil do comprador com informacoes adicionais;
- perfil do vendedor com informacoes mais detalhadas;
- suporte a multiplas fotos por produto;
- pagina de detalhes do produto mais rica;
- sistema de comentarios com curtidas e foto opcional.

## Objetivo Geral

Construir uma nova etapa da aplicacao em que compradores e vendedores possuam perfis mais completos e em que os produtos possam receber interacoes dos usuarios por meio de comentarios e curtidas.

## Requisitos Obrigatorios

### 1. Base obrigatoria

- O projeto deve partir da base funcional do Trabalho I e do material evoluido na Aula 08.
- O sistema deve continuar possuindo autenticacao e controle de acesso por perfil.
- Os perfis existentes continuam sendo:
  - **Admin**
  - **Comprador**
  - **Vendedor**

### 2. Perfil do comprador

Cada usuario com perfil **comprador** deve possuir uma area para visualizar e editar seus dados.

Campos minimos obrigatorios:

- telefone;
- endereco completo;
- cidade;
- estado;
- CEP;
- pelo menos uma forma de pagamento preferencial cadastrada.

Regras:

- o comprador deve conseguir editar seus proprios dados;
- outro usuario nao pode editar o perfil de comprador de terceiros;
- os dados devem ser validados no backend;
- o perfil deve ficar acessivel em uma pagina especifica do sistema.

### 3. Perfil do vendedor

Cada usuario com perfil **vendedor** deve possuir uma area com informacoes publicas e administrativas mais completas.

Campos minimos obrigatorios:

- nome da loja ou nome de exibicao;
- descricao da loja/vendedor;
- telefone ou contato comercial;
- cidade e estado;
- informacao de categorias ou tipos de produto com que trabalha.

Regras:

- o vendedor deve conseguir editar seus proprios dados;
- o perfil publico do vendedor deve poder ser exibido para outros usuarios;
- os produtos cadastrados devem estar associados ao vendedor responsavel;
- o sistema deve deixar claro, na interface, quem esta vendendo cada produto.

### 4. Tela de detalhes do produto

Cada produto deve possuir uma pagina de detalhes mais completa do que a listagem.

A pagina deve exibir no minimo:

- nome do produto;
- descricao;
- categoria;
- preco;
- estoque;
- imagem principal;
- galeria com multiplas fotos do produto;
- informacoes do vendedor;
- area de comentarios;
- total de curtidas recebidas nos comentarios do produto.

Regras minimas para fotos do produto:

- cada produto deve permitir o cadastro de mais de uma foto;
- uma das fotos pode ser definida como principal, ou o sistema pode assumir a primeira como destaque;
- as fotos devem aparecer na tela de detalhes do produto;
- o backend deve validar os arquivos enviados.

### 5. Sistema de comentarios

Implementar um sistema de comentarios vinculado aos produtos.

Regras minimas:

- somente usuarios autenticados podem comentar;
- cada comentario deve ficar associado ao autor e ao produto;
- cada comentario deve registrar data e hora;
- cada comentario pode ter uma foto opcional anexada;
- o autor do comentario deve conseguir editar ou excluir o proprio comentario;
- admin pode remover comentarios inadequados;
- comentarios devem aparecer ordenados, deixando claro autor e data.

### 6. Sistema de curtidas nos comentarios

Cada comentario deve poder receber curtidas de usuarios autenticados.

Regras minimas:

- um mesmo usuario pode curtir um comentario no maximo uma vez;
- o usuario deve poder remover sua curtida;
- a quantidade de curtidas deve ser exibida em cada comentario;
- nao pode haver contagem duplicada para o mesmo usuario e comentario;
- a regra deve ser garantida no backend e, se possivel, tambem no banco.

### 7. Controle de acesso e regras de negocio

O sistema deve respeitar as permissoes dos perfis.

Exemplos esperados:

- comprador pode editar apenas seu proprio perfil;
- vendedor pode editar apenas seu proprio perfil e seus proprios anuncios;
- usuario autenticado pode comentar e curtir;
- admin pode moderar comentarios;
- usuarios nao autenticados podem visualizar produtos, mas nao comentar nem curtir.

## Requisitos Tecnicos Minimos

- Utilizar a aplicacao existente como base, sem remover funcionalidades ja implementadas.
- Persistir os novos dados em banco de dados.
- Organizar o codigo em camadas (rotas, controladores, servicos/modelos), quando aplicavel.
- Validar dados recebidos no backend.
- Tratar mensagens de erro e sucesso de forma clara.
- Manter coerencia visual com o template/interface ja utilizada no projeto.

## Entregaveis

- Codigo-fonte completo do projeto.
- Arquivo `README.md` com:
  - instrucoes de instalacao e execucao;
  - usuarios de teste por perfil;
  - descricao das funcionalidades implementadas;
  - observacoes sobre as regras de comentario e curtida.

## Criterios de Avaliacao

- (1,0) implementacao correta do perfil do comprador;
- (1,0) implementacao correta do perfil do vendedor;
- (2,0) sistema de comentarios funcional;
- (2,0) sistema de curtidas funcional e sem duplicidade;
- (1,0) suporte a multiplas fotos nos produtos;
- (0,5) suporte a fotos nos comentarios;
- (1,0) tela de detalhes do produto bem integrada ao fluxo;
- (0,5) controle de acesso e permissoes;
- (0,5) qualidade da organizacao do codigo;
- (0,5) usabilidade e integracao com a interface existente.

## Observacoes

- E permitido evoluir layout e componentes do template, desde que a identidade base seja mantida.
- E permitido adicionar campos extras aos perfis, desde que os campos minimos obrigatorios estejam presentes.
- Nao e obrigatorio integrar gateway de pagamento real neste trabalho.
- Caso o grupo queira avancar alem do escopo, pode incluir melhorias extras, mas os itens obrigatorios continuam sendo o foco principal da avaliacao.
