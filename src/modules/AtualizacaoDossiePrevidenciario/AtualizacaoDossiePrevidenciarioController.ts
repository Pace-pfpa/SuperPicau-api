import { Request, Response } from "express";
import { AtualizacaoDossiePrevidenciarioUseCase } from "./AtualizacaoDossiePrevidenciarioUseCase";
import { GetInformationsFromSapiensDTO } from "../GetInformationFromSapiensForPicaPau";

export class AtualizacaoDossiePrevidenciarioController {
    constructor(private readonly atualizacaoDossiePrevidenciarioUseCase: AtualizacaoDossiePrevidenciarioUseCase,) { }
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