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
import { MinhaErroPersonalizado } from './helps/ErrorMensage';
import { json } from 'express';
import { getInformationDossieForPicaPau } from './GetInformationFromDossieForPicaPau';
import { getDocumentSislabraFromSapiens } from './GetDocumentSislabraFromSapiens';


export class GetInformationFromSapienForSamirUseCase {

    async execute(data: IGetInformationsFromSapiensDTO): Promise<any> {
        const cookie = await loginUseCase.execute(data.login);
        const usuario = (await getUsuarioUseCase.execute(cookie));
        let impedDossie: string  = '';
        
        const usuario_id = `${usuario[0].id}`;
        let novaCapa: any = false;
        var objectDosPrev
        let response: string = '';
        let dosprevThisTrue = true;
        try {
            const tarefas = await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta: data.etiqueta });
            /* const tarefas = await getTarefaUseCaseNup.execute({ cookie, usuario_id, nup: data.nup }); */
             
            for (var i = 0; i <= tarefas.length - 1; i++) {
                console.log("Qantidade faltando triar", (tarefas.length - i));
                let superDosprevExist = false;
                const tarefaId = tarefas[i].id;
                const etiquetaParaConcatenar = tarefas[i].postIt
                const objectGetArvoreDocumento: IGetArvoreDocumentoDTO = { nup: tarefas[i].pasta.NUP, chave: tarefas[i].pasta.chaveAcesso, cookie, tarefa_id: tarefas[i].id }
                let arrayDeDocumentos: ResponseArvoreDeDocumento[];

                try {
                    arrayDeDocumentos = (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();
                } catch (error) {
                    console.log(error);
                    (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV COM FALHA NA GERAÇAO", tarefaId }));
                    continue
                }









                const tcapaParaVerificar: string = await getCapaDoPassivaUseCase.execute(tarefas[i].pasta.NUP, cookie);
                const tcapaFormatada = new JSDOM(tcapaParaVerificar)
   
                
                const tinfoClasseExist = await verificarCapaTrue(tcapaFormatada)




                if(tinfoClasseExist){

                        objectDosPrev = arrayDeDocumentos.find(Documento => Documento.documentoJuntado.tipoDocumento.sigla == "DOSPREV");
                        if(objectDosPrev){
                            var objectDosPrev2 = arrayDeDocumentos.find(Documento => {
                                const movimento = (Documento.movimento).split(".");
                                return movimento[0] == "JUNTADA DOSSIE DOSSIE PREVIDENCIARIO REF";
                            });
                            
                            if(objectDosPrev == undefined && objectDosPrev2 == undefined){
                                (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV NÃO ENCONTRADO", tarefaId }));
                                continue
                            }else if(objectDosPrev2 != undefined && objectDosPrev == undefined){
                                objectDosPrev = objectDosPrev2;
                                superDosprevExist = true;
                            }else if(objectDosPrev != undefined &&  objectDosPrev2 != undefined){
                                if(objectDosPrev.numeracaoSequencial < objectDosPrev2.numeracaoSequencial){
                                    objectDosPrev = objectDosPrev2;
                                    superDosprevExist = true;
                                }
                            }
                        }else{
                            dosprevThisTrue = false;
                            response = response + " DOSPREV NÃO EXISTE"
                        }
                        


                } else{
                    
                    const capaParaVerificar: string = await getCapaDoPassivaUseCase.execute(tarefas[i].pasta.NUP, cookie);
                    const capaFormatada = new JSDOM(capaParaVerificar)
                    const xpathNovaNup = "/html/body/div/div[4]/table/tbody/tr[13]/td[2]/a[1]/b"
                    const novaNup = getXPathText(capaFormatada, xpathNovaNup)
                    const novoObjectGetArvoreDocumento: IGetArvoreDocumentoDTO = { nup: novaNup, chave: tarefas[i].pasta.chaveAcesso, cookie, tarefa_id: tarefas[i].id }
                    try { 
                        const novaNupTratada = novaNup.split("(")[0].trim().replace(/[-/.]/g, "")
                        novoObjectGetArvoreDocumento.nup = novaNupTratada
                        arrayDeDocumentos = (await getArvoreDocumentoUseCase.execute(novoObjectGetArvoreDocumento)).reverse();
                        objectDosPrev = arrayDeDocumentos.find(Documento => Documento.documentoJuntado.tipoDocumento.sigla == "DOSPREV");
[]
                        if(objectDosPrev){
                            var objectDosPrev2 = arrayDeDocumentos.find(Documento => {
                                const movimento = (Documento.movimento).split(".");
                                return movimento[0] == "JUNTADA DOSSIE DOSSIE PREVIDENCIARIO REF";
                            });


                            if(objectDosPrev == undefined && objectDosPrev2 == undefined){
                                (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV NÃO ENCONTRADO", tarefaId }));
                                continue
                            }else if(objectDosPrev2 != undefined && objectDosPrev == undefined){
                                objectDosPrev = objectDosPrev2;
                                superDosprevExist = true;
                            }else if(objectDosPrev != undefined &&  objectDosPrev2 != undefined){
                                if(objectDosPrev.numeracaoSequencial < objectDosPrev2.numeracaoSequencial){
                                    objectDosPrev = objectDosPrev2;
                                    superDosprevExist = true;
                                }
                            }
                            dosprevThisTrue = false;
                            response = response + ' ERRO AO LÊ NOVO DOSPREV - '
                        }else{
                            dosprevThisTrue = false;
                            response = response + " DOSPREV NÃO EXISTE"
                        }
                            


                    } catch (error) {
                        console.log(error);
                        (await updateEtiquetaUseCase.execute({ cookie, etiqueta: "DOSPREV COM FALHA NA GERAÇAO", tarefaId }));
                        continue
                    }
                }


                



                

                //Verificar a capa caso exista outra capa com os dados necessários
                const capaParaVerificar: string = await getCapaDoPassivaUseCase.execute(tarefas[i].pasta.NUP, cookie);
                const capaFormatada = new JSDOM(capaParaVerificar)
                //const xPathClasse = "/html/body/div/div[4]/table/tbody/tr[2]/td[1]"
                const infoClasseExist = await verificarCapaTrue(capaFormatada) 
                if(!infoClasseExist){
             
                    const xpathNovaNup = "/html/body/div/div[4]/table/tbody/tr[13]/td[2]/a[1]/b"
                    const novaNup = getXPathText(capaFormatada, xpathNovaNup)
                    const nupFormatada:string = (novaNup.split('(')[0]).replace(/[./-]/g, "").trim();
                    const capa = (await getCapaDoPassivaUseCase.execute(nupFormatada, cookie));
                    novaCapa = new JSDOM(capa)
                }else{
                    
                    const capa = (await getCapaDoPassivaUseCase.execute(tarefas[i].pasta.NUP, cookie));
                    novaCapa = new JSDOM(capa)
                }
                

                
              
                const cpfCapa = buscarTableCpf(novaCapa);
                if(!cpfCapa){
                    (await updateEtiquetaUseCase.execute({ cookie, etiqueta: `CPF NÃO ENCONTRADO`, tarefaId }))
                    continue;
                }

                
               

                let parginaDosPrev;
                let parginaDosPrevFormatada;
                if(dosprevThisTrue){

                    const dosPrevSemIdParaPesquisa = (objectDosPrev.documentoJuntado.componentesDigitais.length) <= 0;
                    if (dosPrevSemIdParaPesquisa) {
                        console.log("DOSPREV COM FALHA NA PESQUISA");
                        (await updateEtiquetaUseCase.execute({ cookie, etiqueta: `DOSPREV COM FALHA NA PESQUISA - ${etiquetaParaConcatenar}`, tarefaId }))
                        continue;
                    }
                     
                    if(!superDosprevExist){
                        const idDosprevParaPesquisa = objectDosPrev.documentoJuntado.componentesDigitais[0].id;
                        parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });

                        parginaDosPrevFormatada = new JSDOM(parginaDosPrev); 

                        impedDossie = await getInformationDossieForPicaPau.impedimentos(parginaDosPrevFormatada, parginaDosPrev, data.readDosprevAge);
                        response = response + impedDossie
                    }else{
                        const idDosprevParaPesquisa = objectDosPrev.documentoJuntado.componentesDigitais[0].id;
                        parginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
                        
                        parginaDosPrevFormatada = new JSDOM(parginaDosPrev);
                        
                        impedDossie = await superDossie.impedimentos(parginaDosPrevFormatada, parginaDosPrev, data.readDosprevAge);
                        response = response + impedDossie
                    }
                    


    

                    

                }    
                    


                
                const paginaSislabraPoloAtivo = arrayDeDocumentos.find((Documento) => {
                    const nomeMovimentacao = Documento.movimento;       
                    const name = nomeMovimentacao.indexOf("PÓLO ATIVO");
                    if(name != -1){
                        return Documento
                    }
                  });
                  
                  
                  const paginaSislabraConjuge =  arrayDeDocumentos.find((Documento) => {
                    const nomeMovimentacao = Documento.movimento;       
                    const name = nomeMovimentacao.indexOf("POSSÍVEL CÔNJUGE");
                    if(name != -1){
                        const typeDpcumento = Documento.documentoJuntado.componentesDigitais[0].mimetype.split("/")[1].trim()
                        if(typeDpcumento == "html"){
                            return Documento
                        }
                    }
                  });
                  
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
                    response = response + " SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE"
                  }
                  
                  
                  
                  

                    

                if(response.length == 0){
                    await updateEtiquetaUseCase.execute({ cookie, etiqueta: `SEM IMPEDITIVOS`, tarefaId })
                    response = '';
                    continue 
                }else{
                    await updateEtiquetaUseCase.execute({ cookie, etiqueta: `IMPEDITIVOS:  ${response}`, tarefaId })
                    response = '';
                    continue  
                }
                
                      

            }
            return await response
        } catch (error) {
            console.log(error);
            console.log(response.length)
            if (response.length > 0) {
                return response
            }
            else {
                return error;
            }
        }
    }

}

