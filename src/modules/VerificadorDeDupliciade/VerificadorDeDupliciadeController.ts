import { Request, Response } from "express";
import { VerificadorDeDupliciadeUseCase } from "./VerificadorDeDupliciadeUseCase";
import { GetInformationsFromSapiensDTO } from "../GetInformationFromSapiensForPicaPau";

export class VerificadorDeDupliciadeController {
    constructor(private readonly atualizacaoDossiePrevidenciarioUseCase: VerificadorDeDupliciadeUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const data: GetInformationsFromSapiensDTO = request.body;
        try {
            const result = await this.atualizacaoDossiePrevidenciarioUseCase.execute(data);
            response.status(200).json(result);
        } catch (error) {
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}