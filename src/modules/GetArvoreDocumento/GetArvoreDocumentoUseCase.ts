import axios from "axios";
import { GetArvoreDocumentoDTO } from "./dtos/GetArvoreDocumentoDTO";
import { RequestHeaders } from "../../sapiensOperations/resquest/RequestHeaders";
import { ResponseArvoreDeDocumentoDTO } from "./dtos/ResponseArvoreDocumentoDTO";

export class GetArvoreDocumentoUseCase {

    async execute(data: GetArvoreDocumentoDTO): Promise<ResponseArvoreDeDocumentoDTO[]> {
        const now = Date.now();
        const requestHeaderUploadArquivo = new RequestHeaders;
        const headers = await requestHeaderUploadArquivo.execute(data.cookie);
        const baseURL = `https://sapiens.agu.gov.br/visualizador/arvore?_dc=${now}&nup=${data.nup}&node=root`
        console.log("URL"+ baseURL)
        
        return await axios.get(baseURL, {headers}).then(response =>{
            return response.data;
        }).catch(error =>{
            console.log(error)
            return new Error(error);
        })
    }
}
