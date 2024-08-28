import axios from "axios";
import { RequestEnvolvidoGhost } from "../../../sapiensOperations/resquest/RequestEnvolvidoGhost";
import { RequestHeaders } from "../../../sapiensOperations/resquest/RequestHeaders";

export async function GetEnvolvidoGhost (cpf: string, cookie: string){


    console.log("--GHOST")

    const requestGetEnvolvidoGhost = new RequestEnvolvidoGhost
    const requestHeaders = new RequestHeaders
    const payload = await requestGetEnvolvidoGhost.execute(cpf)
    const UrlRequest = "https://sapiens.agu.gov.br/route"

    
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
