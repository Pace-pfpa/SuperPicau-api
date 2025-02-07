import axios from "axios";
import { RequestHeaders } from "../../sapiensOperations/resquest/RequestHeaders";

/**
 * Realiza uma requisição ao SAPIENS enviando um payload JSON.
 * 
 * - Gera os headers necessários para a requisição utilizando `RequestHeaders`.
 * - Faz uma requisição HTTP `POST` para a URL base do Sapiens.
 * - Valida e parseia o payload antes do envio.
 * - Retorna os dados da API ou lança um erro em caso de falha.
 * 
 * @param cookie Cookie de autenticação da sessão do usuário.
 * @param payload String contendo o JSON com os dados da operação a ser executada no Sapiens.
 * @returns Os dados retornados pela API do Sapiens ou um erro.
 * @throws {Error} Se houver falha no parse do payload ou erro na requisição HTTP.
 * 
 * @example
 * ```ts
 * try {
 *   const response = await requestSapiens("session_cookie", '{"action":"BuscarDocumentos"}');
 *   console.log(response);
 * } catch (error) {
 *   console.error("Erro ao fazer a requisição:", error.message);
 * }
 * ```
 */
export async function requestSapiens(cookie: string, payload: string): Promise<any> {
    const requestHeaderUploadArquivo = new RequestHeaders();

    /**
     * Gera os headers necessários para a requisição.
     */
    const headers = await requestHeaderUploadArquivo.execute(cookie);

    /**
     * URL base da API do Sapiens.
     */
    const baseURL = `https://sapiens.agu.gov.br/route`
    let data;

    try {
        /**
         * Faz o parse do payload para garantir que seja um JSON válido.
         */
        data = await JSON.parse(payload);    
    } catch (error) {
        console.log('Erro ao parsear o payload:', error);
        return new Error('Erro ao parsear o payload');
    }
    
    try {
        /**
         * Envia a requisição para o Sapiens com os headers e payload formatados.
         */
        const response = await axios.post(baseURL, data, { headers })
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log('Erro na resposta da API:', error.response.data);
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);
        } else if (error.request) {
            console.log('Nenhuma resposta recebida:', error.request);
        } else {
            console.log('Erro ao configurar a requisição:', error.message);
        }

        return new Error('Erro ao fazer a requisição');
    }
}