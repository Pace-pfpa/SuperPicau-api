import { EtiquetaService } from "../UpdateEtiqueta/EtiquetaService";
import { ResponseArvoreDeDocumentoDTO } from "./dtos/ResponseArvoreDocumentoDTO";
import { GetArvoreDocumentoFacade } from "./facades/GetArvoreDocumentoFacade";

export class ArvoreDocumentoService {

    constructor(
        private readonly etiquetaService: EtiquetaService
    ) {}

    async buscarArvoreDocumentos(
        cookie: string,
        nup: string,
        chave: string,
        tarefaId: number
    ): Promise<ResponseArvoreDeDocumentoDTO[]> {
        try {
            const documentos = await GetArvoreDocumentoFacade(
                { nup, chave, cookie, tarefa_id: tarefaId }
            );
            if (documentos.length === 0) {
                await this.etiquetaService.aviso(cookie, "ERRO AO BUSCAR DOCUMENTOS", tarefaId);
                throw new Error("ERRO AO BUSCAR DOCUMENTOS");
            }
            return documentos;
        } catch (error) {
            console.error("Erro ao buscar documentos:", error.message);
            throw error;
        }
    }
}
