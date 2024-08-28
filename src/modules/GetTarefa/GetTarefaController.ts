import { Request, Response } from 'express';
import { GetTarefaUseCase } from './GetTarefaUseCase';

export class GetTarefaController {
    constructor(private GetUsuarioUseCase: GetTarefaUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const { cookie, etiqueta, usuario_id } = request.body;
        //console.log(cookie)
        //console.log(etiqueta)
        //console.log(usuario_id)
        try {
            const result = await this.GetUsuarioUseCase.execute({cookie, usuario_id, etiqueta});
            response.status(200).json(result);
        } catch (error) {
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}