import axios from "axios";
import { RequestCreateTarefa } from "../../../sapiensOperations/resquest/RequestCreateTarefa";
import { RequestHeaders } from "../../../sapiensOperations/resquest/RequestHeaders";

export async function CreateTarefa(pasta_id: number, tarefa_id: number, cookie: string){




    const requestCreateTarefa = new RequestCreateTarefa
    const requestHeaders = new RequestHeaders
        const payload = await requestCreateTarefa.execute(pasta_id, tarefa_id);
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