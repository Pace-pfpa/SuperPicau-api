import { JSDOMType } from "../../shared/dtos/JSDOM";
import { buscarSislabraCobrado } from "../Cobranca/utils/buscarSislabraCobrado";
import { ResponseArvoreDeDocumentoDTO } from "../GetArvoreDocumento";
import { EtiquetaService } from "../UpdateEtiqueta/EtiquetaService";

export class SislabraService {
    constructor(
        private readonly etiquetaService: EtiquetaService
    ) {}

    async buscarSislabraCobrado(
        documentos: ResponseArvoreDeDocumentoDTO[], 
        cookie: string,
        tarefaId: number
    ): Promise<JSDOMType> {
        try {
            const { sislabraCobrado } = await buscarSislabraCobrado(documentos, cookie);
            if (!sislabraCobrado) {
                await this.etiquetaService.aviso(cookie, "SISLABRA DO REQUERIDO NÃO ENCONTRADO", tarefaId);
                throw new Error("SISLABRA NÃO EXISTE");
            }
            return sislabraCobrado;
        } catch (error) {
            console.error("Erro ao buscar Sislabra:", error.message);
            throw error;
        }
    }
}