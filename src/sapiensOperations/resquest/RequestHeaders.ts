import { BaseRequestHeaders, CustomHeaders } from "./classes/BaseRequestHeaders";

/**
 * Implementação concreta de `BaseRequestHeaders` que define os cabeçalhos para upload de arquivos no Sapiens.
 * 
 * - Adiciona o header `X-File-Type` com valor `text/html`.
 * - Insere o cookie do usuário na requisição.
 */
export class RequestHeaders extends BaseRequestHeaders {
  /**
   * Retorna os cabeçalhos personalizados para requisições ao Sapiens.
   * 
   * - Inclui os cabeçalhos comuns (`getCommonHeaders`).
   * - Adiciona `X-File-Type: text/html` para indicar que o conteúdo é HTML.
   * - Define o cookie do usuário.
   * 
   * @param cookie Cookie de autenticação do usuário.
   * @returns Os cabeçalhos HTTP configurados.
   * 
   * @example
   * ```ts
   * const requestHeaders = new RequestHeaders();
   * const headers = requestHeaders.getHeaders("session_cookie");
   * console.log(headers);
   * ```
   */
  getHeaders(cookie: string): CustomHeaders {
    return {
      ...this.getCommonHeaders(),
      'X-File-Type': 'text/html',
      Cookie: cookie
    };
  }
}
