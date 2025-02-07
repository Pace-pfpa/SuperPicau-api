import { Request, Response } from "express";
import { CreateDocumentoUseCase } from "./CreateDocumentoUseCase";

/** 
 * @group CreateDocumento
 * 
 * Controller responsável por receber requisições para a criação de documentos.
 * 
 * - Processa a requisição HTTP.
 * - Valida os dados do corpo da requisição.
 * - Chama o caso de uso `CreateDocumentoUseCase`.
 * - Retorna a resposta apropriada para o cliente.
 * 
 * @example
 * ```ts
 * app.post("/documento", (req, res) => createDocumentoController.handle(req, res));
 * ```
 */ 
export class CreateDocumentoController {
    /**
     * @group CreateDocumento
     * @param createDocumentoUseCase Caso de uso responsável pela lógica de criação de documentos.
     */
    constructor(private readonly createDocumentoUseCase: CreateDocumentoUseCase,) {}

    /**
     * @group CreateDocumento
     * Manipula a requisição para criação de um documento no sistema Sapiens.
     * 
     * - Extrai os parâmetros do corpo da requisição.
     * - Chama o serviço `createDocumentoUseCase` para processar os dados.
     * - Retorna uma resposta JSON com os dados ou um erro, se ocorrer.
     * 
     * @param request Objeto de requisição HTTP do Express.
     * @param response Objeto de resposta HTTP do Express.
     * @returns Uma resposta HTTP com status 200 e os dados do documento criado, ou 400 em caso de erro.
     * 
     * @example
     * ```json
     * {
     *   "cookie": "session_cookie",
     *   "pasta_id": 123,
     *   "usuario_nome": "Seu Alurk",
     *   "usuario_setor": "TI",
     *   "tarefa_id": 456,
     *   "tid": "ABC123",
     *   "tipoDocumento_id": 789,
     *   "modelo_id": 101
     * }
     * ```
     */
    async handle(request: Request, response: Response): Promise<Response> {
        const { cookie,
            pasta_id,
            usuario_nome,
            usuario_setor,
            tarefa_id,
            tid,
            tipoDocumento_id,
            modelo_id } = request.body;
        try {
            const result = await this.createDocumentoUseCase.execute({
                cookie,
                pasta_id,
                usuario_nome,
                usuario_setor,
                tarefa_id,
                tid,
                tipoDocumento_id,
                modelo_id
            });
            response.status(200).json(result);
        } catch (error) {
            return response.status(400).json({
                message: error.message || "Unexpected error"
            });
        }
    }
}