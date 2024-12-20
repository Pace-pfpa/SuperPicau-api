import { RequestSapiensUpdate } from '../../pytonRequest/requestSapiens/requestSapiensUpdate';
import { RequestUpdateDocumento } from '../../sapiensOperations/resquest/RequestUpdateDocumento';
import { IUpdateDocumento } from './dtos/IUpdateDocumento';

export class UpdateDocumentoUseCase {
    constructor(private readonly requestUpdateDocumento: RequestUpdateDocumento) {};

    async execute(data: IUpdateDocumento): Promise<any> {
        try {
            const payload = await this.requestUpdateDocumento.execute(data);

            if (!payload) {
                throw new Error("Falha ao gerar o payload para a atualização do documento.");
            }

            const response = await RequestSapiensUpdate(data.cookie, payload);

            if (!response.success) {
                throw new Error("Resposta inválida ao criar o documento no Sapiens.");
            }

            return response;
        } catch (error) {
            console.error("Erro na atualização do documento:", error.message);
            throw new Error("Falha na atualização do documento. Verifique os dados e tente novamente.");
        }
    }
}