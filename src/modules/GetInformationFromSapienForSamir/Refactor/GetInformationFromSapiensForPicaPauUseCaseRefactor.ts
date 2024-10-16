const { JSDOM } = require('jsdom');
import { IGetArvoreDocumentoDTO } from "../../../DTO/GetArvoreDocumentoDTO";
import { IGetInformationsFromSapiensDTO } from "../../../DTO/GetInformationsFromSapiensDTO";
import { IInformacoesProcessoDTO } from "../../../DTO/IInformacoesProcessoDTO";
import { IInformacoesProcessoLoasDTO } from "../../../DTO/IInformacoesProcessoLoasDTO";
import { getDocumentoUseCase } from "../../GetDocumento";
import { getTarefaUseCase } from "../../GetTarefa";
import { buscarTableCpf } from "../helps/procurarTableCpf";
import { cadUnico } from "../loas/CadUnico";
import { autenticarUsuario } from "./helps/autenticarUsuario";
import { buscarArvoreDeDocumentos } from "./helps/buscarArvoreDeDocumentos";
import { processarDossie } from "./helps/processarDossie";
import { verificarECorrigirCapa } from "./helps/verificarECorrigirCapa";
import { atualizarEtiquetaAviso } from "./utils/atualizarEtiquetaAviso";
import { verificarEAtualizarDossie } from "./utils/verificarEAtualizarDossie";

export class GetInformationFromSapiensForPicaPauUseCaseRefactor {
    
    async execute(data: IGetInformationsFromSapiensDTO): Promise<any> {

        // 1. Autenticação e obtenção de usuário
        const { cookie, usuario } = await autenticarUsuario(data);
        const usuario_id = `${usuario[0].id}`;
        
        try {

            const tipo_triagem = data.readDosprevAge;

            // 2. Busca da tarefa com base na etiqueta
            const tarefas = await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta: data.etiqueta });

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
            const arrayDeDocumentos = await buscarArvoreDeDocumentos(objectGetArvoreDocumento);
            if (arrayDeDocumentos instanceof Error) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV COM FALHA NA GERAÇÃO", data.tarefa.id);
                return { warning: "DOSPREV COM FALHA NA PESQUISA" }
            }

            // 5. Verificação e busca da capa
            const capaFormatada = await verificarECorrigirCapa(data, cookie);
            const cpfCapa = buscarTableCpf(capaFormatada);
            if (!cpfCapa) {
                await atualizarEtiquetaAviso(cookie, "CPF NÃO ENCONTRADO - (GERAR NOVO DOSSIE)", data.tarefa.id)
                return { warning: `CPF NÃO ENCONTRADO -` };
            }

            // 6. Processamento dos dossiês
            const { arrayDeDossiesNormais, arrayDeDossiesSuper } = await processarDossie(arrayDeDocumentos);
            if (!arrayDeDossiesNormais && !arrayDeDossiesSuper) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV NÃO EXISTE", data.tarefa.id)
                return { warning: `DOSPREV NÃO EXISTE -` };
            }

            // 7. Identificação do dossiê do requerente (normal, super ou inexistente)
            const { dosprevPoloAtivo, isDosprevPoloAtivoNormal } = await this.identificarDossieAtivo(arrayDeDossiesNormais, arrayDeDossiesSuper, cpfCapa, cookie, data.tarefa.id);
            
            if (!dosprevPoloAtivo) {
                await atualizarEtiquetaAviso(cookie, "DOSPREV NÃO EXISTE", data.tarefa.id);
                return { warning: `DOSPREV NÃO EXISTE -` };
            }

            // 8. Busca do cadúnico

            let dossieSocialInfo = null;
            const dossieSocial = arrayDeDocumentos.find(Documento => Documento.documentoJuntado.tipoDocumento.sigla === "DOSOC");

            if (dossieSocial) {
                const idDossieSocialParaPesquisa = dossieSocial.documentoJuntado.componentesDigitais[0].id;
                const paginaDossieSocial = await getDocumentoUseCase.execute({ cookie, idDocument: idDossieSocialParaPesquisa });

                const paginaDossieSocialFormatada = new JSDOM(paginaDossieSocial);
                const medicamentos = await cadUnico.execute(paginaDossieSocialFormatada);

                const gastoComMedicamentos = medicamentos !== '0.00';
                const grupoFamiliarCpfs = await cadUnico.grupoFamiliar(paginaDossieSocialFormatada, cpfCapa);

                dossieSocialInfo = { gastoComMedicamentos, grupoFamiliarCpfs };
            }

            // 9. Montar um objeto com todas as informações necessárias

            if (tipo_triagem === 2) {
                const informacoesProcesso: IInformacoesProcessoLoasDTO = {
                    usuario_id,
                    tipo_triagem,
                    cpfCapa,
                    arrayDeDocumentos,
                    dosprevPoloAtivo,
                    isDosprevPoloAtivoNormal,
                    dossieSocialInfo,
                    arrayDeDossiesNormais,
                    arrayDeDossiesSuper
                }
                return [informacoesProcesso, 'LOAS'];
            } else {
                const informacoesProcesso: IInformacoesProcessoDTO = {
                    usuario_id,
                    tipo_triagem,
                    cpfCapa,
                    arrayDeDocumentos,
                    dosprevPoloAtivo,
                    isDosprevPoloAtivoNormal
                }
                return [informacoesProcesso, 'RURAL/MATERNIDADE'];
            }

        } catch (error) {
            console.log("Erro na triagem:", error);
            return { warning: error.message || "Erro desconhecido" };
        }
    }

    async identificarDossieAtivo(
        arrayDeDossiesNormais: any[], arrayDeDossiesSuper: any[], cpfCapa: string, cookie: string, tarefaId: string
    ): Promise<{ dosprevPoloAtivo: any, isDosprevPoloAtivoNormal: boolean } | any> {

        let dosprevPoloAtivo: any = null;
        let isDosprevPoloAtivoNormal: boolean = false;

        try {
            if (arrayDeDossiesNormais && !arrayDeDossiesSuper) {
                    const dossieIsvalid = await verificarEAtualizarDossie(cpfCapa, cookie, arrayDeDossiesNormais, null, tarefaId);
    
                    if (dossieIsvalid instanceof Error || !dossieIsvalid) {
                        throw new Error('DOSPREV NÃO EXISTE');
                    }
    
                    dosprevPoloAtivo = dossieIsvalid[0];
                    isDosprevPoloAtivoNormal = true;
    
            } else if (!arrayDeDossiesNormais && arrayDeDossiesSuper) {
                    const dossieIsvalid = await verificarEAtualizarDossie(cpfCapa, cookie, null, arrayDeDossiesSuper, tarefaId);
    
                    if (dossieIsvalid instanceof Error || !dossieIsvalid) {
                        throw new Error('DOSPREV NÃO EXISTE');
                    }
    
                    dosprevPoloAtivo = dossieIsvalid[0];
                    isDosprevPoloAtivoNormal = false;
    
            } else {
                    const dossieIsvalid = await verificarEAtualizarDossie(cpfCapa, cookie, arrayDeDossiesNormais, arrayDeDossiesSuper, tarefaId);
    
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
