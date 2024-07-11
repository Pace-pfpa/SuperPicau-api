const { JSDOM } = require('jsdom');
import { getUsuarioUseCase } from '../GetUsuario';
import { loginUseCase } from '../LoginUsuario';
import { getTarefaUseCase } from '../GetTarefa';
import { IGetInformationsFromSapiensDTO } from '../../DTO/GetInformationsFromSapiensDTO';
import { IGetArvoreDocumentoDTO } from '../../DTO/GetArvoreDocumentoDTO';
import { getArvoreDocumentoUseCase } from '../GetArvoreDocumento/index';
import { getDocumentoUseCase } from '../GetDocumento';
import { updateEtiquetaUseCase } from '../UpdateEtiqueta';
import { getXPathText } from "../../helps/GetTextoPorXPATH";
import { ResponseArvoreDeDocumento } from '../../sapiensOperations/response/ResponseArvoreDeDocumento';
import { getCapaDoPassivaUseCase } from '../GetCapaDoPassiva';
import { verificarCapaTrue } from './helps/verificarCapaTrue';
import { buscarTableCpf } from './helps/procurarTableCpf';
import { superDossie } from './DossieSuperSapiens';
import { getInformationDossieForPicaPau } from './GetInformationFromDossieForPicaPau';
import { getDocumentSislabraFromSapiens, getDocumentSislabraFromSapiensLoas } from './GetDocumentSislabraFromSapiens';
import { getInformationCapa } from './GetInformationCapa';
import { compararNup } from "./helps/ComparaNUP";
import { LoasDossieUseCase } from './loas/LoasDossieUseCase';
import { LoasSuperDossieUseCase } from './loas/LoasSuperDossieUseCase ';
import { loasDossieUseCase, loasSuperDossieUseCase } from './loas';
import { verificarDossieMaisAtual } from './helps/verificarDossieMaisAtual';
import { cadUnico } from './loas/CadUnico';
import { getInfoReqDossieSuper } from './helps/getInfoReqDossieSuper';
import { getInfoReqDossieNormal } from './helps/getInfoReqDossieNormal';
import { getInfoEnvDossieNormal } from './helps/getInfoEnvDossieNormal';
import { calcularMediaAjuizamento } from './helps/calcularMediaAjuizamento';
import { calcularMediaRequerimento } from './helps/calcularMediaRequerimento';
import { getSalarioMinimo } from './loas/Business/Help/getSalarioMinimo';
import { removeDayMonthFromDate } from './helps/removeDayMonthFromDate';
import { removeDayYearFromDate } from './helps/removeDayYearFromDate';
import { compararPrioridade } from './loas/Business/Help/compareRenda';
import { getInfoEnvDossieSuper } from './helps/getInfoEnvDossieSuper';
import { GetInteressadosReq } from '../CreateInterested/RequisicaoAxiosTarefas/GetInteressadosReq';
import { arrayInteressados } from '../CreateInterested/Helps/ArrayInteressados';
// QUANDO TIVER O PROCESSO, IMPLEMENTAR O UPLOAD.
import { uploadDocumentForAttachmentUseCase } from '../../upload';
import { verificarImpedimentos } from './helps/verificarImpedimentos';
import { gerarObjetoUpload } from './helps/gerarObjetoUpload';
import { impeditivosHtml } from '../CreateHtmlForLoas';

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
        let gastoComMedicamentos;
        let grupoFamiliarCpfs;
        
        try {
            let tarefas = await getTarefaUseCase.execute({ cookie, usuario_id, etiqueta: data.etiqueta });
            
            nupInicio = tarefas[0].pasta.NUP

            let VerificarSeAindExisteProcesso: boolean = true;
                            
                
                    
                    let superDosprevExist = false;
                    const tarefaId = data.tarefa.id;
                    const etiquetaParaConcatenar = data.tarefa.postIt
                    const objectGetArvoreDocumento: IGetArvoreDocumentoDTO = { nup: data.tarefa.pasta.NUP, chave: data.tarefa.pasta.chaveAcesso, cookie, tarefa_id: data.tarefa.id }
                    let arrayDeDocumentos: ResponseArvoreDeDocumento[];
                    
                    
                    try {
                        arrayDeDocumentos = (await getArvoreDocumentoUseCase.execute(objectGetArvoreDocumento)).reverse();
                        let comparaNup = compararNup(nupInicio,data.tarefa.pasta.NUP)
                                      
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

                                
                            
                                if(objectDosPrev2.length > 0){
                                    superDosprevExist = true;
                                }
                            

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
                    
                    
                    
                
                    console.log("CPF: ")
                    const cpfCapa = buscarTableCpf(novaCapa);
                    //console.log(cpfCapa)
                    if(!cpfCapa){
                        (await updateEtiquetaUseCase.execute({ cookie, etiqueta: ` CPF NÃO ENCONTRADO - (GERAR NOVO DOSSIE)`, tarefaId }))
                        return {erro: ` CPF NÃO ENCONTRADO -`}
                    }

                   


                    // NESSA PARTE DA TRIAGEM, JÁ TEMOS OS ARRAYS COM TODOS OS DOSSIÊS (objectDosPrev para dossiês normais e objectDosPrev2 para super dossiês)


                    let totalDossieNormal = objectDosPrev
                    let totalDossieSuper = objectDosPrev2
                   
                    
                  
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
                        
                        if (dossieIsvalid instanceof Error || !dossieIsvalid) {
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




                    


                    // AQUI JÁ FOI ACHADO O DOSSIÊ DO REQUERENTE, QUE PASSARÁ PELA ETIQUETAGEM


                    const informationcapa = await getInformationCapa.ImpedimentosCapa(capa);
                    if(!informationcapa){
                        response= response + " ADVOGADO -"
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
    

                                    // VERIFICAR GASTO COM MEDICAMENTOS
                                    const medicamentos = await cadUnico.execute(paginaDossieSocialFormatada)
                                    console.log(medicamentos)

                                    if (medicamentos === '0.00') {
                                        gastoComMedicamentos = false
                                    } else {
                                        gastoComMedicamentos = true
                                    }

                                     // GERAR ARRAY DE CPFS ENVOLVIDOS

                                    grupoFamiliarCpfs = await cadUnico.grupoFamiliar(paginaDossieSocialFormatada, cpfCapa)
                                    console.log('CPF ENVOLVIDOS: ')
                                    console.log(grupoFamiliarCpfs)
    
    
                                    impedDossie = await getInformationDossieForPicaPau.impeditivoLoas(parginaDosPrevFormatada);
                                }

                            }

                            response = response + impedDossie

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
    
    
    
                                const NewDossiewithErro = (await getXPathText(parginaDosPrevFormatada, '/html/body/div')).trim() == 'Falha ao gerar dossiê. Será necessário solicitá-lo novamente.'
                                if(NewDossiewithErro) {
                                    await updateEtiquetaUseCase.execute({ cookie, etiqueta: `Falha ao gerar dossiê super sapiens`, tarefaId })
                                    response = '';
                                    return {warning: `Falha ao gerar dossiê super sapiens`}
                                }
                                
                                
    
    
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

                                        const medicamentos = await cadUnico.execute(paginaDossieSocialFormatada)
                                        console.log(medicamentos)

                                        if (medicamentos === '0.00') {
                                            gastoComMedicamentos = false
                                        } else {
                                            gastoComMedicamentos = true
                                        }
                                        console.log(gastoComMedicamentos)

                                        grupoFamiliarCpfs = await cadUnico.grupoFamiliar(paginaDossieSocialFormatada, cpfCapa)
                                        console.log('CPF FAMILIARES: ')
                                        console.log(grupoFamiliarCpfs)
    
        
        
                                        impedDossie = await superDossie.impeditivosLoas(parginaDosPrevFormatada, parginaDosPrev);
                                    }
    
                                }
                                response = response + impedDossie
                            }
                        }else{
                            
                        }
    
                    
                  
                    console.log("---BEFORE RESPONSE: " + response)
                    const totalImpeditivos = response.split("-")
                    console.log("----TOTAL IMPEDITIVOS")
                    console.log(totalImpeditivos)


                    
                    const beneficios = [ ' *LOAS* ' ]
                    const impedCadunico = [' CADÚNICO ']
                    const impeditivos = [' CADÚNICO ', ' BPC ATIVO ', ' BENEFÍCIO ATIVO ', ' IDADE ', ' AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO ', ' LITISPENDÊNCIA ', ' ADVOGADO ' ]


                    const isLoas = beneficios.some(loas => totalImpeditivos.includes(loas))
                    const isCadunico = impedCadunico.some(cadunico => totalImpeditivos.includes(cadunico))
                    console.log('---É UM LOAS?')
                    console.log(isLoas)

                    if (isLoas) {

                        // VERIFICA SE O PROCESSO ESTÁ LIMPO ATÉ ESSE MOMENTO
                        const possuiImpeditivo = impeditivos.some(impeditivo => totalImpeditivos.includes(impeditivo))
                        console.log(possuiImpeditivo)
    
                        // ARRAY PARA GUARDAR O DOSSIÊ DE CADA MEMBRO DA FAMÍLIA
                        let arrayDossieEnvolvidosNormal = [];
                        let arrayDossieEnvolvidosSuper = [];
                        let infoRequerente;



                        // ENCONTRAR CPFS DE TERCEIROS (INTERESSADOS)
                        let InputArray = await GetInteressadosReq(tarefas[0].pasta_id, cookie)
                        let ArrayEnvolvidos = arrayInteressados(InputArray)
                        console.log('---ARRAY ENVOLVIDOS DE ROSSI')
                        console.log(ArrayEnvolvidos)
                        console.log('---CPF POLO ATIVO: ')
                        console.log(cpfCapa)


                        // FAZ O MERGE DOS CPFS DE TERCEIROS COM OS DO GRUPO FAMILIAR
                        let filtered_cpfs = [];
                        let updated_cpf_dos_familiares2 = [];

                        if (!isCadunico) {
                            filtered_cpfs = ArrayEnvolvidos.filter(cpf => {
                                return cpf !== '0000000000-' &&
                                       cpf !== cpfCapa &&
                                       cpf.length <= 11 &&
                                       !grupoFamiliarCpfs.includes(cpf); 
                            })

                            updated_cpf_dos_familiares2 = [...grupoFamiliarCpfs, ...filtered_cpfs];
                        }



                        //const updated_cpf_dos_familiares = [...grupoFamiliarCpfs, ...filtered_cpfs];
                        console.log('---GRUPO FAMILIAR COMPLETO DE ROSSI')
                        console.log(updated_cpf_dos_familiares2)


                        if (!possuiImpeditivo) {

                            if (superDosprevExist) {
                                // DOSSIÊ DO REQUERENTE É SUPER E ESTÁ LIMPO, INFORMAÇÕES DO REQUERENTE
                                const objectRequerente = await getInfoReqDossieSuper(cookie, objectDosPrev)
                                infoRequerente = objectRequerente;
        
        
                            } else if (dossieNormal) {
                                // DOSSIÊ DO REQUERENTE É NORMAL E ESTÁ LIMPO, INFORMAÇÕES DO REQUERENTE
                                const objectRequerente = await getInfoReqDossieNormal(cookie, objectDosPrev)
                                infoRequerente = objectRequerente
        
                            }
    
        
                            // ITERA SOBRE CADA CPF ENCONTRADO DO GRUPO FAMILIAR
                            for (let i = 0; i < updated_cpf_dos_familiares2.length; i++) {
                                let dossieIsvalid2;
        
                                if (totalDossieNormal.length === 0) {
                                    dossieIsvalid2 = await verificarDossieMaisAtual(updated_cpf_dos_familiares2[i], cookie, null, totalDossieSuper)
                                } else if (totalDossieSuper.length === 0) {
                                    dossieIsvalid2 = await verificarDossieMaisAtual(updated_cpf_dos_familiares2[i], cookie, totalDossieNormal, null)
                                } else {
                                    dossieIsvalid2 = await verificarDossieMaisAtual(updated_cpf_dos_familiares2[i], cookie, totalDossieNormal, totalDossieSuper)
                                }
                                
        
                                if (dossieIsvalid2 instanceof Error || !dossieIsvalid2) {
                                    console.error(`ERRO DOSPREV ENVOLVIDO CPF: ${updated_cpf_dos_familiares2[i]}`)
                                } else {
        
                                    if(dossieIsvalid2[1] == 0){
                                        arrayDossieEnvolvidosNormal.push(dossieIsvalid2[0])
                                    }else if(dossieIsvalid2[1] == 1){
                                        arrayDossieEnvolvidosSuper.push(dossieIsvalid2[0])
                                    }
        
        
                                }
                                
                            }
                        }
    

                        console.log('---ARRAY ENV SUPER')
                        //console.log(arrayDossieEnvolvidosSuper)

    
                        if (infoRequerente) {

                            let arrayObjetosEnvolvidos = [];
    
                        if (arrayDossieEnvolvidosNormal.length > 0) {
                            for (let i = 0; i < arrayDossieEnvolvidosNormal.length; i++) {
                                const objectEnvolvido = await getInfoEnvDossieNormal(cookie, arrayDossieEnvolvidosNormal[i], infoRequerente.dataRequerimento)
                                
                                if (objectEnvolvido) {
                                    arrayObjetosEnvolvidos.push(objectEnvolvido)
                                }
                            } 
                        }
    
                        if (arrayDossieEnvolvidosSuper.length > 0) {
                            for (let i = 0; i < arrayDossieEnvolvidosSuper.length; i++) {
                                const objectEnvolvido = await getInfoEnvDossieSuper(cookie, arrayDossieEnvolvidosSuper[i], infoRequerente.dataRequerimento)
    
                                if (objectEnvolvido) {
                                    arrayObjetosEnvolvidos.push(objectEnvolvido)
                                }
                            }
                        }
    
    
                        arrayObjetosEnvolvidos.push(infoRequerente)
    
    
                        // FORMADO O OBJETO DE TODOS OS QUE POSSUEM DOSSIÊ PREVIDENCIÁRIO
    
                        console.log('--OBJETOS DOS ENVOLVIDOS')
                        console.log(arrayObjetosEnvolvidos)
    
    
                        // CALCULAR A RENDA MÉDIA DA FAMÍLIA
    
                        console.log(updated_cpf_dos_familiares2.length + 1)
    
                        const mediaAjuizamento = calcularMediaAjuizamento(arrayObjetosEnvolvidos, updated_cpf_dos_familiares2.length + 1)
                        console.log(mediaAjuizamento)
    
                        const mediaRequerimento = calcularMediaRequerimento(arrayObjetosEnvolvidos, updated_cpf_dos_familiares2.length + 1)
                        console.log(mediaRequerimento)
    
    
                        // PEGAR SALARIO MINIMO DE ACORDO COM O ANO
                        const anoAjuizamento = removeDayMonthFromDate(infoRequerente.dataAjuizamento)
                        console.log(anoAjuizamento)
    
                        const anoRequerimento = removeDayMonthFromDate(infoRequerente.dataRequerimento)
                        console.log(anoRequerimento)
    
                        const arraySalarioMinimoAjuizamento = await getSalarioMinimo(anoAjuizamento);
                        console.log(arraySalarioMinimoAjuizamento)
    
                        const arraySalarioMinimoRequerimento = await getSalarioMinimo(anoRequerimento)
                        console.log(arraySalarioMinimoRequerimento)
    
                        let salarioMinimoAjz;
                        let salarioMinimoReq;
    
    
                        salarioMinimoAjz = parseFloat(arraySalarioMinimoAjuizamento[0].valor)
                        salarioMinimoReq = parseFloat(arraySalarioMinimoRequerimento[0].valor)
    
    
                        if (anoAjuizamento === "2023") {
                            const mesAjuizamento = removeDayYearFromDate(infoRequerente.dataAjuizamento)
                            console.log(mesAjuizamento)
    
                            if (mesAjuizamento === '01' || mesAjuizamento === '02' || mesAjuizamento === '03' || mesAjuizamento === '04') {
                                salarioMinimoAjz = parseFloat(arraySalarioMinimoAjuizamento[0].valor)
                            } else {
                                salarioMinimoAjz = parseFloat(arraySalarioMinimoAjuizamento[1].valor)
                            }
    
                        }
                        
                        if (anoRequerimento === "2023") {
                            const mesRequerimento = removeDayYearFromDate(infoRequerente.dataRequerimento)
                            console.log(mesRequerimento)
    
                            if (mesRequerimento === '01' || mesRequerimento === '02' || mesRequerimento === '03' || mesRequerimento === '04') {
                                salarioMinimoReq = parseFloat(arraySalarioMinimoRequerimento[0].valor)
                            } else {
                                salarioMinimoReq = parseFloat(arraySalarioMinimoRequerimento[1].valor)
                            }
    
                        }
    
    
                        
    
                        // ETIQUETAGEM DE RENDA
    
                        console.log(salarioMinimoAjz)
                        console.log(salarioMinimoReq)
                        
                        // AJUIZAMENTO
    
                        let flagAjuizamento;
    
                        const salarioMinimoAjz1_4 = salarioMinimoAjz / 4
                        const salarioMinimoAjz1_2 = salarioMinimoAjz / 2
    
                        if (mediaAjuizamento > salarioMinimoAjz1_2 && mediaAjuizamento <= salarioMinimoAjz) {
                            flagAjuizamento = 'ALTA'
                        } else if (mediaAjuizamento >= salarioMinimoAjz) {
                            flagAjuizamento = 'ELEVADA'
                        } else if (mediaAjuizamento > salarioMinimoAjz1_4 && mediaAjuizamento <= salarioMinimoAjz1_2 && !gastoComMedicamentos) {
                            flagAjuizamento = 'MEDIA'
                        } else {
                            flagAjuizamento = 'BAIXA'
                        }
    
    
                        // REQUERIMENTO
    
                        let flagRequerimento;
    
                        const salarioMinimoReq1_4 = salarioMinimoReq / 4
                        const salarioMinimoReq1_2 = salarioMinimoReq / 2
    
                        if (mediaRequerimento > salarioMinimoReq1_2 && mediaRequerimento <= salarioMinimoReq) {
                            flagRequerimento = 'ALTA'
                        } else if (mediaRequerimento >= salarioMinimoReq) {
                            flagRequerimento = 'ELEVADA'
                        } else if (mediaRequerimento > salarioMinimoReq1_4 && mediaRequerimento <= salarioMinimoReq1_2 && !gastoComMedicamentos) {
                            flagRequerimento = 'MEDIA'
                        } else {
                            flagRequerimento = 'BAIXA'
                        }
    
    
    
                        // COMPARAÇÃO
    
                        const resultadoRenda = compararPrioridade(flagAjuizamento, flagRequerimento)
                        console.log(resultadoRenda)
    
                        if (resultadoRenda === 'ELEVADA') {
                            response += ' RENDA ELEVADA -'
                        } else if (resultadoRenda === 'ALTA') {
                            response += ' RENDA ALTA -'
                        } else if (resultadoRenda === 'MEDIA') {
                            response += ' RENDA MEDIA -'
                        }
                        }





                        // VIEIRA: SISLABRA LOAS

                        // ENCONTRA TODOS OS LABRA COM A STRING "POLO ATIVO"
                        const labrasPoloAtivo = arrayDeDocumentos.filter((Documento) => {
                            const nomeMovimentacao = Documento.movimento;
                            const name = nomeMovimentacao.indexOf("PÓLO ATIVO");
                            if (name != -1) {
                                return true
                            }
                            return false
                        })


                        console.log('---VIEIRA: SISLABRAS POLO ATIVO')
                        //console.log(labrasPoloAtivo)

                        if (labrasPoloAtivo.length > 0) {
                            // VERIFICAR CADA DOCUMENTO POLO ATIVO IDENTIFICANDO IMPEDITIVOS
                            for (let i = 0; i < labrasPoloAtivo.length; i++) {
                                const idSislabraParaPesquisaAutor = labrasPoloAtivo[i].documentoJuntado.componentesDigitais[0].id;
                                const parginaSislabraPoloAtivo = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraParaPesquisaAutor });
        
                                const paginaSislabraFormatadaPoloAtivo = new JSDOM(parginaSislabraPoloAtivo);
        
                                const sislabraPoloAtivo = await getDocumentSislabraFromSapiensLoas.execute(paginaSislabraFormatadaPoloAtivo, true)
                                response = response + sislabraPoloAtivo
                            }

                        } else {
                            console.log("-----SISLABRA NÃO ENCONTRADO")
                            response += " SISLABRA AUTOR NÃO EXISTE -"
                        }


                        // ENCONTRA OS OUTROS LABRA

                        // MÉTODO 1 - SISLABRA GF

                        const labrasGrupoFamiliar = arrayDeDocumentos.filter((Documento) => {
                            if (Documento.movimento && Documento.documentoJuntado && Documento.documentoJuntado.tipoDocumento && Documento.documentoJuntado.tipoDocumento.sigla) {
                                const nomeMovimentacao = Documento.movimento;       
                                const name = nomeMovimentacao.indexOf("SISLABRA - GF");
                                const siglaSlabra = Documento.documentoJuntado.tipoDocumento.sigla.indexOf('SITCADCPF');
                                
                                if (name != -1 && siglaSlabra != -1) {
                                    const typeDpcumento = Documento.documentoJuntado.componentesDigitais[0].mimetype.split("/")[1].trim();
                                    if (typeDpcumento == "html") {
                                        return true; 
                                    }
                                }
                            }
                            return false;
                        });

                        // MÉTODO 2 - SISLABRA ENVOLVIDO

                        const labrasEnvolvidos = arrayDeDocumentos.filter((Documento) => {
                            if (Documento.movimento && Documento.documentoJuntado && Documento.documentoJuntado.tipoDocumento && Documento.documentoJuntado.tipoDocumento.sigla) {
                                const nomeMovimentacao = Documento.movimento;
                                const name = nomeMovimentacao.indexOf("SISLABRA - ENVOLVIDO");
                                const siglaSlabra = Documento.documentoJuntado.tipoDocumento.sigla.indexOf('PESBEN');

                                if (name != -1 && siglaSlabra != -1) {
                                    const typeDocumento = Documento.documentoJuntado.componentesDigitais[0].mimetype.split("/")[1].trim();
                                    if (typeDocumento == "html") {
                                        return true;
                                    }
                                }
                            }
                        })


                        //console.log(labrasGrupoFamiliar)
                        //console.log(labrasEnvolvidos)

                        const labrasTotal = [...labrasGrupoFamiliar, ...labrasEnvolvidos]

                        console.log('---UNIÃO DOS LABRAS')
                        //console.log(labrasTotal)


                        if (labrasTotal.length > 0) {
                            // VERIFICAR CADA DOCUMENTO DO GF IDENTIFICANDO IMPEDITIVOS

                            for (let i = 0; i < labrasTotal.length; i++) {
                                const idSislabraParaPesquisaGF = labrasTotal[i].documentoJuntado.componentesDigitais[0].id;
                                const parginaSislabraGF = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraParaPesquisaGF });
        
                                const paginaSislabraFormatadaGF = new JSDOM(parginaSislabraGF);
        
                                const sislabraGF = await getDocumentSislabraFromSapiensLoas.execute(paginaSislabraFormatadaGF, false)
                                response = response + sislabraGF
                            }

                        } else {
                            console.log("---SEM LABRA FAMILIAR")
                            response += " SISLABRA GF NÃO EXISTE -"
                        }

                        
    
                        
                    } else {

                        // SISLABRA NÃO LOAS
                        
                        const paginaSislabraPoloAtivo = arrayDeDocumentos.find((Documento) => {
                        const nomeMovimentacao = Documento.movimento;
                        const name = nomeMovimentacao.indexOf("PÓLO ATIVO");
                        if(name != -1){
                            return Documento
                        }
                    });

                    if (!paginaSislabraPoloAtivo) {

                        console.log("-----SISLABRA NÃO ENCONTRADO")
                        response += " SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE -"

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
                             response = response + " SISLABRA GF NÃO EXISTE" 
                            sislabraAutorESislabraConjugeNoExistem = true;
                        }
                    }

                    
                    }


 
                    console.log("---ONE MORE RESPONSE: " + response)
                    

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
                        if(response == " *RURAL*  SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE -") {
                            await updateEtiquetaUseCase.execute({ cookie, etiqueta: `AVISO:  SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE"`, tarefaId })
                            return {warning: "SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE"}
                        } else if (response == " *MATERNIDADE*  SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE -") {
                            await updateEtiquetaUseCase.execute({ cookie, etiqueta: `AVISO:  SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE"`, tarefaId })
                            return {warning: "SISLABRA (AUTOR) e (CONJUGE) NÃO EXISTE"}
                        }


                        function findSubstring(str: string) {
                            const substrings = ['*LOAS*', '*MATERNIDADE*', '*RURAL*'];
                        
                            for (let substring of substrings) {
                                if (str.includes(substring)) {
                                    return substring.replace(/\*/g, '');
                                }
                            }
                            
                            return null;
                        }

                        function removeSubstring(str) {
                            const substrings = ['*LOAS*', '*MATERNIDADE*', '*RURAL*'];
                        
                            for (let substring of substrings) {
                                if (str.includes(substring)) {
                                    return str.replace(substring, '');
                                }
                            }
                            
                            return str; // Retorna a string original se nenhuma substring for encontrada
                        }
    
                        const tipo = findSubstring(response)

                        const newResponse = removeSubstring(response)

                        await updateEtiquetaUseCase.execute({ cookie, etiqueta: `${tipo} IMPEDITIVOS: ${newResponse}`, tarefaId })
                        console.log("RESPONSEEEE")
                        console.log(newResponse)


                        // IMPLEMENTAR O UPLOAD DO HTML QUANDO TIVER IMPEDIMENTOS (LOAS)

                        if (isLoas) {
                            const impeditivosPresentes = verificarImpedimentos(newResponse);
                            console.log('--TOTAL DE IMPEDITIVOS 2')
                            console.log(impeditivosPresentes)
    
                            const objForHTML = gerarObjetoUpload(impeditivosPresentes)
                            console.log("---BOOLEAN OBJECT")
                            //console.log(objForHTML)

                            // PARTE QUE DE FATO FAZ O UPLOAD, CUIDADO AO USAR

                            const htmlUpload = await impeditivosHtml.execute(objForHTML)
                            //console.log(htmlUpload)

                            const tipo_documento = "35"
                            const min = 1;
                            const max = 999999;
                            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                            const ticket_upload = `${usuario_id}_20230504${randomNumber}`
                            const pasta_id = `${tarefas[0].pasta.id}`;

                            const uploadTheFato = await uploadDocumentForAttachmentUseCase.execute(cookie, `impeditivos.html`, htmlUpload, tipo_documento, pasta_id, ticket_upload); 
                            console.log(uploadTheFato)

                        }



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

