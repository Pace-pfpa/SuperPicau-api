import { requestSapiens } from './requestSapiens';

/**
 * Envia uma requisição para o SAPIENS e retorna os registros obtidos.
 * 
 * - Faz uma chamada ao serviço `requestSapiens`, passando o cookie de autenticação e a operação desejada.
 * - Valida a resposta, garantindo que os dados retornados sejam um array válido contendo registros.
 * - Lança um erro caso a resposta seja inválida ou vazia.
 * 
 * @param cookie Cookie de autenticação do usuário na sessão do Sapiens.
 * @param operation String contendo a operação a ser executada na API do Sapiens.
 * @returns Um array de registros retornados pela API do Sapiens.
 * @throws {Error} Se a resposta da API for inválida ou não contiver registros.
 * 
 * @example
 * ```ts
 * try {
 *   const registros = await RequestSapiens("session_cookie", "buscarDocumentos");
 *   console.log(registros);
 * } catch (error) {
 *   console.error("Erro ao consultar documentos:", error.message);
 * }
 * ```
 */
export async function RequestSapiens(coockie: string, operation:string): Promise<any> {
    const response = await requestSapiens(coockie,operation); 

    if (!response || !Array.isArray(response) || response.length === 0 || !response[0].result || !response[0].result.records) {
        console.error("Resposta inválida da API Visão:", response);
        throw new Error("Resposta inválida da API Visão.");
    }

    return response[0].result.records;
}
