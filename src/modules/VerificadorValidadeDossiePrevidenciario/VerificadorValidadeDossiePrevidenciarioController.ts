import { Request, Response } from 'express';
import { VerificadorValidadeDossiePrevidenciarioUseCase } from './VerificadorValidadeDossiePrevidenciarioUseCase';
import { GetInformationsFromSapiensDTO } from '../GetInformationFromSapiensForPicaPau';

export class VerificadorValidadeDossiePrevidenciarioController {
    constructor(private readonly verificadorValidadeDossiePrevidenciarioUseCase: VerificadorValidadeDossiePrevidenciarioUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const data: GetInformationsFromSapiensDTO = request.body;
        try {
            const result = await this.verificadorValidadeDossiePrevidenciarioUseCase.execute(data);
            response.status(200).json(result);
        } catch (error) {
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}
