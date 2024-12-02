import { Request, Response } from 'express';
import { UpdateEtiquetaUseCase } from './UpdateEtiquetaUseCase';
import { IUpdateEtiquetaDTO } from './dtos/UpdateEtiquetaDTO';

export class UpdateEtiquetaController {
    constructor(private readonly updateEtiquetaUseCase: UpdateEtiquetaUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const data: IUpdateEtiquetaDTO = request.body;
        try {
            const result = await this.updateEtiquetaUseCase.execute(data);
            response.status(200).json(result);
        } catch (error) {
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}