import { Request, Response } from "express";
import { ErroGetArvoreDocumentoUseCase } from "./GetArvoreDocumentoUseCase";
import { GetArvoreDocumentoDTO } from "../GetArvoreDocumento";

export class ErroGetArvoreDocumentoController {
    constructor(private readonly requestInformationForSamir: ErroGetArvoreDocumentoUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const data: GetArvoreDocumentoDTO = request.body;
        try {
            const result = await this.requestInformationForSamir.execute(data);
            response.status(200).json(result);
        } catch (error) {
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}