import { IHeaderUploadArquivoDTO } from '../../DTO/HeaderUploadArquivoDTO'


export class RequestHeaderUploadArquivoForAttachment{
    async execute(data: IHeaderUploadArquivoDTO): Promise<any>{


        const requestUploudArquivoAttachment = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Content-Length': `${data.tamanho}`,
            'Content-Type': 'application/binary',
            'Cookie': data.cookie,
            'Host': 'sapiens.agu.gov.br',
            'Origin': 'https://sapiens.agu.gov.br',
            'Referer': 'https://sapiens.agu.gov.br/',
            'sec-ch-ua': "'Chromium';v='112', 'Google Chrome';v='112', 'Not:A-Brand';v='99'",
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': 'Windows',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            'X-File-Name': `${data.file_name}`,
            'X-File-Size': `${data.tamanho}`,
            'X-File-Type': 'text/html',
            'X-Requested-With': 'XMLHttpRequest',
        }
        requestUploudArquivoAttachment.Cookie = await requestUploudArquivoAttachment.Cookie.replace("\n", "");

        return requestUploudArquivoAttachment;

    }
}