ORMs

- Definição - O que é um ORM?
    Um ORM é uma camada de abstração que permite manipular dados de um banco relacional utilizando objetos e estruturas da própria linguagem.

    ORM -> Object-Relational Mapping (Mapeamento Objeto-Relacional)

    SQL PURO
        SELECT -> select * from people p where p.name like '%vini%';
        INSERT em uma tabela com 20 parametros

        INSERT INTO people (name, age, city, state, country, email, phone, occupation, salary, company, department, position, start_date, end_date, status, notes) values (?, ?, ?,  ...)
    
        TABELA DE AMIZADE QUE RELACIONA DUAS PESSOAS E QUERO SABER QUEM SAO OS AMIGOS DOS MEUS AMIGOS -> JOIN / MULTIPLOS SELECTS

    O objetivo de utilizar ORMs é facilitar o nosso trabalho, delegando a responsabilidade de criação de queries repetitivas, joins, etc..

    - VANTAGENS
        - produtividade - fugir de SQLs grandes para coisas que são comumemente conhecidas.
        - abstração - o desenvolvedor não precisa conhecer detalhes do banco de dados, como sintaxe SQL, para manipular os dados.
        - portabilidade - "trocar" de banco / engine com muito mais facilidade. um dev consegue desenvolver para "qualquer" banco.
        - testabilidade - é possível criar testes unitários utilizando os objetos do ORM, sem a necessidade de um banco de dados real.
        - manutenção - o código fica mais organizado e fácil de manter, pois as operações de banco de dados estão encapsuladas em classes e métodos.
        - escalabilidade - ORMs geralmente possuem mecanismos de cache e otimização de consultas, o que pode melhorar o desempenho em aplicações de grande escala. !!! CUIDADO - nem sempre isso é verdade, depende muito do ORM e da forma como ele é utilizado.


    - DESVANTAGENS
        - desempenho - ORMs podem gerar consultas SQL ineficientes, especialmente em casos de consultas complexas ou grandes volumes de dados.
        - CPU / processamento elevados - o processo de mapeamento objeto-relacional pode consumir mais recursos do que consultas SQL otimizadas, especialmente em casos de consultas complexas ou grandes volumes de dados.


- ORMs NO DESENVOLVIMENTO WEB COM NODEJS / TYPESCRIPT

    - SEQUELIZE  
        - é um ORM para Node.js que suporta vários bancos de dados relacionais, como MySQL, PostgreSQL, SQLite e MSSQL.
        - oferece uma API fácil de usar para definir modelos, realizar consultas e gerenciar relacionamentos entre tabelas.
        - suporta migrações de banco de dados, o que facilita a evolução do esquema do banco ao longo do tempo.

    - TYPEORM
        - é um ORM para TypeScript e JavaScript que suporta vários bancos de dados relacionais, como MySQL, PostgreSQL, SQLite e MSSQL.
        - oferece uma API fácil de usar para definir modelos, realizar consultas e gerenciar relacionamentos entre tabelas.
        - suporta migrações de banco de dados, o que facilita a evolução do esquema do banco ao longo do tempo.
        - possui uma integração nativa com o TypeScript, o que pode melhorar a experiência de desenvolvimento e a segurança do tipo.

    - PRISMA
        - é um ORM para Node.js e TypeScript que suporta vários bancos de dados relacionais, como MySQL, PostgreSQL, SQLite e MSSQL.
        - oferece uma API fácil de usar para definir modelos, realizar consultas e gerenciar relacionamentos entre tabelas.
        - suporta migrações de banco de dados, o que facilita a evolução do esquema do banco ao longo do tempo.
        - possui uma abordagem de geração de código, onde os modelos são gerados a partir do esquema do banco de dados, o que pode melhorar a experiência de desenvolvimento e a segurança do tipo.


- INSTALACAO PRISMA

* por motivos de compatibilidade com as versoes do IFRS, vamos utilizar o prisma 5.9.1

npm i --dev prisma@5.9.1
npm i @prisma/client@5.9.1

npx prisma init

No arquivo schema.prisma definimos o nosso modelo de banco, tabelas, relacoes, etc..

A cada modificação precisamos executar uma "MIGRATION"

- MIGRATION - é um processo que permite evoluir o esquema do banco de dados ao longo do tempo, sem perder os dados existentes. Ele gera um arquivo de migração que contém as instruções para criar ou modificar as tabelas, colunas, índices, etc.. no banco de dados.

npx prisma migrate dev   (vamos criar um script para isso)


EXERCICIO PRATICO
    TRANSFOMAR O CODIGO DO TRABALHO PARA UTILIZAR ORM
    TESTAR POSSIBILIDADES COM RELACIONAMENTOS E TAMBÉM AUTO RELACIONAMENTO


