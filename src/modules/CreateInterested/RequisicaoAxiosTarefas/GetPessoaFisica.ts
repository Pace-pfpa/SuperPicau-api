import axios from "axios";
import { RequestPessoaFisica } from "../../../sapiensOperations/resquest/RequestPessoaFisica";
import { RequestHeadersPF } from "../../../sapiensOperations/resquest/RequestHeadersPF";

export async function GetPessoaFisica (cpf: string, cookie: string){
    const requestGetPessoaFisica = new RequestPessoaFisica();
    const requestHeaders = new RequestHeadersPF();
    const payload = await requestGetPessoaFisica.execute(cpf)
    const UrlRequest = "https://sapiens.agu.gov.br/receitafederal/importa/pessoafisica";

    
    const headers = await requestHeaders.execute(cookie)

    try {

        const response = await axios.post(UrlRequest, payload, {headers})
        return response.data
        
    } catch(e) {
        console.error("ERRO AO BUSCAR PELO MÉTODO PESSOA FÍSICA")
        return null
    }



}
