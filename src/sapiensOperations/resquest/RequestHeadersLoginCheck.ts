import { BaseRequestHeaders, CustomHeaders } from "./classes/BaseRequestHeaders";

export class RequestHeadersLogingCheck extends BaseRequestHeaders {
  getHeaders(cookie: string): CustomHeaders {
    return {
      ...this.getCommonHeaders(),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': '112',
      Referer: 'https://sapiens.agu.gov.br/login',
      Cookie: cookie
    };
  }
}
