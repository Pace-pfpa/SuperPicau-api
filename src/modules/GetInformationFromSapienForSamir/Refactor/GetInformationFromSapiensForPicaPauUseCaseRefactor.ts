import { IGetArvoreDocumentoDTO } from "../../../DTO/GetArvoreDocumentoDTO";
import { IGetInformationsFromSapiensDTO } from "../../../DTO/GetInformationsFromSapiensDTO";
import { IInformacoesProcessoDTO } from "../../../DTO/IInformacoesProcessoDTO";
import { ExecuteReturnType, IInformacoesProcessoLoasDTO } from "../../../DTO/IInformacoesProcessoLoasDTO";
import { IInfoUploadDTO } from "../../../DTO/IInfoUploadDTO";
import { ResponseArvoreDeDocumento } from "../../../sapiensOperations/response/ResponseArvoreDeDocumento";
import { getTarefaUseCase } from "../../GetTarefa";
import { buscarTableCpf } from "../helps/procurarTableCpf";
import { autenticarUsuario } from "./helps/autenticarUsuario";
import { buscarArvoreDeDocumentos } from "./helps/buscarArvoreDeDocumentos";
import { processarDossie } from "./helps/processarDossie";
import { verificarECorrigirCapa } from "./helps/verificarECorrigirCapa";
import { atualizarEtiquetaAviso } from "./utils/atualizarEtiquetaAviso";
import { buscarDossieSocial } from "./utils/buscarDossieSocial";
import { buscarSislabraLOAS } from "./utils/buscarSislabraLOAS";
import { buscarSislabraRuralMaternidade } from "./utils/buscarSislabraRuralMaternidade";
import { verificarEAtualizarDossie } from "./utils/verificarEAtualizarDossie";
import { verificarGeracaoDossie } from "./utils/verificarGeracaoDossie";

export class GetInformationFromSapiensForPicaPauUseCaseRefactor {
    
    async execute(data: IGetInformationsFromSapiensDTO): Promise<ExecuteReturnType> {

        // 1. Autenticação e obtenção de usuário
        const { cookie, usuario } = await autenticarUsuario(data);
        const usuario_id = `${usuario[0].id}`;
        const usuario_nome = `${usuario[0].nome}`;
        
        try {

            const tipo_triagem = data.readDosprevAge;

            // 2. Busca da tarefa com base na etiqueta
            const tarefas = await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta: data.etiqueta });

            const tarefaId = data.tarefa.id;
            const tarefaPastaID = tarefas[0].pasta_id;

            if (!tarefas) {
                return { warning: "TAREFA NÃO ENCONTRADA" };
            }
            
            console.log("SÓ OS LOUCOS SABEM")

            // 3. Criação do objeto de busca da árvore de documentos
            const objectGetArvoreDocumento: IGetArvoreDocumentoDTO = {
                nup: data.tarefa.pasta.NUP,
                chave: data.tarefa.pasta.chaveAcesso,
                cookie,
                tarefa_id: data.tarefa.id
            };

            // 4. Busca da árvore de documentos
            const arrayDeDocumentos: ResponseArvoreDeDocumento[] | Error = await buscarArvoreDeDocumentos(objectGetArvoreDocumento);
            if (arrayDeDocumentos instanceof Error) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV COM FALHA NA GERAÇÃO", tarefaId);
                return { warning: "DOSPREV COM FALHA NA PESQUISA" }
            }

            // 5. Verificação e busca da capa
            const capaFormatada = await verificarECorrigirCapa(data, cookie);
            const cpfCapa = buscarTableCpf(capaFormatada);
            if (!cpfCapa) {
                await atualizarEtiquetaAviso(cookie, "CPF NÃO ENCONTRADO - (GERAR NOVO DOSSIE)", tarefaId)
                return { warning: `CPF NÃO ENCONTRADO -` };
            }

            // 6. Processamento dos dossiês
            const { arrayDeDossiesNormais, arrayDeDossiesSuper } = await processarDossie(arrayDeDocumentos);
            if (!arrayDeDossiesNormais && !arrayDeDossiesSuper) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV NÃO EXISTE", tarefaId)
                return { warning: `DOSPREV NÃO EXISTE` };
            }

            // 7. Identificação do dossiê do requerente (normal, super ou inexistente)
            const { dosprevPoloAtivo, isDosprevPoloAtivoNormal } = await this.identificarDossieAtivo(arrayDeDossiesNormais, arrayDeDossiesSuper, cpfCapa, cookie);
            
            if (!dosprevPoloAtivo) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV NÃO EXISTE", tarefaId);
                return { warning: `DOSPREV NÃO EXISTE` };
            }

            // 8. Verificação de falhas na geração do dossiê
            const falhaNaGeracao = await verificarGeracaoDossie(dosprevPoloAtivo, cookie);
            if (falhaNaGeracao instanceof Error) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV COM FALHA NA GERAÇÃO", tarefaId);
                return { warning: "DOSPREV COM FALHA NA GERAÇÃO" }
            }

            // 9. Busca do cadúnico
            let dossieSocialInfo = null;
            dossieSocialInfo = await buscarDossieSocial(arrayDeDocumentos, cookie, cpfCapa);
            if (dossieSocialInfo instanceof Error) {
                dossieSocialInfo = null;
            }

            // 10. Coletar informações de upload minuta
            const infoUpload: IInfoUploadDTO = {
                usuario_nome: usuario_nome,
                numeroProcesso: `${tarefas[0].pasta.processoJudicial.numero}`,
                nup: data.tarefa.pasta.NUP,
                tarefa_id: `${tarefas[0].id}`,
                pasta_id: `${tarefas[0].pasta.id}`,
                usuario_setor: `${tarefas[0].setorResponsavel_id}`,
                interessados: tarefas[0].pasta.interessados
            }
            
            // 11. Montar um objeto com todas as informações necessárias
            if (tipo_triagem === 2) {
                
                // 12. Busca do SISLABRA LOAS
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

                // 13. Busca do SISLABRA NÃO LOAS
                const { sislabraPoloAtivo, sislabraConjuge } = await buscarSislabraRuralMaternidade(arrayDeDocumentos);
                if (!sislabraPoloAtivo) {
                    await atualizarEtiquetaAviso(cookie, "SISLABRA (AUTOR) e (CÔNJUGE) NÃO EXISTE", tarefaId);
                    return { warning: "SISLABRA NÃO EXISTE" }
                }

                const informacoesProcesso: IInformacoesProcessoDTO = {
                    tarefaId,
                    cookie,
                    tipo_triagem,
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
            console.log("Erro na triagem:", error);
            return { warning: error.message || "Erro desconhecido" };
        }
    }

    async identificarDossieAtivo(
        arrayDeDossiesNormais: any[], arrayDeDossiesSuper: any[], cpfCapa: string, cookie: string
    ): Promise<{ dosprevPoloAtivo: any, isDosprevPoloAtivoNormal: boolean } | any> {

        let dosprevPoloAtivo: any = null;
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
                    isDosprevPoloAtivoNormal = false;
    
            } else {
                    const dossieIsvalid = await verificarEAtualizarDossie(cpfCapa, cookie, arrayDeDossiesNormais, arrayDeDossiesSuper);
    
                    if (dossieIsvalid instanceof Error || !dossieIsvalid) {
                        throw new Error('DOSPREV NÃO EXISTE');
                    }
    
                    if (dossieIsvalid[1] === 0) {
                        isDosprevPoloAtivoNormal = true;
                    } else if (dossieIsvalid[1] === 1) {
                        isDosprevPoloAtivoNormal = false;
                    }
            
                    dosprevPoloAtivo = dossieIsvalid[0];
            }
    
            return { dosprevPoloAtivo, isDosprevPoloAtivoNormal };
        } catch (error) {
            console.log("Erro na identificação do Dossiê");
            return { warning: error.message || "Erro desconhecido" };
        }

    }
}
