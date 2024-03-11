import { Request, Response } from 'express';
import { LoginUseCase } from './LoginUseCase';

export class LoginController {
    constructor(private loginUseCase: LoginUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const { cpf, senha } = request.body;
        try {
            let cookie = await this.loginUseCase.execute({ cpf, senha });
            //const incorrectUser = cookie == "Acesso negado, verifique se o CPF e a senha est�o corretos!"
            //console.log("LoginController: ", cookie)
            const incorrectUser = cookie == "Acesso negado"
            const incorrectUser2 = cookie == "Erro Login"
            if(incorrectUser || incorrectUser2){
                response.status(401).json(cookie);
                
            }else{
                response.status(200).json(cookie);
                               
            }
        } catch (error) {
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}