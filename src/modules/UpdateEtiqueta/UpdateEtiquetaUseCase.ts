import axios from 'axios';
import { IUpdateEtiquetaDTO } from '../../DTO/UpdateEtiquetaDTO';
import { RequestHeaders } from '../../sapiensOperations/resquest/RequestHeaders';
var querystring = require('querystring');
export class UpdateEtiquetaUseCase {

    async execute(data: IUpdateEtiquetaDTO): Promise<string> {
        const now = Date.now();
        const requestHeaders = new RequestHeaders;
        const headers = await requestHeaders.execute(data.cookie);
        const baseURL = `https://sapiens.agu.gov.br/visualizador/etiqueta`
        const playload = {
            tarefaId: data.tarefaId,
            creditoId: ``,
            comunicacaoJudicialId: ``,
            etiqueta: data.etiqueta,
        };

        //console.log('Request URL:', baseURL);
        //console.log('Request Headers:', headers);
        //console.log('Request Payload:', playload);


        try {
            const response = await axios.post(baseURL, querystring.stringify(playload), { headers });
            console.log('Response Data:', response.data);
            return response.data;
        } catch (error) {
            console.log("Erro na requisição:");
            if (error.response) {
                // Erro na resposta da API
                console.log('Erro na resposta da API:', error.response.data);
                console.log('Status:', error.response.status);
                console.log('Headers:', error.response.headers);
                return `Erro na resposta da API: ${error.response.status} - ${error.response.data}`;
            } else if (error.request) {
                // A requisição foi feita, mas nenhuma resposta foi recebida
                console.log('Nenhuma resposta recebida:', error.request);
                return 'Nenhuma resposta recebida da API.';
            } else {
                // Algo aconteceu na configuração da requisição que disparou um erro
                console.log('Erro ao configurar a requisição:', error.message);
                return `Erro ao configurar a requisição: ${error.message}`;
            }
        }
    }
}

