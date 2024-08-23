import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { getDocumentoUseCase } from "../../GetDocumento";
import { parseDate } from "./parseDate";
import { isDateInRange } from "./dataIsInRange";
import { getRemuneracaoAjuizamentoSuper } from "./getRemuneracaoAjuizamentoSuper";
import { removeDayFromDate } from "./removeDayFromDate";
import { parseDateToString } from "./parseDateToString";
import { Console } from "console";
const { JSDOM } = require('jsdom');

export async function getValueCalcDossieSuper(cookie:string, superDossie: any, dataAjuizamento: string, dataRequerimento: string) {
    try {

        const idDosprevParaPesquisaDossieSuper = superDossie.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrevDossieSuper = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieSuper });
        
        const paginaDosPrevFormatadaDossieSuper = new JSDOM(paginaDosPrevDossieSuper); 


        // RELAÇÕES PREVIDENCIÁRIAS

        try {
            
            let tamanhoColunasRelacoes = 1;
            let verificarWhileRelacoes = true;
            while(verificarWhileRelacoes) {
                if(typeof (getXPathText(paginaDosPrevFormatadaDossieSuper, `/html/body/div/div[7]/table/tbody/tr[${tamanhoColunasRelacoes}]`)) == 'object'){
                    verificarWhileRelacoes = false; 
                    break;
                }
                tamanhoColunasRelacoes++;
            }

            const relacoesEncontradas = []
            const regexSeq = /\b\d{1,2}\b/g;
            const regexData: RegExp = /\b(?:\d{1,2}\/)?\d{1,2}\/\d{4}\b/g;

            for(let t = 1; t < tamanhoColunasRelacoes; t++) {
                if(typeof (getXPathText(paginaDosPrevFormatadaDossieSuper,`/html/body/div/div[7]/table/tbody/tr[${t}]`)) === 'string') {
                    const xpathColunaRelacoes = `/html/body/div/div[7]/table/tbody/tr[${t}]`
                    const xpathCoulaFormatadoRelacoes: string = getXPathText(paginaDosPrevFormatadaDossieSuper, xpathColunaRelacoes)
                    const isBeneficio = xpathCoulaFormatadoRelacoes.indexOf('Benefício') !== -1
                    if(!isBeneficio) {
                        const identificarSeq = xpathCoulaFormatadoRelacoes.match(regexSeq)
                        const getDatas: string[] | null = xpathCoulaFormatadoRelacoes.match(regexData);

                        if (!getDatas) {
                            return new Error('NÃO FOI POSSÍVEL COLETAR AS DATAS NO DOSPREV')
                        } else {

                            const dates = getDatas.map(dateString => parseDate(dateString))
    
    
                            const relacao = {
                                seq: identificarSeq[0],
                                dataInicio: dates[0],
                                dataFim: dates[1] || null,
                                originalString: xpathCoulaFormatadoRelacoes
                            }
    
                            if (relacao.dataFim !== null) {
                                relacoesEncontradas.push(relacao)
                            }
    
                        }




                    } 
                }
            }




            let mostRecentDataFim = null;
            let containsPRPPS = false;
            let mostRecentSeq = null;
            let mostRecentDataString;
            let mostRecentDataFormatada; 

            relacoesEncontradas.forEach(relacao => {
                if (relacao.dataFim) {
                    if (!mostRecentDataFim || relacao.dataFim > mostRecentDataFim.dataFim) {
                        mostRecentDataFim = relacao
                        containsPRPPS = relacao.originalString.includes('PRPPS')
                        mostRecentSeq = relacao.seq;
                    }
                }
            })

            if (mostRecentDataFim) {
                console.log('Most recent dataFim:', mostRecentDataFim.dataFim);
                console.log('Contains PRPPS:', containsPRPPS);
                console.log('SEQ of the most recent dataFim:', mostRecentSeq);

                mostRecentDataString = parseDateToString(mostRecentDataFim.dataFim)
                mostRecentDataFormatada = removeDayFromDate(mostRecentDataString)

                console.log(mostRecentDataFormatada)

            } else {
                console.log('No dataFim found.');
            }





            // ENCONTRAR A RELAÇÃO PREVIDENCIARIA QUE POSSUI O INTERVALO

            const dateAjuizamento = parseDate(dataAjuizamento)
            const dateRequerimento = parseDate(dataRequerimento)

            const ajzFormatado = removeDayFromDate(dataAjuizamento)
            const reqFormatado = removeDayFromDate(dataRequerimento)

            const seqIntervaloAjuizamento = isDateInRange(relacoesEncontradas, dateAjuizamento)
            const seqIntervaloRequerimento = isDateInRange(relacoesEncontradas, dateRequerimento)

            console.log('---SEQ INTERVALO AJUIZAMENTO SUPER')
            console.log(seqIntervaloAjuizamento)

            console.log('---SEQ INTERVALO REQUERIMENTO SUPER')
            console.log(seqIntervaloRequerimento)


            if (seqIntervaloAjuizamento && seqIntervaloRequerimento) {
                // ACHANDO AS RELAÇÕES PARA AS DUAS DATAS, É POSSÍVEL COLETAR AS REMUNERAÇÕES
                const remuneracaoAjuizamento = await getRemuneracaoAjuizamentoSuper(seqIntervaloAjuizamento, paginaDosPrevFormatadaDossieSuper, ajzFormatado)
                
                const remuneracaoRequerimento = await getRemuneracaoAjuizamentoSuper(seqIntervaloRequerimento, paginaDosPrevFormatadaDossieSuper, reqFormatado)

                console.log('--REMUNERACAO AJUIZAMENTO')
                console.log(remuneracaoAjuizamento)

                console.log('--REMUNERACAO REQUERIMENTO')
                console.log(remuneracaoRequerimento)
                

                return {
                    remuneracaoAjz: remuneracaoAjuizamento,
                    remuneracaoReq: remuneracaoRequerimento
                }

            } else if (!seqIntervaloAjuizamento && seqIntervaloRequerimento) {

                let remuneracaoRequerimento = await getRemuneracaoAjuizamentoSuper(seqIntervaloRequerimento, paginaDosPrevFormatadaDossieSuper, reqFormatado)

                if (remuneracaoRequerimento === undefined) {
                    remuneracaoRequerimento = await getRemuneracaoAjuizamentoSuper(mostRecentSeq, paginaDosPrevFormatadaDossieSuper, mostRecentDataFormatada)
                }

                let remuneracaoAjuizamentoServidor = 0;
                //if (mostRecentDataFim && containsPRPPS)
                remuneracaoAjuizamentoServidor = await getRemuneracaoAjuizamentoSuper(mostRecentSeq, paginaDosPrevFormatadaDossieSuper, mostRecentDataFormatada) 
                
                return {
                    remuneracaoAjz: remuneracaoAjuizamentoServidor,
                    remuneracaoReq: remuneracaoRequerimento
                }

            } else if (seqIntervaloAjuizamento && !seqIntervaloRequerimento) {

                let remuneracaoAjuizamento = await getRemuneracaoAjuizamentoSuper(seqIntervaloAjuizamento, paginaDosPrevFormatadaDossieSuper, ajzFormatado)

                if (remuneracaoAjuizamento === undefined) {
                    remuneracaoAjuizamento = await getRemuneracaoAjuizamentoSuper(mostRecentSeq, paginaDosPrevFormatadaDossieSuper, mostRecentDataFormatada)
                }

                let remuneracaoRequerimentoServidor = 0;
                //if (mostRecentDataFim && containsPRPPS) 
                remuneracaoRequerimentoServidor = await getRemuneracaoAjuizamentoSuper(mostRecentSeq, paginaDosPrevFormatadaDossieSuper, mostRecentDataFormatada)
                
                return {
                    remuneracaoAjz: remuneracaoAjuizamento,
                    remuneracaoReq: remuneracaoRequerimentoServidor
                }

            } else {
                console.log('OZZY OSBOURNE')
                let remuneracaoRequerimentoServidor = await getRemuneracaoAjuizamentoSuper(mostRecentSeq, paginaDosPrevFormatadaDossieSuper, mostRecentDataFormatada)
                console.log(remuneracaoRequerimentoServidor)
                if (remuneracaoRequerimentoServidor){
                    return {
                        remuneracaoAjz: remuneracaoRequerimentoServidor,
                        remuneracaoReq: remuneracaoRequerimentoServidor
                    }  
                } 
                return {
                    remuneracaoAjz: 0,
                    remuneracaoReq: 0
                }
            }



        } catch (error) {
            console.error(error)
        }


        // RETORNAR UM OBJETO COM REMUNERAÇÃO DE AJUIZAMENTO E REMUNERAÇÃO DE REQUERIMENTO



    } catch (error) {
        console.log(error)
    }
}