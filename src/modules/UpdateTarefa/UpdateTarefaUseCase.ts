import { RequestSapiens } from "../../pytonRequest/requestSapiens";
import { RequestUpdateTarefa } from "../../sapiensOperations/resquest/RequestUpdateTarefa";

export class UpdateTarefaUseCase {
    constructor(private readonly RequestUpdateTarefa:RequestUpdateTarefa){};
    async execute(cookie: string, data: any): Promise<any> {

        const payload = await this.RequestUpdateTarefa.execute(data);

        const response = (await RequestSapiens(cookie, payload))
        
        return response;
    }
}