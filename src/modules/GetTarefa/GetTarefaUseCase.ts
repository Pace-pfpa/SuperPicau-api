import { RequestSapiens } from "../../pytonRequest/requestSapiens";
import { RequestGetTarefa } from "./operations/request/RequestGetTarefa";
import { IGetTarefaDTO, ITarefaResponse } from "./dtos";

export class GetTarefaUseCase {
    constructor(private readonly requestGetTarefa: RequestGetTarefa) { }

    async execute(data: IGetTarefaDTO): Promise<ITarefaResponse[]> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const getTarefa = await this.requestGetTarefa.execute(data.usuario_id, data.etiqueta, data.processoJudicial, data.qunatidadeDeProcesso);
                    const response = await RequestSapiens(data.cookie, getTarefa);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            }, 6000);
        });
    }
}
