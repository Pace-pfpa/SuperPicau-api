import axios from "axios";
import { RequestTarefas } from "../../../sapiensOperations/resquest/RequestTarefas";
import { RequestHeaders } from "../../../sapiensOperations/resquest/RequestHeaders";

export async function GetPessoa_id(cpf: string, cookie: string){

    const requestTarefasPessoa = new RequestTarefas();
    const requestHeaders = new RequestHeaders();
    const payload = await requestTarefasPessoa.execute(cpf);
    const UrlRequest = "https://sapiens.agu.gov.br/route";
    const headers = await requestHeaders.execute(cookie)

    try{
        console.log("chegou " + cpf)
        const response = await axios.post(UrlRequest, payload, {headers})

        if (!response.data[0].result.records.length) {
            return null
        } else {
            const pessoa_id = response.data[0].result.records[0].pessoa_id
            console.log('PESSOA_ID: ' + pessoa_id)
            return pessoa_id;
        }

    }catch(e){
        console.log("nesse erro aqui")
        throw new Error(e);
    }
}