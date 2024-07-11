import axios from "axios";
import { RequestGetInteressadosNup } from "../../../sapiensOperations/resquest/RequestGetInteressadosNup";
import { RequestHeaders } from "../../../sapiensOperations/resquest/RequestHeaders";

export async function GetInteressadosReq(pasta_id: number, cookie: string){


    console.log("-> DE ROSSI")

    const requestGetInteressadosNup = new RequestGetInteressadosNup
    const requestHeaders = new RequestHeaders
    const payload = await requestGetInteressadosNup.execute(pasta_id);
    const UrlRequest = "https://sapiens.agu.gov.br/route"

    const headers = await requestHeaders.execute(cookie)
    try{
        const response = await axios.post(UrlRequest, payload, {headers})
        return response.data
        
    }catch(e){
        console.log(e)
        return e
    }



}