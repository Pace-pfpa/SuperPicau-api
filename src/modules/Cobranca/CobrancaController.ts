import { Request, Response } from 'express';
import { ICobrancaDTO } from './interfaces/ICobrancaDTO';
import { CobrancaExtractor } from './CobrancaExtractor';

/** 
 * @group Cobrança
 * 
 * Controller responsável por receber requisições para a triagem de processos do tipo "cobrança".
 * 
 * - Processa a requisição HTTP.
 * - Chama o service `CobrancaExtractor` para extrair os documentos a serem analisados.
 * - Se não houver erro na interação com o SAPIENS, chama o service `CobrancaImpedimentos` para a análise de impedimentos.
 * - Retorna a resposta apropriada para o cliente.
 * 
 * @example
 * ```ts
 * app.post("/cobranca", (req, res) => cobrancaController.handle(req, res));
 * ```
 */ 
export class CobrancaController {
    /**
     * @group Cobrança
     * @param cobrancaExtractor Caso de uso responsável por extrair os documentos para a análise da cobrança.
     */
    constructor(
        private readonly cobrancaExtractor: CobrancaExtractor,
    ) {}

    /**
     * @group Cobrança
     * Manipula a requisição de tudo que envolve o endpoint "cobrança".
     * 
     * - Extrai os parâmetros do corpo da requisição.
     * - Chama os serviços necessários para extração e análise.
     * - Retorna uma resposta JSON com os dados ou um erro, se ocorrer.
     * 
     * @param request Objeto de requisição HTTP do Express.
     * @param response Objeto de resposta HTTP do Express.
     * @returns Uma resposta HTTP com status 200 e o resultado da triagem, ou 400 em caso de erro.
     * 
     */
    async handle(request: Request, response: Response): Promise<Response> {
        const data: ICobrancaDTO = request.body;
        return new Promise((resolve, _reject) => {
            setTimeout(async() => {
                try {
                    /** 
                     * Extração de informações do SAPIENS
                     */
                    const result = await this.cobrancaExtractor.execute(data);

                    /** 
                     * Análise de impeditivos e finalização da triagem
                    */
                    
                } catch (error) {
                    console.error("Erro ao extrair informações do SAPIENS", error);
                    return response.status(400).json({
                        resposta: error.message || "Erro inesperado durante a triagem."
                    });
                }
            }, 5000)
        })
    }
}
