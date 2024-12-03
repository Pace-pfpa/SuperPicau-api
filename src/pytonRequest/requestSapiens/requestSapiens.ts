import axios from "axios";
import { RequestHeaders } from "../../sapiensOperations/resquest/RequestHeaders";

export async function requestSapiens(cookie: string, payload: string): Promise<any> {
    const requestHeaderUploadArquivo = new RequestHeaders();
    const headers = await requestHeaderUploadArquivo.execute(cookie);
    const baseURL = `https://sapiens.agu.gov.br/route`
    let data;

    try {
        data = await JSON.parse(payload);    
    } catch (error) {
        console.log('Erro ao parsear o payload:', error);
        return new Error('Erro ao parsear o payload');
    }
    
    try {
        const response = await axios.post(baseURL, data, { headers })
        return response.data;

    } catch (error) {
        if (error.response) {
            console.log('Erro na resposta da API:', error.response.data);
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);
        } else if (error.request) {
            console.log('Nenhuma resposta recebida:', error.request);
        } else {
            console.log('Erro ao configurar a requisição:', error.message);
        }

        return new Error('Erro ao fazer a requisição');
    }
}