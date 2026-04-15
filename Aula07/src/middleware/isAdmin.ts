import { NextFunction, Response, Request } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    
    if (req.session.user?.role != 'admin')
        return res.send("precisa ser admin e estar logado pra cadastrar")

    // a regra é que...
    
    // tem que ter permissao de acordo com uma tabela banco
    // consulta no banco a tabela e verifica a permissao

    // 

    next();
}   
