import { IGetTarefaDTO } from "../../DTO/GetTarefaDTO";
import { RequestSapiens } from "../../pytonRequest/requestSapiens";
import { RequestGetTarefa } from "../../sapiensOperations/resquest/RequestGetTarefa";

export class GetTarefaUseCase {
    constructor(private RequestGetTarefa: RequestGetTarefa) { }

    async execute(data: IGetTarefaDTO): Promise<Array<any>> {
        // Retorna uma nova Promise
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    // Executa a tarefa após o timeout
                    const getTarefa = await this.RequestGetTarefa.execute(data.usuario_id, data.etiqueta, data.processoJudicial, data.qunatidadeDeProcesso);
                    const response = await RequestSapiens(data.cookie, getTarefa);
                    // Resolve a Promise com a resposta
                    resolve(response);
                } catch (error) {
                    // Rejeita a Promise em caso de erro
                    reject(error);
                }
            }, 6000);
        });
    }
}
