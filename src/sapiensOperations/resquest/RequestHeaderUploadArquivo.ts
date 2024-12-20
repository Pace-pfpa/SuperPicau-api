import { BaseRequestHeaders, CustomHeaders } from './classes/BaseRequestHeaders';
import { IHeaderUploadArquivoDTO } from './dtos/IHeaderUploadArquivoDTO';

export class RequestHeaderUploadArquivo extends BaseRequestHeaders {
    getHeaders(cookie: string, data: IHeaderUploadArquivoDTO): CustomHeaders {
        return {
            ...this.getCommonHeaders(),
            'Content-Type': 'application/binary',
            'Content-Length': `${data.tamanho}`,
            'X-File-Name': data.file_name,
            'X-File-Size': `${data.tamanho}`,
            'X-File-Type': 'text/html',
            Cookie: cookie
        };
    }
}
