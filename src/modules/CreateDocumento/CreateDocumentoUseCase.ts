import { ICreateDocumentDTO } from '../../DTO/CreateDocumentDTO';
import { RequestSapiens } from '../../pytonRequest/requestSapiens';
import { RequestCreateDocumento } from '../../sapiensOperations/resquest/RequestCreateDocumento';
export class CreateDocumentoUseCase {
    constructor(private RequestCreateDocumento:RequestCreateDocumento){};

    async execute(data: ICreateDocumentDTO): Promise<any> {
        try {
            const payload = await this.RequestCreateDocumento.execute(data);

            if (!payload) {
                throw new Error("Falha ao gerar o payload para a criação do documento.");
            }

            const response = await RequestSapiens(data.cookie, payload);

            if (!response || response.length === 0) {
                throw new Error("Resposta inválida ao criar o documento no Sapiens.");
            }

            return response;
        } catch (error) {
            console.error("Erro na criação do documento:", error.message);
            throw new Error("Falha na criação do documento. Verifique os dados e tente novamente.");
        }
        
        
    }
}