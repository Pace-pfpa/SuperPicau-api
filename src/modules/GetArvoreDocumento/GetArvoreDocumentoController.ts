import { Request, Response } from "express";
import { GetArvoreDocumentoUseCase } from "./GetArvoreDocumentoUseCase";
import { GetArvoreDocumentoDTO } from ".";

export class GetArvoreDocumentoController {
    constructor(private readonly requestInformationForSamir: GetArvoreDocumentoUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const data: GetArvoreDocumentoDTO = request.body;
        try {
            const result = await this.requestInformationForSamir.execute(data);
            response.status(200).json(result);
        } catch (error) {
            console.error("Arvore de documento não foi recebida: ");
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}
