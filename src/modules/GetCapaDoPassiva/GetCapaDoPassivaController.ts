import { Request, Response } from "express";
import { GetCapaDoPassivaUseCase } from "./GetCapaDoPassivaUseCase";

export class GetCapaDoPassivaController {
    constructor(private readonly getCapaDoPassivaUseCase: GetCapaDoPassivaUseCase,) { }
    async handle(request: Request, response: Response): Promise<Response> {
        const {nup, cookie} = request.body;
        try {
            const result = await this.getCapaDoPassivaUseCase.execute(nup, cookie);
            response.status(200).json(result);
        } catch (error) {
            console.log("Arvore de documento não foi recebida: ");
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}
