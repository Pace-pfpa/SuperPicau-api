import { Request, Response } from 'express';
import { LoginUseCase } from './LoginUseCase';

export class LoginController {
    constructor(private readonly loginUseCase: LoginUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const { cpf, senha } = request.body;
        try {
            const resultadoLogin = await this.loginUseCase.execute({ cpf, senha });
            if (resultadoLogin.startsWith("Erro:")) {
                console.warn(`[LoginController] Falha no login: ${resultadoLogin}`);
                return response.status(401).json({ message: resultadoLogin });
            }

            return response.status(200).json(resultadoLogin);
        } catch (error) {
            return response.status(500).json({
                message: error.message || "Erro interno no servidor."
            });
        }
    }
}
