import { RequestSapiens } from "../../pytonRequest/requestSapiens";
import { RequestGetTarefa } from "../../sapiensOperations/resquest/RequestGetTarefa";
import { IGetTarefaDTO } from "./DTO/IGetTarefaDTO";
import { ITarefaResponse } from "./DTO/ITarefaResponse";

export class GetTarefaUseCase {
    constructor(private RequestGetTarefa: RequestGetTarefa) { }

    async execute(data: IGetTarefaDTO): Promise<ITarefaResponse[]> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const getTarefa = await this.RequestGetTarefa.execute(data.usuario_id, data.etiqueta, data.processoJudicial, data.qunatidadeDeProcesso);
                    const response = await RequestSapiens(data.cookie, getTarefa);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            }, 6000);
        });
    }
}
