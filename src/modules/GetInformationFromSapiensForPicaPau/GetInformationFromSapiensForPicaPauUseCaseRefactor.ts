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
        verificarEAtualizarDossie, 
        verificarGeracaoDossie } from "./utils";

export class GetInformationFromSapiensForPicaPauUseCaseRefactor {
    
    async execute(data: GetInformationsFromSapiensDTO): Promise<ExecuteReturnType> {

        const { cookie, usuario } = await autenticarUsuarioFacade.autenticarUsuario(data);
        const usuario_id = `${usuario[0].id}`;
        const usuario_nome = usuario[0].nome;
        const usuario_unidade = usuario[0].colaborador.lotacoes[0].setor.unidade.nome;
        const usuario_setor = usuario[0].colaborador.lotacoes[0].setor.nome;
        const usuario_setor_endereco = usuario[0].colaborador.lotacoes[0].setor.endereco;
        const usuario_cargo = usuario[0].assinaturaHTML;
        const partes = usuario_cargo?.split('\n');
        const cargo = partes[1]?.trim();
        
        try {

            const tipo_triagem = data.readDosprevAge;
            const tarefaId = data.tarefa.id;

            const tarefas = await getTarefaFacade.getTarefa(cookie, usuario_id, data.etiqueta);
            
            if (!tarefas) {
                return { warning: "TAREFA NÃO ENCONTRADA" };
            } else if (!tarefas[0].pasta.processoJudicial) {
                await atualizarEtiquetaAviso(cookie, "PICAPAU NÃO CONSEGUIU LER", tarefaId);
                return { warning: "TAREFA NÃO ENCONTRADA" };
            }

            const tarefaPastaID = tarefas[0].pasta_id
            
            console.log("SÓ OS LOUCOS SABEM");

            const objectGetArvoreDocumento: GetArvoreDocumentoDTO = {
                nup: data.tarefa.pasta.NUP,
                chave: data.tarefa.pasta.chaveAcesso,
                cookie,
                tarefa_id: data.tarefa.id
            };

            const arrayDeDocumentos = await GetArvoreDocumentoFacade(objectGetArvoreDocumento);
            if (arrayDeDocumentos instanceof Error) {
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

            if ('warning' in response) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV POLO ATIVO NÃO ENCONTRADO", tarefaId);
                return { warning: `DOSPREV NÃO EXISTE` };
            }

            const { dosprevPoloAtivo, isDosprevPoloAtivoNormal } = response;

            if (!dosprevPoloAtivo) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV POLO ATIVO NÃO ENCONTRADO", tarefaId);
                return { warning: `DOSPREV NÃO EXISTE` };
            }

            const falhaNaGeracao = await verificarGeracaoDossie(dosprevPoloAtivo, cookie);
            if (falhaNaGeracao instanceof Error) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV COM FALHA NA GERAÇÃO", tarefaId);
                return { warning: "DOSPREV COM FALHA NA GERAÇÃO" }
            }

            let dossieSocialInfo: IDossieSocialInfo = null;
            dossieSocialInfo = await buscarDossieSocial(arrayDeDocumentos, cookie, cpfCapa);
            if (dossieSocialInfo instanceof Error) {
                dossieSocialInfo = null;
            }

            const infoUpload: IInfoUploadDTO = {
                usuario_id: usuario_id,
                usuario_nome: usuario_nome,
                etiqueta: data.etiqueta,
                numeroProcesso: tarefas[0].pasta.processoJudicial.numero,
                nup: data.tarefa.pasta.NUP,
                tarefa_id: tarefas[0].id,
                pasta_id: tarefas[0].pasta.id,
                usuario_setor: tarefas[0].setorResponsavel_id,
                interessados: tarefas[0].pasta.interessados,
                usuario_unidade: usuario_unidade,
                usuario_setor_nome: usuario_setor,
                usuario_setor_endereco: usuario_setor_endereco,
                usuario_cargo: cargo,
                infoMinuta: informacoesRequerenteRequerido,
            }
            
            if (tipo_triagem === 2) {
                
                const { sislabraPoloAtivo, sislabraGF } = await buscarSislabraLOAS(arrayDeDocumentos);
                if (!sislabraPoloAtivo) {
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
                    sislabraGF,
                    dossieSocialInfo,
                    arrayDeDossiesNormais,
                    arrayDeDossiesSuper
                }

                return [informacoesProcesso, 'LOAS'];
            } else {

                const { sislabraPoloAtivo, sislabraConjuge } = await buscarSislabraRuralMaternidade(arrayDeDocumentos);
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
                    dosprevPoloAtivo,
                    isDosprevPoloAtivoNormal,
                    sislabraPoloAtivo,
                    sislabraConjuge, 
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
    ): Promise<IdentificarDossieAtivoType> {

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
            console.error("Erro na identificação do Dossiê" + error);
            return { warning: error.message || "Erro desconhecido" };
        }

    }
}
