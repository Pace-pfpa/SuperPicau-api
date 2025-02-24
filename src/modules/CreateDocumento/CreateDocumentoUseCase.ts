import { RequestSapiens } from '../../pytonRequest/requestSapiens';
import { RequestCreateDocumento } from '../../sapiensOperations/resquest/RequestCreateDocumento';
import { ICreateDocumentDTO } from './dtos/ICreateDocumentDTO';

/**
 * @group CreateDocumento
 * Caso de uso responsável pela criação de um documento no sistema Sapiens.
 * 
 * - Gera um payload para a requisição de criação do documento.
 * - Envia a requisição para o SAPIENS.
 * - Trata erros e respostas inválidas.
 * 
 * @example
 * ```ts
 * const useCase = new CreateDocumentoUseCase(new RequestCreateDocumento());
 * const response = await useCase.execute({
 *   cookie: "session_cookie",
 *   documentoData: { ... }
 * });
 * console.log(response);
 * ```
 */
export class CreateDocumentoUseCase {
    /**
     * @group CreateDocumento
     * @param RequestCreateDocumento Serviço responsável por construir o payload da requisição.
     */
    constructor(private readonly RequestCreateDocumento: RequestCreateDocumento) {};

    /**
     * @group CreateDocumento
     * Executa o fluxo de criação de um documento no Sapiens.
     * 
     * - Gera um payload para a criação do documento.
     * - Envia a requisição para a API do Sapiens.
     * - Lança erros em caso de falha no processamento.
     * 
     * @param data Objeto contendo os dados necessários para a criação do documento.
     * @returns A resposta da API do Sapiens (ainda não mapeada).
     * @throws {Error} Se houver falha na geração do payload ou na resposta da API.
     */
    async execute(data: ICreateDocumentDTO): Promise<any> {
        try {
            const payload = await this.RequestCreateDocumento.execute(data);

            if (!payload) {
                throw new Error("Falha ao gerar o payload para a criação do documento.");
            }

            const response = await RequestSapiens(data.cookie, payload);

            if (!response || response.length === 0) {
                throw new Error("Resposta inválida ao criar o documento no Sapiens.");
            }

            return response;
        } catch (error) {
            console.error("Erro na criação do documento:", error.message);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }
    }
}