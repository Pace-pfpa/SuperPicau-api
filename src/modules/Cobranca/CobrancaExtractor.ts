import { autenticarUsuarioFacade } from "../Autenticacao";
import { GetArvoreDocumentoDTO, GetArvoreDocumentoFacade } from "../GetArvoreDocumento";
import { verificarECorrigirCapa } from "../GetCapaDoPassiva/utils";
import { atualizarEtiquetaAviso } from "../GetInformationFromSapiensForPicaPau/utils";
import { getTarefaFacade } from "../GetTarefa";
import { ICobrancaDTO } from "./interfaces/ICobrancaDTO";
import { ICobrancaExtracted } from "./interfaces/ICobrancaExtracted";
import { buscarSislabraCobrado } from "./utils/buscarSislabraCobrado";

export class CobrancaExtractor {
    async execute(data: ICobrancaDTO): Promise<ICobrancaExtracted> {
        try {
            const { cookie, usuario } = await autenticarUsuarioFacade.autenticarUsuario(data.login);
            const tarefas = await getTarefaFacade.getTarefa(cookie, usuario.id, data.etiqueta);
            const tarefaId = data.tarefa.id;

            if (!tarefas) {
                throw new Error("TAREFA NÃO ENCONTRADA");
            } else if (!tarefas[0].pasta.processoJudicial) {
                await atualizarEtiquetaAviso(cookie, "PICAPAU NÃO CONSEGUIU LER", tarefaId);
                throw new Error("TAREFA NÃO ENCONTRADA");
            }

            const objectGetArvoreDocumento: GetArvoreDocumentoDTO = {
                nup: data.tarefa.pasta.NUP,
                chave: data.tarefa.pasta.chaveAcesso,
                cookie,
                tarefa_id: data.tarefa.id
            };

            const arrayDeDocumentos = await GetArvoreDocumentoFacade(objectGetArvoreDocumento);
            if (!arrayDeDocumentos) {
                await atualizarEtiquetaAviso(cookie, "ERRO AO BUSCAR DOCUMENTOS", tarefaId);
                throw new Error("ERRO AO BUSCAR DOCUMENTOS");
            }

            const capaFormatada = await verificarECorrigirCapa(data.tarefa.pasta.NUP, cookie);
            if (!capaFormatada) {
                await atualizarEtiquetaAviso(cookie, "CAPA NÃO ENCONTRADA NO PROCESSO", tarefaId)
                throw new Error("CAPA NÃO ENCONTRADA");
            }

            const { sislabraCobrado } = await buscarSislabraCobrado(arrayDeDocumentos, cookie);

            if (!sislabraCobrado) {
                await atualizarEtiquetaAviso(cookie, "SISLABRA DO REQUERIDO NÃO ENCONTRADO", tarefaId);
                throw new Error("SISLABRA NÃO EXISTE");
            }
            
            return {
                capa: capaFormatada,
                sislabra: sislabraCobrado
            }
        } catch (error) {
            console.error('Erro no extrator do Cobrança: ', error.message);
            throw error;
        }
    }
}