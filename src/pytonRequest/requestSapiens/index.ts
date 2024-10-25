import { requestSapiens } from './requestSapiens';

export async function RequestSapiens(coockie: string, operation:string): Promise<any> {
    const response = await requestSapiens(coockie,operation); 

    if (!response || !Array.isArray(response) || response.length === 0 || !response[0].result || !response[0].result.records) {
        console.error("Resposta inválida da API Visão:", response);
        throw new Error("Resposta inválida da API Visão.");
    }

    return response[0].result.records;
}
// async function requestSapiens(cookie: string, payload: string ): Promise<any>{
//     const requestHeaderUploadArquivo = new RequestHeaders;
//     const headers = await requestHeaderUploadArquivo.execute(cookie);
//         const baseURL = `https://sapiens.agu.gov.br/route`
//         const data = await JSON.parse(payload);
//         return await axios.post(baseURL, data ,{headers}).then(response =>{

//             return response.data;
//         }).catch(error =>{
//             console.log(error)
//             return new Error(error);
//         })
// }