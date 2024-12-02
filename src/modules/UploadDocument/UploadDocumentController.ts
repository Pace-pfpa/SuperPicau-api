import { Request, Response } from 'express';
import { UploadDocumentUseCase } from "./UploadDocumentUseCase";

export class UploadDocumentController {
    constructor(private readonly UploadDocumentUseCase: UploadDocumentUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const { cookie, fileName, conteudo, documento_id } = request.body;
        try {
            const response = await this.UploadDocumentUseCase.execute(cookie, fileName, conteudo, documento_id);
            response.status(200).json(response);
        } catch (error) {
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}