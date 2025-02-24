import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { correçaoDoErroDeFormatoDoSapiens } from "../../../../../shared/utils/CorreçaoDoErroDeFormatoDoSapiens";
import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { IImpeditivoLitispendencia } from "../../../dto";
import { arrayExisteCessadoOuSuspenso } from "../Help/ArrayExisteCessaoOuSuspenso";
import { buscardatasLoas } from "../Help/BuscarDatas";
import { buscaNumeroProcesso } from "../Help/BuscarNumeroProcesso";
import { EncontrarDataCesSusMaisAtual } from "../Help/EncontrarCesSusMaisAtual";
import { EncontrarDataMaisAtual } from "../Help/EncontrarDataMaisAtual";

export class LoasLitispendenciaSuperDossie {
    async handle(parginaDosPrevFormatada: JSDOMType): Promise<IImpeditivoLitispendencia> {
        let impeditivoLitispendencia: string[] = [];

        const xPathNumeroUnico = '/html/body/div/div[4]/table/tbody/tr[1]/td'
        const numeroUnicoMain = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, xPathNumeroUnico));
    
        if(!numeroUnicoMain && numeroUnicoMain.length === 0) throw new Error("Número único não encontrado");

        console.log('----NÚMERO DO PROCESSO: ')
        console.log(numeroUnicoMain.replace(/\D/g, ''))
        
        // TABELA DE LITISPENDÊNCIA (PROCESSOS MOVIDOS ANTERIORMENTE)

        let tamanhoColunaLitis = 1;
        let verificarWhileLitis = true;
        while (verificarWhileLitis) {
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[5]/table/tbody/tr[${tamanhoColunaLitis}]`)) == 'object'){
                break;
            }
            tamanhoColunaLitis++;
        }


        const processosEncontradosParaVerificar = []
        for (let t = 1; t < tamanhoColunaLitis; t++) {
            if (typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[5]/table/tbody/tr[${t}]`)) === 'string') {
                const xpathColunaFormatadoProcessos: string = getXPathText(parginaDosPrevFormatada, `/html/body/div/div[5]/table/tbody/tr[${t}]`);
                const numeroProcessoJudicial = buscaNumeroProcesso(xpathColunaFormatadoProcessos)
                if (numeroProcessoJudicial !== numeroUnicoMain.replace(/\D/g, '')) {
                    if(xpathColunaFormatadoProcessos.indexOf("PESSOA COM DEFICIÊNCIA") !== -1 || xpathColunaFormatadoProcessos.indexOf("IDOSO") !== -1 || xpathColunaFormatadoProcessos.indexOf("BENEFÍCIO ASSISTENCIAL") !== -1 ) {
                        const dataAjuizamento = buscardatasLoas(xpathColunaFormatadoProcessos)
                        console.log(dataAjuizamento[0])
    
    
                        const processo = {
                            beneficio: "LOAS",
                            data: new Date(parseInt(dataAjuizamento[0].split("/")[2]), parseInt(dataAjuizamento[0].split("/")[1]) - 1, parseInt(dataAjuizamento[0].split("/")[0]))
                        }
    
                        processosEncontradosParaVerificar.push(processo);
                        impeditivoLitispendencia.push(numeroProcessoJudicial);
                    }
                }


            }
        }

        

        if (processosEncontradosParaVerificar.length == 0) {
            // Sem possibilidade de litispendência
            return {
                haveLitispendencia: false,
                litispendencia: impeditivoLitispendencia
            }
        }

        const maisAtual = EncontrarDataMaisAtual(processosEncontradosParaVerificar)


        // TABELA DE REQUERIMENTOS

        let tamanhoColunasRequerimentos = 1;
        let verificarWhileRequerimentos = true;
        while(verificarWhileRequerimentos) {
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[6]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
                break;
            }
            tamanhoColunasRequerimentos++;
        }


        const requerimentosEncontradosParaVerificar = []
        for(let t=1; t<tamanhoColunasRequerimentos; t++){
                if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[6]/table/tbody/tr[${t}]`)) === 'string'){
                    const xpathColunaRequerimentos = `/html/body/div/div[6]/table/tbody/tr[${t}]`;
                    const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                    if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1) {

                            if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1) {
                                const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                                if(!buscarDataCessaoOuSuspenso) throw new Error("beneficio sem data")
                                const requerimento = {
                                    beneficio: "cessaoOuSuspenso",
                                    data: new Date(parseInt(buscarDataCessaoOuSuspenso[2].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[2].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[2].split("/")[0]))
                                }
                                requerimentosEncontradosParaVerificar.push(requerimento)
                            }


                            if(xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1) {
                                const buscarDataIndeferido = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                                if(!buscarDataIndeferido) throw new Error("beneficio sem data")
                                const requerimento = {
                                    beneficio: "indeferido",
                                    data: new Date(parseInt(buscarDataIndeferido[0].split("/")[2]), parseInt(buscarDataIndeferido[0].split("/")[1]) - 1, parseInt(buscarDataIndeferido[0].split("/")[0]))
                                }
                                requerimentosEncontradosParaVerificar.push(requerimento)
                            }
                        
                      
                    }
                }
        }


        // TRABALHAR COM CESSADOS/SUSPENSOS OU INDEFERIDOS

        if (arrayExisteCessadoOuSuspenso(requerimentosEncontradosParaVerificar)) {

            const dataReq = EncontrarDataCesSusMaisAtual(requerimentosEncontradosParaVerificar)
            const dataLitis = maisAtual.data

            // Verificar se LITIS é mais atual que REQ -> LITISPENDÊNCIA
            if (dataLitis > dataReq) {
                return {
                    haveLitispendencia: true,
                    litispendencia: impeditivoLitispendencia
                }
            } 

                
        } else {

            const dataReqIndef = EncontrarDataMaisAtual(requerimentosEncontradosParaVerificar).beneficio == "indeferido"
            const dataLitis = maisAtual.data
                
            if (dataLitis > dataReqIndef) {
                return {
                    haveLitispendencia: true,
                    litispendencia: impeditivoLitispendencia
                }
            }
        }

        return {
            haveLitispendencia: false,
            litispendencia: impeditivoLitispendencia
        }
    }
    
}

    
    