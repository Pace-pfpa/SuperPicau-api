/**
 * Representa os cabeçalhos personalizados para requisições HTTP ao Sapiens.
 * 
 * - Os cabeçalhos são definidos como um objeto de chave-valor (`string` -> `string`).
 * - Utilizado na classe mãe `BaseRequestHeaders` e suas classes filhas.
 */
export interface CustomHeaders {
  [key: string]: string;
}

/**
 * Classe abstrata para a geração de cabeçalhos HTTP comuns às requisições ao Sapiens.
 * 
 * - Define um conjunto padrão de cabeçalhos HTTP (`getCommonHeaders`).
 * - Realiza a sanitização do cookie (`sanitizeCookie`).
 * - Implementa o método `execute` para padronizar a geração dos headers.
 * - Define um método abstrato `getHeaders` que deve ser implementado pelas classes filhas.
 */
export abstract class BaseRequestHeaders {
  /**
     * Sanitiza o cookie recebido, removendo espaços e quebras de linha.
     * 
     * @param cookie Cookie de autenticação do usuário.
     * @returns O cookie sanitizado.
     * 
     * @example
     * ```ts
     * const sanitizedCookie = baseRequestHeaders.sanitizeCookie(" session_cookie \n");
     * console.log(sanitizedCookie); // "session_cookie"
     * ```
  */
  protected sanitizeCookie(cookie: string): string {
    return cookie.trim().replace('\n', '');
  }

  /**
     * Retorna os cabeçalhos HTTP comuns utilizados em requisições ao Sapiens.
     * 
     * - Inclui informações como `User-Agent`, `Accept`, `Referer`, entre outros.
     * - Utilizado como base para a construção dos headers personalizados.
     * 
     * @returns Um objeto contendo os cabeçalhos comuns.
  */
  protected getCommonHeaders(): CustomHeaders {
    return {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Connection': 'keep-alive',
      'Host': 'sapiens.agu.gov.br',
      'Origin': 'https://sapiens.agu.gov.br',
      'Referer': 'https://sapiens.agu.gov.br/',
      'sec-ch-ua': "'Google Chrome';v='95', 'Chromium';v='95', ';Not A Brand';v='99'",
      'sec-ch-ua-mobile': '?0',
      'Sec-Fetch-Dest': 'empty',
      'sec-ch-ua-platform': 'Windows',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
    }
  }
  
  /**
     * Método abstrato que deve ser implementado para retornar os cabeçalhos HTTP.
     * 
     * @param cookie Cookie de autenticação do usuário.
     * @param additionalData Dados adicionais para personalizar os cabeçalhos (opcional).
     * @returns Os cabeçalhos HTTP personalizados.
  */
  abstract getHeaders(cookie: string, additionalData?: any): CustomHeaders;
  
  /**
     * Executa a geração dos cabeçalhos sanitizando o cookie e aplicando a lógica de personalização.
     * 
     * @param cookie Cookie de autenticação do usuário.
     * @param additionalData Dados adicionais opcionais.
     * @returns Os cabeçalhos HTTP gerados.
     * 
     * @example
     * ```ts
     * const headers = await baseRequestHeaders.execute(" session_cookie ");
     * console.log(headers);
     * ```
  */
  async execute(cookie: string, additionalData?: any): Promise<CustomHeaders> {
    const sanitizedCookie = this.sanitizeCookie(cookie);
    const headers = this.getHeaders(sanitizedCookie, additionalData);
    return headers;
  }
}
