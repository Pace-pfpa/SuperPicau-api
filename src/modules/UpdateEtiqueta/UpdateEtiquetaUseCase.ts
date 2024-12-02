import axios from 'axios';
import { RequestHeaders } from '../../sapiensOperations/resquest/RequestHeaders';
import { IUpdateEtiquetaDTO } from './dtos/UpdateEtiquetaDTO';
let querystring = require('querystring');

export class UpdateEtiquetaUseCase {

    async execute(data: IUpdateEtiquetaDTO): Promise<string> {
        const requestHeaders = new RequestHeaders;
        const headers = await requestHeaders.execute(data.cookie);
        const baseURL = `https://sapiens.agu.gov.br/visualizador/etiqueta`

        const payload = {
            tarefaId: data.tarefaId,
            creditoId: ``,
            comunicacaoJudicialId: ``,
            etiqueta: data.etiqueta,
        };

        try {
            const response = await axios.post(baseURL, querystring.stringify(payload), { headers });
            console.log('Response Data:', response.data);
            return response.data;
        } catch (error) {
            console.log("Erro na requisição:");
            if (error.response) {
                console.error('Erro na resposta da API:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);
                return `Erro na resposta da API: ${error.response.status} - ${error.response.data}`;
            } else if (error.request) {
                console.error('Nenhuma resposta recebida:', error.request);
                return 'Nenhuma resposta recebida da API.';
            } else {
                console.error('Erro ao configurar a requisição:', error.message);
                return `Erro ao configurar a requisição: ${error.message}`;
            }
        }
    }
}

