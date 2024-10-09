import { IGetArvoreDocumentoDTO } from "../../../DTO/GetArvoreDocumentoDTO";
import { IGetInformationsFromSapiensDTO } from "../../../DTO/GetInformationsFromSapiensDTO";
import { ResponseArvoreDeDocumento } from "../../../sapiensOperations/response/ResponseArvoreDeDocumento";
import { getArvoreDocumentoUseCase } from "../../GetArvoreDocumento";
import { getUsuarioUseCase } from "../../GetUsuario";
import { loginUseCase } from "../../LoginUsuario";
import { updateEtiquetaUseCase } from "../../UpdateEtiqueta";

// ProcessoBase.ts
export class ProcessoBase {
    protected cookie: string;
    protected usuario_id: string;
    protected tarefaId: string;
    protected arrayDeDocumentos: ResponseArvoreDeDocumento[];

    constructor(tarefaId: string) {
        this.tarefaId = tarefaId;
    }

    // Método de inicialização para carregar dados assíncronos
    static async inicializar(data: IGetInformationsFromSapiensDTO): Promise<ProcessoBase> {
        const instance = new ProcessoBase(data.tarefa.id);
        instance.cookie = await loginUseCase.execute(data.login);
        const usuario = await getUsuarioUseCase.execute(instance.cookie);
        instance.usuario_id = usuario[0].id;
        return instance;
    }

    async buscarDocumentos(tarefaId: string, data: IGetInformationsFromSapiensDTO): Promise<ResponseArvoreDeDocumento[]> {
        const objectGetArvoreDocumento: IGetArvoreDocumentoDTO = {
            nup: data.tarefa.pasta.NUP,
            chave: data.tarefa.pasta.chaveAcesso,
            cookie: this.cookie,
            tarefa_id: tarefaId
        };

        return (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();
    }

    async atualizarEtiqueta(etiqueta: string): Promise<void> {
        await updateEtiquetaUseCase.execute({ cookie: this.cookie, etiqueta, tarefaId: this.tarefaId });
    }

    // Outros métodos comuns a todos os processos
}
