import { requestSapiens } from './requestSapiens';

export async function RequestSapiensUpdate(coockie: string, operation:string): Promise<any> {
    const response = await requestSapiens(coockie,operation); 

    if (!response || !Array.isArray(response) || response.length === 0 || !response[0].result.success) {
        console.error("Resposta inválida da API Visão:", response);
        throw new Error("Resposta inválida da API Visão.");
    }

    return response[0].result;
}