import axios from 'axios';
let querystring = require('querystring');
import { RequestHeaders } from "../../sapiensOperations/resquest/RequestHeaders";
import { SolicitarDossiePrevidenciarioDTO } from "./dtos/SolicitarDossiePrevidenciarioDTO";

export class SolicitarDossiePrevidenciarioUseCase {

    async execute(data: SolicitarDossiePrevidenciarioDTO): Promise<string> {
        const requestHeaderUploadArquivo = new RequestHeaders;
        const headers = await requestHeaderUploadArquivo.execute(data.cookie);
        const baseURL = `https://sapiens.agu.gov.br/servicos/consultaDossieINSS`
        const body = querystring.stringify({pessoaId: data.pessoaId, pastaId: data.pastaId})
        return await axios.post(baseURL, body, {headers}).then(response =>{
            return response.data;
        }).catch(error =>{
            console.log(error)
            return new Error(error);
        })
    }
}