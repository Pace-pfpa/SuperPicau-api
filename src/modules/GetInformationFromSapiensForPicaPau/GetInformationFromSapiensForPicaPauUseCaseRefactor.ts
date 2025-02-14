import { autenticarUsuarioFacade } from "../Autenticacao";
import { GetArvoreDocumentoDTO, GetArvoreDocumentoFacade, ResponseArvoreDeDocumentoDTO } from "../GetArvoreDocumento";
import { verificarECorrigirCapa, buscarTableCpf } from "../GetCapaDoPassiva/utils";
import { getTarefaFacade } from "../GetTarefa";
import { buscarInfoForMinuta } from "./BuscarImpedimentos/utils/buscarInfoForMinuta";
import { ExecuteReturnType,
        GetInformationsFromSapiensDTO,
        IdentificarDossieAtivoType,
        IDossieSocialInfo,
        IInformacoesProcessoDTO,
        IInformacoesProcessoLoasDTO, 
        IInfoUploadDTO } from "./dto";
import { processarDossie } from "./helps/processarDossie";
import { atualizarEtiquetaAviso,
        buscarDossieSocial,
        buscarSislabraLOAS, 
        buscarSislabraRuralMaternidade, 
        verificarEAtualizarDossie } from "./utils";
import { dossieExtractorMain } from "./utils/dossieExtractorMain";

export class GetInformationFromSapiensForPicaPauUseCaseRefactor {
    
    async execute(data: GetInformationsFromSapiensDTO): Promise<ExecuteReturnType> {
        try {
            const { cookie, usuario } = await autenticarUsuarioFacade.autenticarUsuario(data);

            const tipo_triagem = data.readDosprevAge;
            const tarefaId = data.tarefa.id;

            const tarefas = await getTarefaFacade.getTarefa(cookie, usuario.id, data.etiqueta);
            
            if (!tarefas) {
                return { warning: "TAREFA NÃO ENCONTRADA" };
            } else if (!tarefas[0].pasta.processoJudicial) {
                await atualizarEtiquetaAviso(cookie, "PICAPAU NÃO CONSEGUIU LER", tarefaId);
                return { warning: "TAREFA NÃO ENCONTRADA" };
            }

            const tarefaPastaID = tarefas[0].pasta_id;
            
            console.log("SÓ OS LOUCOS SABEM");

            const objectGetArvoreDocumento: GetArvoreDocumentoDTO = {
                nup: data.tarefa.pasta.NUP,
                chave: data.tarefa.pasta.chaveAcesso,
                cookie,
                tarefa_id: data.tarefa.id
            };

            const arrayDeDocumentos = await GetArvoreDocumentoFacade(objectGetArvoreDocumento);
            if (!arrayDeDocumentos) {
                await atualizarEtiquetaAviso(cookie, "ERRO AO BUSCAR DOCUMENTOS", tarefaId);
                return { warning: "DOSPREV COM FALHA NA PESQUISA" }
            }
 
            const capaFormatada = await verificarECorrigirCapa(data, cookie);
            const cpfCapa = buscarTableCpf(capaFormatada);
            if (!cpfCapa) {
                await atualizarEtiquetaAviso(cookie, "CPF NÃO ENCONTRADO NA CAPA", tarefaId)
                return { warning: `CPF NÃO ENCONTRADO` };
            }

            const informacoesRequerenteRequerido = await buscarInfoForMinuta(capaFormatada);

            const { arrayDeDossiesNormais, arrayDeDossiesSuper } = await processarDossie(arrayDeDocumentos);
            if (!arrayDeDossiesNormais && !arrayDeDossiesSuper) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV NÃO EXISTE", tarefaId)
                return { warning: `DOSPREV NÃO EXISTE` };
            }

            const response = await this.identificarDossieAtivo(arrayDeDossiesNormais, arrayDeDossiesSuper, cpfCapa, cookie);

            if (response instanceof Error) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV POLO ATIVO NÃO ENCONTRADO", tarefaId);
                return { warning: `DOSPREV NÃO EXISTE` };
            }

            const { dosprevPoloAtivo, isDosprevPoloAtivoNormal } = response;

            const dosprevExtracted = await dossieExtractorMain(dosprevPoloAtivo, isDosprevPoloAtivoNormal, cookie);

            if (dosprevExtracted.isAviso) {
                await atualizarEtiquetaAviso(cookie, dosprevExtracted.avisoMessage, tarefaId);
                return { warning: `DOSPREV IMPEDITIVO` };
            }

            let dossieSocialInfo: IDossieSocialInfo = null;
            dossieSocialInfo = await buscarDossieSocial(arrayDeDocumentos, cookie, cpfCapa);
            if (dossieSocialInfo instanceof Error) {
                dossieSocialInfo = null;
            }

            const infoUpload: IInfoUploadDTO = {
                usuario,
                etiqueta: data.etiqueta,
                numeroProcesso: tarefas[0].pasta.processoJudicial.numero,
                nup: data.tarefa.pasta.NUP,
                tarefa_id: tarefas[0].id,
                pasta_id: tarefas[0].pasta.id,
                usuario_setor: tarefas[0].setorResponsavel_id,
                interessados: tarefas[0].pasta.interessados,
                infoMinuta: informacoesRequerenteRequerido,
                subirMinuta: data.subirMinuta
            }
            
            if (tipo_triagem === 2) {
                
                const { sislabraPoloAtivo, sislabraGFInfo } = await buscarSislabraLOAS(arrayDeDocumentos, dossieSocialInfo, cookie);
                if (sislabraPoloAtivo.length === 0) {
                    await atualizarEtiquetaAviso(cookie, "SISLABRA (AUTOR) e (CÔNJUGE) NÃO EXISTE", tarefaId);
                    return { warning: "SISLABRA NÃO EXISTE" }
                }

                const informacoesProcesso: IInformacoesProcessoLoasDTO = {
                    tarefaId,
                    tarefaPastaID,
                    cookie,
                    tipo_triagem,
                    isUserAdmin: data.admin,
                    capaFormatada,
                    cpfCapa,
                    infoUpload,
                    dosprevPoloAtivo,
                    isDosprevPoloAtivoNormal,
                    sislabraPoloAtivo,
                    sislabraGFInfo,
                    dossieSocialInfo,
                    arrayDeDossiesNormais,
                    arrayDeDossiesSuper
                }

                return [informacoesProcesso, 'LOAS'];
            } else {

                const { sislabraPoloAtivo, sislabraConjuge } = await buscarSislabraRuralMaternidade(arrayDeDocumentos, cookie);
                if (!sislabraPoloAtivo) {
                    await atualizarEtiquetaAviso(cookie, "SISLABRA (AUTOR) e (CÔNJUGE) NÃO EXISTE", tarefaId);
                    return { warning: "SISLABRA NÃO EXISTE" }
                }

                const informacoesProcesso: IInformacoesProcessoDTO = {
                    tarefaId,
                    cookie,
                    tipo_triagem,
                    isUserAdmin: data.admin,
                    capaFormatada,
                    cpfCapa,
                    infoUpload,
                    dossie: {
                        dosprevPoloAtivo,
                        isDosprevPoloAtivoNormal,
                        dossieExtractedPartial: dosprevExtracted.dossiePartial,
                        dossieFormatado: dosprevExtracted.dossieFormatado
                    },
                    sislabra: {
                        sislabraPoloAtivo,
                        sislabraConjuge
                    }
                }

                return [informacoesProcesso, 'RURAL/MATERNIDADE'];
            }

        } catch (error) {
            console.error("Erro na triagem:", error);
            return { warning: error.message || "Erro desconhecido" };
        }
    }

    async identificarDossieAtivo(
        arrayDeDossiesNormais: ResponseArvoreDeDocumentoDTO[], 
        arrayDeDossiesSuper: ResponseArvoreDeDocumentoDTO[], 
        cpfCapa: string, 
        cookie: string
    ): Promise<IdentificarDossieAtivoType | Error> {

        let dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO = null;
        let isDosprevPoloAtivoNormal: boolean = false;

        try {
            if (arrayDeDossiesNormais && !arrayDeDossiesSuper) {
                    const dossieIsvalid = await verificarEAtualizarDossie(cpfCapa, cookie, arrayDeDossiesNormais, null);
    
                    if (dossieIsvalid instanceof Error || !dossieIsvalid) {
                        throw new Error('DOSPREV NÃO EXISTE');
                    }
    
                    dosprevPoloAtivo = dossieIsvalid[0];
                    isDosprevPoloAtivoNormal = true;
    
            } else if (!arrayDeDossiesNormais && arrayDeDossiesSuper) {
                    const dossieIsvalid = await verificarEAtualizarDossie(cpfCapa, cookie, null, arrayDeDossiesSuper);
    
                    if (dossieIsvalid instanceof Error || !dossieIsvalid) {
                        throw new Error('DOSPREV NÃO EXISTE');
                    }
    
                    dosprevPoloAtivo = dossieIsvalid[0];
    
            } else {
                    const dossieIsvalid = await verificarEAtualizarDossie(cpfCapa, cookie, arrayDeDossiesNormais, arrayDeDossiesSuper);
    
                    if (dossieIsvalid instanceof Error || !dossieIsvalid) {
                        throw new Error('DOSPREV NÃO EXISTE');
                    }
    
                    if (dossieIsvalid[1] === 0) {
                        isDosprevPoloAtivoNormal = true;
                    }
            
                    dosprevPoloAtivo = dossieIsvalid[0];
            }
    
            return { dosprevPoloAtivo, isDosprevPoloAtivoNormal };
        } catch (error) {
            console.error("Erro na identificação do Dossiê", error.message);
            return new Error('DOSPREV NÃO EXISTE');
        }
    }
}
