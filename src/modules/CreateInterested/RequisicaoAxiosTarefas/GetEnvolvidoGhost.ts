import axios from "axios";
import { RequestEnvolvidoGhost } from "../../../sapiensOperations/resquest/RequestEnvolvidoGhost";
import { RequestHeaders } from "../../../sapiensOperations/resquest/RequestHeaders";

export async function GetEnvolvidoGhost (cpf: string, cookie: string){
    const requestGetEnvolvidoGhost = new RequestEnvolvidoGhost();
    const requestHeaders = new RequestHeaders();
    const payload = await requestGetEnvolvidoGhost.execute(cpf)
    const UrlRequest = "https://sapiens.agu.gov.br/route";

    
    const headers = await requestHeaders.execute(cookie)

    try {

        const response = await axios.post(UrlRequest, payload, {headers})
        return response.data
        
    } catch(e) {
        console.error("ERRO AO BUSCAR PELO MÉTODO GHOST")
        return null
    }
}
