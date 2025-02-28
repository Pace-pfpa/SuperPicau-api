import { getTarefaFacade } from ".";
import { EtiquetaService } from "../UpdateEtiqueta/EtiquetaService";
import { ITarefaResponse } from "./dtos";

export class TarefaService {
    constructor(
        private readonly etiquetaService: EtiquetaService
    ) {}

    async buscarTarefa(
        cookie: string, 
        usuarioId: string, 
        etiqueta: string,
        tarefaId: number
    ): Promise<ITarefaResponse[]> {
        try {
            const tarefas = await getTarefaFacade.getTarefa(cookie, usuarioId, etiqueta);
            if (tarefas.length === 0) {
                await this.etiquetaService.aviso(cookie, "TAREFA NÃO ENCONTRADA", tarefaId);
                throw new Error("TAREFA NÃO ENCONTRADA");
            }
            return tarefas;
        } catch (error) {
            console.error("Erro ao buscar tarefa:", error.message);
            throw error;
        }
    }
}