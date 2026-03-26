## AULA 05

MIDDLEWARE - FUNCIONALIDADE QUE ESTA ENTRE / MEIO
    ENTRE O REQUEST E CONTROLLER
                    ^

    EX: LOG DE REQUESTS
        VERIFICAR AUTENTICACAO
        VERIFICAR AUTORIZACAO
    
npm i express-session
npm i --save-dev @types/express-session
    
### ENV
O QUE VAI PARA O ENV?
    TUDO QUE NAO PODE VAZAR / SENSIVEL / VARIA DE DEPLOY (DEV-PROD)
        EX: CONEXAO COM BANCO, SEGREDOS DE SESSOES,
            URL DE API EXTERNA OU AMBIENTE

    npm i dotenv

    o arquiov .env.example é normalmente comitado e contem exemplo do que são as variaveis de ambiente.

    .env é o arquivo que é carregado durante a fase deploy e existe somente / idealmente nessa fase
        localmente utilizamso para apontar para o ambiente de desenvolvimento (localhost)

AUTENTICACAO
    - USUARIO E SENHA / TOKEN "BATE"
    - SERVE PARA O SISTEMA SABER QUEM EU SOU

    ?? PERGUNTA ?? COMO MANTER NO FRONTEND OU NO SERVIDOR A INFORMACAO DE QUE O USUARIO ESTA LOGADO E É "AQUELE" USUARIO QUE LOGOU
        - TOKEN - ENVIO UM TOKEN PRO USUARIO E TODA REQUISICAO O USUARIO ENVIA npm i --save-dev @types/express-sessionJUNTO O TOKEN  JWT
            JSON WEB TOKEN  É UM TOKEN QUE TEM OS DADOS PUBLICOS E ASSINATURA BASEADA EM UMA "SENHA" DO SERVIDOR.

            DESVANTAGEM DE USAR TOKEN?
                - PODE SER ROUBADO
                - DADOS PUBLICOS
            
            VANTAGEM
                - FACILIDADE
                - DIMINUIR CARGA NO SERVIDOR

        - SESSOES - GUARDANDO A INFORMACAO TODA DO LADO DO SERVIDOR. 
            VANTAGEM:
                - NAO TENHO DADOS PUBLICOS
                - +seguro / cookies e https

            DESVANTAGEM
                - CARGA MAIOR DE USO NO SERVIDOR / REDIS


AUTORIZACAO
    PODE ACESSAR DETERMINADO RECURSO OU FAZER DETERMINADA OPERACAO.
    NORMALMENTE ASSOCIADO A UM ROLE ESPECIFICO

    pode acontecer por GRUPO DE USUARIOS
    pode ser por RECURSO

    SERVICOS COMO AWS DEFINEM POR RECURSO, GRUPO, ID DO RECURSO, e também permitem um DENY EXPLICITO

    sistemas robustos tem premissa de DENY EVERYTHING
     E EXPLICITAMENTE SETAR QUAIS RECURSOS QUEM TEM ACESSO


EXERCICIO
- LEVANTAR UM REDIS / BANCO QUALQUER E CONECTAR COM O SESSION STORAGE


LINKS
https://www.youtube.com/@YuriRDev
ESCALIDADE HORIZONTAL X VERTICAL

SISTEMAS DE AUTENTICACAO EXTERNOS
https://clerk.com/
https://auth0.com/

BAZUCA  (muito grandehttps://www.osohq.com/learn/best-authorization-tools-and-software)
Keycloak


https://www.osohq.com/learn/best-authorization-tools-and-software


