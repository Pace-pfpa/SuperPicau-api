import axios from "axios";
import { RequestPessoaFisica } from "../../../sapiensOperations/resquest/RequestPessoaFisica";
import { RequestHeadersPF } from "../../../sapiensOperations/resquest/RequestHeadersPF";

export async function GetPessoaFisica (cpf: string, cookie: string){



    const requestGetPessoaFisica = new RequestPessoaFisica
    const requestHeaders = new RequestHeadersPF
    const payload = await requestGetPessoaFisica.execute(cpf)
    const UrlRequest = "https://sapiens.agu.gov.br/receitafederal/importa/pessoafisica"

    
    const headers = await requestHeaders.execute(cookie)

    console.log('PAYLOAD')
    console.log(payload)
    console.log('HEADER')
    //console.log(headers)
    try{

        const response = await axios.post(UrlRequest, payload, {headers})
        return response.data
        
    }catch(e){
        console.log(e)
        return e
    }



}
