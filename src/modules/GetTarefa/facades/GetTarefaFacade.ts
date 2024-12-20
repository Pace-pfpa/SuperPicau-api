import { getTarefaUseCase } from "..";
import { ITarefaResponse, Minuta } from "../dtos";


export class GetTarefaFacade {
  async getTarefa(cookie: string, usuario_id: string, etiqueta: string): Promise<ITarefaResponse[]> {
    try {
        return await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta });
      } catch (error) {
        throw new Error(`Erro ao obter tarefa: ${error.message}`);
      }
  }

  async getMinutas(cookie: string, usuario_id: string, etiqueta: string): Promise<Minuta[]> {
    try {
        const tarefa = await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta });
        return tarefa[0].minutas.reverse();
    } catch (error) {
        throw new Error(`Erro ao obter minutas: ${error.message}`);
    }
  }
}
