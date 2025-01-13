import axios from "axios";
import { RequestHeaders } from "../../sapiensOperations/resquest/RequestHeaders";
import { GetEditorMinutaDTO } from "./dtos/GetEditorMinutaDTO";

export class GetEditorMinutaUseCase {

    async execute(data: GetEditorMinutaDTO): Promise<any> {
        const requestHeaderUploadArquivo = new RequestHeaders;
        const headers = await requestHeaderUploadArquivo.execute(data.cookie);
        const baseURL = `https://sapiens.agu.gov.br/editor?d=${data.documentoId}&c=${data.minutaId}`
        
        return await axios.get(baseURL, {headers}).then(response =>{

            if (response.status !== 200) {
                throw new Error("Falha ao ativar o editor.");
            }
            
            return response.data;
        }).catch(error =>{
            console.log(error)
            throw new Error(error);
        })
    }
}
