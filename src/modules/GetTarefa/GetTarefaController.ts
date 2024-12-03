import { Request, Response } from 'express';
import { GetTarefaUseCase } from './GetTarefaUseCase';

export class GetTarefaController {
    constructor(private readonly getUsuarioUseCase: GetTarefaUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const { cookie, etiqueta, usuario_id } = request.body;
        try {
            const result = await this.getUsuarioUseCase.execute({cookie, usuario_id, etiqueta});
            response.status(200).json(result);
        } catch (error) {
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}