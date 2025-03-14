import axios from "axios";
import { RequestHeaders } from "../../sapiensOperations/resquest/RequestHeaders";
import { IGetDocumentoDTO } from "./dtos";

export class GetDocumentoUseCase {

    async execute(data: IGetDocumentoDTO): Promise<string | Error> {
        const requestHeaderUploadArquivo = new RequestHeaders;
        const headers = await requestHeaderUploadArquivo.execute(data.cookie);
        const baseURL = `https://sapiens.agu.gov.br/documento/${data.idDocument}`
        return await axios.get(baseURL, {headers}).then(response =>{
            return response.data;
        }).catch(error =>{
            console.log('---ERRO NO GET DOCUMENTO')
            console.error(error.response.data)
            return new Error(error);
        })
    }
}