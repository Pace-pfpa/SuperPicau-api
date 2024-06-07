const { JSDOM } = require('jsdom');
import { getUsuarioUseCase } from '../GetUsuario';
import { loginUseCase } from '../LoginUsuario';
import { getTarefaUseCase } from '../GetTarefa';
import { IGetInformationsFromSapiensDTO } from '../../DTO/GetInformationsFromSapiensDTO';
import { IGetArvoreDocumentoDTO } from '../../DTO/GetArvoreDocumentoDTO';
import { getArvoreDocumentoUseCase } from '../GetArvoreDocumento/index';
import { IInformationsForCalculeDTO } from '../../DTO/InformationsForCalcule';
import { getDocumentoUseCase } from '../GetDocumento';
import { updateEtiquetaUseCase } from '../UpdateEtiqueta';
import { getXPathText } from "../../helps/GetTextoPorXPATH";
import { ResponseArvoreDeDocumento } from '../../sapiensOperations/response/ResponseArvoreDeDocumento';
import { isValidInformationsForCalculeDTO } from './helps/validadorDeInformationsForCalculeDTO';
import { getCapaDoPassivaUseCase } from '../GetCapaDoPassiva';
import { verificarCapaTrue } from './helps/verificarCapaTrue';
import { buscarTableCpf } from './helps/procurarTableCpf';
import { superDossie } from './DossieSuperSapiens';
import { getInformationDossieForPicaPau } from './GetInformationFromDossieForPicaPau';
import { getDocumentSislabraFromSapiens } from './GetDocumentSislabraFromSapiens';
import { getInformationCapa } from './GetInformationCapa';
import { compararNup } from "./helps/ComparaNUP";
import { LoasDossieUseCase } from './loas/LoasDossieUseCase';
import { LoasSuperDossieUseCase } from './loas/LoasSuperDossieUseCase ';
import { loasDossieUseCase, loasSuperDossieUseCase } from './loas';
import { verificarDossieMaisAtual } from './helps/verificarDossieMaisAtual';
import { cadUnico } from './loas/CadUnico';
export class GetInformationFromSapienForSamirUseCase {
    
    async execute(data: IGetInformationsFromSapiensDTO): Promise<any> {
        const cookie = await loginUseCase.execute(data.login);
        const usuario = (await getUsuarioUseCase.execute(cookie));
        let impedDossie: string  = '';
        
        const usuario_id = `${usuario[0].id}`;
        let novaCapa: any = false;
        var objectDosPrev
        let response: string = '';
        let dossieNormal = false;
        let nupInicio = undefined;
        let nupFim = undefined;
        let erros = {};
        let dosprevEncontrado = false;
        
        try {
            let tarefas = await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta: data.etiqueta });
            
            nupInicio = tarefas[0].pasta.NUP
            //console.log("NupInicio: ",nupInicio)
            
            /* const tarefas = await getTarefaUseCaseNup.execute({ cookie, usuario_id, nup: data.nup }); */
            let VerificarSeAindExisteProcesso: boolean = true;
                            
                
                    
                    let superDosprevExist = false;
                    const tarefaId = data.tarefa.id;
                    const etiquetaParaConcatenar = data.tarefa.postIt
                    const objectGetArvoreDocumento: IGetArvoreDocumentoDTO = { nup: data.tarefa.pasta.NUP, chave: data.tarefa.pasta.chaveAcesso, cookie, tarefa_id: data.tarefa.id }
                    let arrayDeDocumentos: ResponseArvoreDeDocumento[];
                    
                    
                    try {
                        arrayDeDocumentos = (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();
                        let comparaNup = compararNup(nupInicio,data.tarefa.pasta.NUP)
                        
///                        
                    } catch (error) {
                        console.log("Erro ao aplicar getArvoreDocumentoUseCase!!!!");
                        (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV COM FALHA NA GERAÇAO", tarefaId }));
                        console.log('eroor1')
                        return {warning: "DOSPREV COM FALHA NA PESQUISA"}
                    }

                    



                    

                    const tcapaParaVerificar: string = await getCapaDoPassivaUseCase.execute(data.tarefa.pasta.NUP, cookie);
                    const tcapaFormatada = new JSDOM(tcapaParaVerificar)

                    const tinfoClasseExist = await verificarCapaTrue(tcapaFormatada)
                    
                    if(tinfoClasseExist){
                        
                        objectDosPrev = arrayDeDocumentos.filter(Documento => Documento.documentoJuntado.tipoDocumento.sigla == "DOSPREV" && Documento.documentoJuntado.origemDados.fonteDados === "SAT_INSS");
                        
                        
                            if(objectDosPrev.length > 0){
                                dossieNormal = true;
                                dosprevEncontrado = true;

                                var objectDosPrev2 = arrayDeDocumentos.filter(Documento => {
                                    const movimento = (Documento.movimento).split(".");
                                    return movimento[0] == "JUNTADA DOSSIE DOSSIE PREVIDENCIARIO REF";
                                });

                                
                                /* if(objectDosPrev.length > 0 && objectDosPrev2.length == 0){
                                    return {
                                        dossieType: "normal",
                                        dossie: normalDossie
                                    }
                                } */
                            
                                if(objectDosPrev2.length > 0){
                                    superDosprevExist = true;
                                }
                            
                               
                               

                                
                                /* if(objectDosPrev == undefined && objectDosPrev2 == undefined){
                                    (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV NÃO ENCONTRADO", tarefaId }));
                                    return {warning: "DOSPREV NÃO ENCONTRADO"}
                                }else if(objectDosPrev2 != undefined && objectDosPrev == undefined){
                                    objectDosPrev = objectDosPrev2;
                                    superDosprevExist = true;
                                    
                                }else if(objectDosPrev != undefined &&  objectDosPrev2 != undefined){
                                   
                                    if(objectDosPrev.numeracaoSequencial <= objectDosPrev2.numeracaoSequencial){
                                        objectDosPrev = objectDosPrev2;
                                        superDosprevExist = true;
                                        
                                    }
                                    
                                } */
                            }else{

                                var objectDosPrev2 = arrayDeDocumentos.filter(Documento => {
                                    const movimento = (Documento.movimento).split(".");
                                    return movimento[0] == "JUNTADA DOSSIE DOSSIE PREVIDENCIARIO REF";
                                });

                                if(objectDosPrev2.length > 0){
                                    dosprevEncontrado = true;
                                    superDosprevExist = true;
                                }else{

                                    response = response + " DOSPREV NÃO EXISTE -"
                                }
                                


                                /* dosprevThisTrue = false;
                                response = response + " DOSPREV NÃO EXISTE -" */
                            }
                            
                            

                    } else{
                        
                        const capaParaVerificar: string = await getCapaDoPassivaUseCase.execute(data.tarefa.pasta.NUP, cookie);
                        const capaFormatada = new JSDOM(capaParaVerificar)
                        const xpathNovaNup = "/html/body/div/div[4]/table/tbody/tr[13]/td[2]/a[1]/b"
                        const novaNup = await getXPathText(capaFormatada, xpathNovaNup)
                        const novoObjectGetArvoreDocumento: IGetArvoreDocumentoDTO = { nup: novaNup, chave: data.tarefa.pasta.chaveAcesso, cookie, tarefa_id: data.tarefa.id }
                        try { 
                            const novaNupTratada = novaNup.split("(")[0].trim().replace(/[-/.]/g, "")
                            novoObjectGetArvoreDocumento.nup = novaNupTratada
                            arrayDeDocumentos = (await getArvoreDocumentoUseCase.execute(novoObjectGetArvoreDocumento)).reverse();
                            objectDosPrev = arrayDeDocumentos.find(Documento => Documento.documentoJuntado.tipoDocumento.sigla == "DOSPREV");
    
                            if(objectDosPrev.length > 0){
                                dossieNormal = true;
                                dosprevEncontrado = true;

                                let objectDosPrev2 = arrayDeDocumentos.filter(Documento => {
                                    const movimento = (Documento.movimento).split(".");
                                    return movimento[0] == "JUNTADA DOSSIE DOSSIE PREVIDENCIARIO REF";
                                });




                                if(objectDosPrev2.length > 0){
                                    superDosprevExist = true;
                                }


                                /* if(objectDosPrev == undefined && objectDosPrev2 == undefined){
                                    (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV NÃO ENCONTRADO -", tarefaId }));
                                    return {warning: "DOSPREV NÃO ENCONTRADO"}
                                }else if(objectDosPrev2 != undefined && objectDosPrev == undefined){
                                    objectDosPrev = objectDosPrev2;
                                    superDosprevExist = true;
                                }else if(objectDosPrev != undefined &&  objectDosPrev2 != undefined){
                                    if(objectDosPrev.numeracaoSequencial < objectDosPrev2.numeracaoSequencial){
                                        objectDosPrev = objectDosPrev2;
                                        superDosprevExist = true;
                                    }
                                } */
                                
                            }else{

                                let objectDosPrev2 = arrayDeDocumentos.filter(Documento => {
                                    const movimento = (Documento.movimento).split(".");
                                    return movimento[0] == "JUNTADA DOSSIE DOSSIE PREVIDENCIARIO REF";
                                });
                            
                                if(objectDosPrev2.length > 0){
                                    superDosprevExist = true;
                                    dosprevEncontrado = true;
                                }else{
                                    response = response + " DOSPREV NÃO EXISTE -"
                                }

                                
                            }
                                


                        } catch (error) {
                            console.log(error);
                            (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV COM FALHA NA GERAÇAO", tarefaId }));
                            return {warning: "DOSPREV COM FALHA NA GERAÇAO"}
                        }
                    }

                    
                    



                    





                    

                    //Verificar a capa caso exista outra capa com os dados necessários
                    const capaParaVerificar: string = await getCapaDoPassivaUseCase.execute(data.tarefa.pasta.NUP, cookie);
                    const capaFormatada = new JSDOM(capaParaVerificar)
                    
                    const infoClasseExist = await verificarCapaTrue(capaFormatada) 
                    let capa = ""
                    if(!infoClasseExist){
                
                        const xpathNovaNup = "/html/body/div/div[4]/table/tbody/tr[13]/td[2]/a[1]/b"
                        const novaNup = await getXPathText(capaFormatada, xpathNovaNup)
                        const nupFormatada:string = (novaNup.split('(')[0]).replace(/[./-]/g, "").trim();
                        capa = (await getCapaDoPassivaUseCase.execute(nupFormatada, cookie));
                        novaCapa = new JSDOM(capa)
                    }else{
                        
                        capa = (await getCapaDoPassivaUseCase.execute(data.tarefa.pasta.NUP, cookie));
                        novaCapa = new JSDOM(capa)
                    }
                    
                    
                    
                
                    const cpfCapa = buscarTableCpf(novaCapa);
                    if(!cpfCapa){
                        (await updateEtiquetaUseCase.execute({ cookie, etiqueta: ` CPF NÃO ENCONTRADO - (GERAR NOVO DOSSIE)`, tarefaId }))
                        return {erro: ` CPF NÃO ENCONTRADO -`}
                    }

                   
                   
                    
                  
                    if(dossieNormal && !superDosprevExist){
                        const dossieIsvalid = await verificarDossieMaisAtual(cpfCapa, cookie, objectDosPrev, null);
                        

                        if(dossieIsvalid instanceof Error){
                            (await updateEtiquetaUseCase.execute({ cookie, etiqueta: `DOSPREV COM FALHA NA PESQUISA`, tarefaId }))
                            console.log('eroor2')
                            return {warning: `DOSPREV COM FALHA NA PESQUISA`}
                        }else{

                            objectDosPrev = dossieIsvalid[0]
                        }

                       



                    }else if(!dossieNormal && superDosprevExist){
                        const dossieIsvalid = await verificarDossieMaisAtual(cpfCapa, cookie, null, objectDosPrev2);
                        
                        
                        if(dossieIsvalid instanceof Error){
                            (await updateEtiquetaUseCase.execute({ cookie, etiqueta: `DOSPREV COM FALHA NA PESQUISA`, tarefaId }))
                            
                            return {warning: `DOSPREV COM FALHA NA PESQUISA`}
                        }else{
                            
                            objectDosPrev = dossieIsvalid[0]
                        }
                    }else{
                        const dossieIsvalid = await verificarDossieMaisAtual(cpfCapa, cookie, objectDosPrev, objectDosPrev2);
                        
                        if(dossieIsvalid instanceof Error){
                            (await updateEtiquetaUseCase.execute({ cookie, etiqueta: `DOSPREV COM FALHA NA PESQUISA`, tarefaId }))
                            console.log('eroor4')
                            return {warning: `DOSPREV COM FALHA NA PESQUISA`}
                        }else{
                            if(dossieIsvalid[1] == 0){
                                dossieNormal = true;
                                superDosprevExist = false;
                            }else if(dossieIsvalid[1] == 1){
                                dossieNormal = false;
                                superDosprevExist = true;
                            }
                           
                            objectDosPrev = dossieIsvalid[0]
                        }
                    }
                    



                    const informationcapa = await getInformationCapa.ImpedimentosCapa(capa);
                    if(!informationcapa){
                        response= response + " ADVOGADO FRAUDE -"
                    }
                

                    let parginaDosPrev;
                    let parginaDosPrevFormatada;
                    if(dosprevEncontrado){

                        
                        
                        if(!superDosprevExist){
                            console.log("passou")
                            //vericacao para saber se foi gerado o super dossie
                            
                            const idDosprevParaPesquisa = objectDosPrev.documentoJuntado.componentesDigitais[0].id;
                            parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });

                            parginaDosPrevFormatada = new JSDOM(parginaDosPrev); 
                            
                            if(data.readDosprevAge == 0){
                                impedDossie = await getInformationDossieForPicaPau.impeditivosRural(parginaDosPrevFormatada, parginaDosPrev);
                            }else if(data.readDosprevAge == 1){
                                impedDossie = await getInformationDossieForPicaPau.impedimentosMaternidade(parginaDosPrevFormatada, parginaDosPrev);
                            }else if(data.readDosprevAge == 2){
                                console.log("entrou")

                                const dossieSocial = arrayDeDocumentos.find(Documento => Documento.documentoJuntado.tipoDocumento.sigla == "DOSOC");

                                if (!dossieSocial) {

                                    response += " CADÚNICO -"
                                    impedDossie = await getInformationDossieForPicaPau.impeditivoLoas(parginaDosPrevFormatada);
                                    
                                } else {

                                    const idDossieSocialParaPesquisa = dossieSocial.documentoJuntado.componentesDigitais[0].id;
                                    const paginaDossieSocial = await getDocumentoUseCase.execute({ cookie, idDocument: idDossieSocialParaPesquisa });
    
                                    const paginaDossieSocialFormatada = new JSDOM(paginaDossieSocial); 
    
    
    
                                    
                                    console.log(await cadUnico.execute(paginaDossieSocialFormatada))
    
    
                                    impedDossie = await getInformationDossieForPicaPau.impeditivoLoas(parginaDosPrevFormatada);
                                }

                            }

                            /* impedDossie = await getInformationDossieForPicaPau.impedimentos(parginaDosPrevFormatada, parginaDosPrev, data.readDosprevAge, data.loas); */
                            response = response + impedDossie
                            /* if(data.loas){
                                const loasDissieNormal = await loasDossieUseCase.execute(parginaDosPrev,parginaDosPrevFormatada)
                                if(loasDissieNormal instanceof Error){
                                    response = response + " erro estabelecimento -"
                                }else if(loasDissieNormal){
                                    response = response + " RESTABELECIMENTO -"
                               }

                               const loasLitis = await loasDossieUseCase.executeLitispendenciaDossie(parginaDosPrev,parginaDosPrevFormatada)

                               if(loasLitis instanceof Error){
                                response = response + " erro estabelecimento -"
                            }else if(loasLitis){
                                response = response + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA l-"
                           }




                            const loasEmprego: any = await loasDossieUseCase.executeEmprego(parginaDosPrev,parginaDosPrevFormatada)
                                if(typeof(loasEmprego) == "boolean"){
                                    if(loasEmprego){
                                        response = response + " LOAS EMPREGO -"
                                    }
                                }else if(typeof(loasEmprego) == "object"){
                                    if(loasEmprego.valorBooleano){
                                        response = response + loasEmprego.message
                                    }else{
                                        response = response + loasEmprego.message
                                    }
                                }
 */
                            }else{




                                
                                
                            
                                const idDosprevParaPesquisa = objectDosPrev.documentoJuntado.componentesDigitais[0].id;
                                parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
                                parginaDosPrevFormatada = new JSDOM(parginaDosPrev);
    
                                const verifarSeFoiGerado = (getXPathText(parginaDosPrevFormatada, "/html/body/div")).trim() == "Não foi possível a geração do dossiê previdenciário.";
                                console.log("verficarSeFoiGerado: "+verifarSeFoiGerado)
                                if(verifarSeFoiGerado) {
                                    await updateEtiquetaUseCase.execute({ cookie, etiqueta: "Falha ao gerar Super DOSPREV ", tarefaId });
                                    //response = response + " Falha ao gerar Super DOSPREV ";
                                    return {warning: "Falha ao gerar Super DOSPREV"}
                                }
    
    /*                             if(data.loas){
                                   const loasSuperDossie = await loasSuperDossieUseCase.execute(parginaDosPrev,parginaDosPrevFormatada)
                                    if(loasSuperDossie instanceof Error){
                                        response = response + " erro estabelecimento -"
                                    }else if(loasSuperDossie){
                                        response = response + " RESTABELECIMENTO -"
                                   }
    
    
                                   const loasLitis = await loasSuperDossieUseCase.executeLitispendenciaSuperDossie(parginaDosPrev,parginaDosPrevFormatada);
                                   if(loasLitis instanceof Error){
                                    response = response + " erro estabelecimento -"
                                    }else if(loasLitis){
                                    response = response + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA l-"
                                    }
    
    
                                    const loasEmprego: any = await loasSuperDossieUseCase.executeEmprego(parginaDosPrev,parginaDosPrevFormatada)
                                    console.log("passou")
                                    console.log(loasEmprego)
                                    if(typeof(loasEmprego) == "boolean"){
                                        if(loasEmprego){
                                            response = response + " LOAS EMPREGO -"
                                        }
                                    }else if(typeof(loasEmprego) == "object"){
                                        if(loasEmprego.valorBooleano){
                                            response = response + loasEmprego.message
                                        }else{
                                            response = response + loasEmprego.message
                                        }
                                    }
    
                                } */
    
    
                                const NewDossiewithErro = (await getXPathText(parginaDosPrevFormatada, '/html/body/div')).trim() == 'Falha ao gerar dossiê. Será necessário solicitá-lo novamente.'
                                if(NewDossiewithErro) {
                                    await updateEtiquetaUseCase.execute({ cookie, etiqueta: `Falha ao gerar dossiê super sapiens`, tarefaId })
                                    response = '';
                                    return {warning: `Falha ao gerar dossiê super sapiens`}
                                }
                                
                                
                                /* impedDossie = await superDossie.impedimentos(parginaDosPrevFormatada, parginaDosPrev, data.readDosprevAge, data.loas); */
    
    
                                if(data.readDosprevAge == 0){
                                    impedDossie = await superDossie.impeditivosRural(parginaDosPrevFormatada, parginaDosPrev);
                                }else if(data.readDosprevAge == 1){
                                    impedDossie = await superDossie.impedimentosMaternidade(parginaDosPrevFormatada, parginaDosPrev);
                                }else if(data.readDosprevAge == 2){
                                    
                                    const dossieSocial = arrayDeDocumentos.find(Documento => Documento.documentoJuntado.tipoDocumento.sigla == "DOSOC");

                                    if (!dossieSocial) {
                                        response += " CADÚNICO -"
                                        impedDossie = await superDossie.impeditivosLoas(parginaDosPrevFormatada, parginaDosPrev);
                                    } else {

                                        const idDossieSocialParaPesquisa = dossieSocial.documentoJuntado.componentesDigitais[0].id;
                                        const paginaDossieSocial = await getDocumentoUseCase.execute({ cookie, idDocument: idDossieSocialParaPesquisa });
        
                                        const paginaDossieSocialFormatada = new JSDOM(paginaDossieSocial); 
        
                                        console.log("passouuuuuuuuuuu")
                                        console.log(await cadUnico.execute(paginaDossieSocialFormatada));
                                        console.log("acima")
        
        
                                        impedDossie = await superDossie.impeditivosLoas(parginaDosPrevFormatada, parginaDosPrev);
                                    }
    
                                }
                                response = response + impedDossie
                            }
                        }else{
                            
                        }
                        

                    
                        


                    
                    const paginaSislabraPoloAtivo = arrayDeDocumentos.find((Documento) => {
                        const nomeMovimentacao = Documento.movimento;
                        const name = nomeMovimentacao.indexOf("PÓLO ATIVO");
                        if(name != -1){
                            return Documento
                        }
                    });

                    if (!paginaSislabraPoloAtivo) {

                        console.log("-----SISLABRA NÃO ENCONTRADO")
                        response = " SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE"

                    } else {

                        let paginaSislabraConjugeCasoNeoExistaOModeloDeBuscaPadrao =  arrayDeDocumentos.find((Documento) => {
                            if(Documento.movimento && Documento.documentoJuntado && Documento.documentoJuntado.tipoDocumento && Documento.documentoJuntado.tipoDocumento.sigla){
                                const nomeMovimentacao = Documento.movimento;       
                                const name = nomeMovimentacao.indexOf("SISLABRA - GF");
                                const siglaSlabra = Documento.documentoJuntado.tipoDocumento.sigla.indexOf('SITCADCPF')
                                if(name != -1 && siglaSlabra != -1){
                                    //console.log(Documento.documentoJuntado.tipoDocumento)
                                    const typeDpcumento = Documento.documentoJuntado.componentesDigitais[0].mimetype.split("/")[1].trim()
                                    if(typeDpcumento == "html"){
                                        return Documento
                                    }
                                }
                            }
                        });
                        
                        
                        let paginaSislabraConjuge =  arrayDeDocumentos.find((Documento) => {
                            const nomeMovimentacao = Documento.movimento;       
                            const name = nomeMovimentacao.indexOf("POSSÍVEL CÔNJUGE");
                            if(name != -1){
                                const typeDpcumento = Documento.documentoJuntado.componentesDigitais[0].mimetype.split("/")[1].trim()
                                if(typeDpcumento == "html"){
                                    return Documento
                                }
                            }
                        });
    
                       if(paginaSislabraConjuge && paginaSislabraConjugeCasoNeoExistaOModeloDeBuscaPadrao){
                            if(paginaSislabraConjugeCasoNeoExistaOModeloDeBuscaPadrao.numeracaoSequencial > paginaSislabraConjuge.numeracaoSequencial){
                                paginaSislabraConjuge = paginaSislabraConjugeCasoNeoExistaOModeloDeBuscaPadrao;
                            }
                       }else if(!paginaSislabraConjuge && paginaSislabraConjugeCasoNeoExistaOModeloDeBuscaPadrao){
                            paginaSislabraConjuge = paginaSislabraConjugeCasoNeoExistaOModeloDeBuscaPadrao;
                       }
    
                        let sislabraAutorESislabraConjugeNoExistem = false;
    
    
                        if(paginaSislabraPoloAtivo && paginaSislabraConjuge){
                            const idSislabraParaPesquisaAutor = paginaSislabraPoloAtivo.documentoJuntado.componentesDigitais[0].id;
                            const parginaSislabraAutor = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraParaPesquisaAutor });
    
                            const paginaSislabraFormatadaAutor = new JSDOM(parginaSislabraAutor);
    
                            const sislabraAutor = await getDocumentSislabraFromSapiens.execute(paginaSislabraFormatadaAutor, "AUTOR")
                            response = response + sislabraAutor
    
    
                            const idSislabraParaPesquisaConjuge = paginaSislabraConjuge.documentoJuntado.componentesDigitais[0].id;
                            const parginaSislabraConjuge = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraParaPesquisaConjuge });
    
                            const paginaSislabraFormatadaConjuge = new JSDOM(parginaSislabraConjuge);
    
                            const sislabraConjuge = await getDocumentSislabraFromSapiens.execute(paginaSislabraFormatadaConjuge, "CONJUGE")
    
                            response = response + sislabraConjuge
    
                        }else if(paginaSislabraPoloAtivo && !paginaSislabraConjuge){
    
                            const idSislabraParaPesquisaAutor = paginaSislabraPoloAtivo.documentoJuntado.componentesDigitais[0].id;
                            const parginaSislabraAutor = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraParaPesquisaAutor });
    
                            const paginaSislabraFormatadaAutor = new JSDOM(parginaSislabraAutor);
    
                            const sislabraAutor = await getDocumentSislabraFromSapiens.execute(paginaSislabraFormatadaAutor, "AUTOR")
                            response = response + sislabraAutor
    
                        }else if(!paginaSislabraPoloAtivo && paginaSislabraConjuge){
                            const idSislabraParaPesquisaConjuge = paginaSislabraConjuge.documentoJuntado.componentesDigitais[0].id;
                            const parginaSislabraConjuge = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraParaPesquisaConjuge });
    
                            const paginaSislabraFormatadaConjuge = new JSDOM(parginaSislabraConjuge);
    
                            const sislabraConjuge = await getDocumentSislabraFromSapiens.execute(paginaSislabraFormatadaConjuge, "CONJUGE")
    
                            response = response + sislabraConjuge
                        }else{
                            /* response = response + " SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE" */
                            sislabraAutorESislabraConjugeNoExistem = true;
                        }
                    }

                    
                  
                    console.log("---BEFORE RESPONSE: " + response)

                    if (response.length == 0) {
                        await updateEtiquetaUseCase.execute({ cookie, etiqueta: `PROCESSO LIMPO`, tarefaId })
                        return {impeditivos: true} 
                    }
                    else if (response == " *RURAL* ") {
                        await updateEtiquetaUseCase.execute({ cookie, etiqueta: `PROCESSO LIMPO`, tarefaId })
                        return {impeditivos: true} 
                    }
                    else if (response == " *MATERNIDADE* ") {
                        await updateEtiquetaUseCase.execute({ cookie, etiqueta: `PROCESSO LIMPO`, tarefaId })
                        return {impeditivos: true} 
                    } else if (response == " *LOAS* ") {
                        await updateEtiquetaUseCase.execute({ cookie, etiqueta: `PROCESSO LIMPO`, tarefaId })
                        return {impeditivos: true} 
                    } else {
                        if(response == " SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE") {
                            await updateEtiquetaUseCase.execute({ cookie, etiqueta: `AVISO:  SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE"`, tarefaId })
                            return {warning: "SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE"}
                        }
                        await updateEtiquetaUseCase.execute({ cookie, etiqueta: `IMPEDITIVOS:  ${response}`, tarefaId })
                        console.log("RESPONSEEEE")
                        console.log(response)
                        return {impeditivos: true}  
                    }
                    
                        
   

        } catch (error) {
            console.log(error);
            //console.log(response.length)
            if (response.length > 0) {
                return {error: "error"}
            }
            else {
                return error;
            }
        }
    }

}

