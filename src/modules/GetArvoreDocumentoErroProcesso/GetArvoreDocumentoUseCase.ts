import axios from "axios";
import { RequestHeaders } from "../../sapiensOperations/resquest/RequestHeaders";
import { GetArvoreDocumentoDTO, ResponseArvoreDeDocumentoDTO } from "../GetArvoreDocumento";

export class ErroGetArvoreDocumentoUseCase {

    async execute(data: GetArvoreDocumentoDTO): Promise<Array<ResponseArvoreDeDocumentoDTO>> {
        const requestHeaderUploadArquivo = new RequestHeaders;
        const headers = await requestHeaderUploadArquivo.execute(data.cookie);
        const baseURL = `https://sapiens.agu.gov.br/visualizador?nup=${data.nup}`
        return await axios.get(baseURL, {headers}).then(response =>{
            return response.data;
        }).catch(error =>{
            return new Error(error);
        })
    }
}
