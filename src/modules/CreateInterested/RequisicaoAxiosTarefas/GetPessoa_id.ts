import axios from "axios";
import { RequestTarefas } from "../../../sapiensOperations/resquest/RequestTarefas";
import { resolve } from "url";
import { RequestHeaders } from "../../../sapiensOperations/resquest/RequestHeaders";

export async function GetPessoa_id(cpf: string, cookie: string){



    const requestTarefasPessoa = new RequestTarefas
    const requestHeaders = new RequestHeaders
    const payload = await requestTarefasPessoa.execute(cpf);
    const UrlRequest = "https://sapiens.agu.gov.br/route"

        const headers = await requestHeaders.execute(cookie)
    try{
        console.log("chegou " + cpf)
        console.log(cookie)
        const response = await axios.post(UrlRequest, payload, {headers})
        console.log("---RESPOSTA GETPESSOA_ID: ")
        console.log(response.data[0])

        if (!response.data[0].result.records.length) {
            return null
        } else {
            const pessoa_id = response.data[0].result.records[0].pessoa_id
            console.log('PESSOA_ID: ' + pessoa_id)
            return pessoa_id;
        }

    }catch(e){
        console.log("nesse erro aqui")
        console.log(e);
    }

        /* return await axios.post(baseURL, data, {headers}).then(response =>{
            return response.status;
        }).catch(error =>{
            console.log(error)
            return new Error(error);
        }) */








}