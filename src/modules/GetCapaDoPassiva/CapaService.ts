import { JSDOMType } from "../../shared/dtos/JSDOM";
import { EtiquetaService } from "../UpdateEtiqueta/EtiquetaService";
import { verificarECorrigirCapa } from "./utils";

export class CapaService {
    constructor(
        private readonly etiquetaService: EtiquetaService
    ) {}

    async buscarCapa(
        nup: string, 
        cookie: string,
        tarefaId: number
    ): Promise<JSDOMType> {
        try {
            const capa = await verificarECorrigirCapa(nup, cookie);
            if (!capa) {
                await this.etiquetaService.aviso(cookie, "CAPA NÃO ENCONTRADA NO PROCESSO", tarefaId);
                throw new Error("CAPA NÃO ENCONTRADA");
            }
            return capa;
        } catch (error) {
            console.error("Erro ao verificar capa:", error.message);
            throw error;
        }
    }
}