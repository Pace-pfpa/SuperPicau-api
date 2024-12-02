import { RequestSapiens } from "../../pytonRequest/requestSapiens";
import { RequestGetTarefaNup } from "../../sapiensOperations/resquest/RequestGetTarefaNup"
import { IGetTarefaNupDTO } from "./dtos/GetTarefaNupDTO";

export class GetTarefaNupUseCase {
    constructor(private readonly requestGetTarefaNup:RequestGetTarefaNup){};
    async execute(data: IGetTarefaNupDTO): Promise<Array<any>> {
  
        const getTarefa = await this.requestGetTarefaNup.executeMerda(data.usuario_id, data.nup, data.processoJudicial ,data.qunatidadeDeProcesso);
        const response = (await RequestSapiens(data.cookie, getTarefa))
        return response;
    }
}