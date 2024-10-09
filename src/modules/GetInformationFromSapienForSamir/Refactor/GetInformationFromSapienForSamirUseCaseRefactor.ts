import { IGetArvoreDocumentoDTO } from "../../../DTO/GetArvoreDocumentoDTO";
import { IGetInformationsFromSapiensDTO } from "../../../DTO/GetInformationsFromSapiensDTO";
import { getTarefaUseCase } from "../../GetTarefa";
import { updateEtiquetaUseCase } from "../../UpdateEtiqueta";
import { buscarTableCpf } from "../helps/procurarTableCpf";
import { autenticarUsuario } from "./helps/autenticarUsuario";
import { buscarArvoreDeDocumentos } from "./helps/buscarArvoreDeDocumentos";
import { processarDossie } from "./helps/processarDossie";
import { verificarECorrigirCapa } from "./helps/verificarECorrigirCapa";
import { ProcessoBase } from "./ProcessoBase";
import { ProcessoLoas } from "./ProcessoLoas";
import { ProcessoMaternidade } from "./ProcessoMaternidade";
import { ProcessoRural } from "./ProcessoRural";

export class GetInformationFromSapienForSamirUseCaseRefactor {
    
    async execute(data: IGetInformationsFromSapiensDTO): Promise<any> {
        let response: string = '';

        // 1. Autenticação e obtenção de usuário
        const { cookie, usuario } = await autenticarUsuario(data);
        const usuario_id = `${usuario[0].id}`;
        
        try {
            // 2. Busca da tarefa com base na etiqueta
            const tarefas = await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta: data.etiqueta });
            const nupInicio = tarefas[0].pasta.NUP;

            // 3. Criação do objeto de busca da árvore de documentos
            const objectGetArvoreDocumento: IGetArvoreDocumentoDTO = {
                nup: data.tarefa.pasta.NUP,
                chave: data.tarefa.pasta.chaveAcesso,
                cookie,
                tarefa_id: data.tarefa.id
            };

            // 4. Busca da árvore de documentos
            const arrayDeDocumentos = await buscarArvoreDeDocumentos(objectGetArvoreDocumento);

            // 5. Verificação e busca da capa
            const capaFormatada = await verificarECorrigirCapa(data, cookie);
            const cpfCapa = buscarTableCpf(capaFormatada);

            if (!cpfCapa) {
                await updateEtiquetaUseCase.execute({ cookie, etiqueta: `AVISO: CPF NÃO ENCONTRADO - (GERAR NOVO DOSSIE)`, tarefaId: data.tarefa.id });
                return { erro: `CPF NÃO ENCONTRADO -` };
            }

            // 6. Processamento do dossiê
            const { dossieNormal, superDossie } = await processarDossie(arrayDeDocumentos);

            // Atualizar o response dependendo do resultado
            if (!dossieNormal && !superDossie) {
                response += " DOSPREV NÃO EXISTE -";
            }

            return { response };

        } catch (error) {
            console.log("Erro no processamento:", error);
            return { warning: error.message || "Erro desconhecido" };
        }
    }
}
