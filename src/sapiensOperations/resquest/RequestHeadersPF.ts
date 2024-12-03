import { BaseRequestHeaders, CustomHeaders } from './classes/BaseRequestHeaders';

export class RequestHeadersPF extends BaseRequestHeaders {
    getHeaders(cookie: string): CustomHeaders {
        return {
            ...this.getCommonHeaders(),
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-File-Type': 'text/html',
            Cookie: cookie
        };
    }
}