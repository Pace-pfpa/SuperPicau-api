import { RequestHeaderUploadArquivoForAttachment } from '../sapiensOperations/resquest/RequestHeaderUploadArquivoForAttachment';
import axios from 'axios';


export class UploadDocumentForAttachmentUseCase {

    async execute(Coockie: string, fileName: string, conteudo: string, tipo_documento: string, pasta: string, ticket_uploud: string): Promise<any> {
        const requestHeaderUploadArquivo = new RequestHeaderUploadArquivoForAttachment;
        const headers = await requestHeaderUploadArquivo.execute({file_name: fileName, cookie: Coockie, tamanho: conteudo.length});
        const baseURL = `https://sapiens.agu.gov.br/upload_pasta?pasta=${pasta}&ticket_upload=${ticket_uploud}&tipoDocumento=${tipo_documento}&complementoMovimento=PICA-PAU`
        const data = conteudo;
        return await axios.post(baseURL, data, {headers}).then(response =>{
            //console.log(response.status)
            console.log(response.data)
            return response.status;
        }).catch(error =>{
            console.log(error)
            return new Error(error);
        })
        // return await UploadDocumenteForSapienInPython(Coockie, fileName, conteudo, documento_id, tipo_documento);
    }
}