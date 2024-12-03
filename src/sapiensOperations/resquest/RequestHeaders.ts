import { BaseRequestHeaders, CustomHeaders } from "./classes/BaseRequestHeaders";

export class RequestHeaders extends BaseRequestHeaders {
  getHeaders(cookie: string): CustomHeaders {
    return {
      ...this.getCommonHeaders(),
      'X-File-Type': 'text/html',
      Cookie: cookie
    };
  }
}
