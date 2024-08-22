import { correçaoDoErroDeFormatoDoSapiens } from "../../../../../helps/CorreçaoDoErroDeFormatoDoSapiens";
import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";
import { convertToDate } from "../../../helps/createFormatDate";
import { arrayExisteCessadoOuSuspenso } from "../Help/ArrayExisteCessaoOuSuspenso";
import { buscardatasLoas } from "../Help/BuscarDatas";
import { calcularIdadeIdoso } from "../Help/CalcularIdadeIdoso";
import { EncontrarDataCesSusMaisAtual } from "../Help/EncontrarCesSusMaisAtual";
import { EncontrarDataMaisAtual } from "../Help/EncontrarDataMaisAtual";
import { formatDate } from "../Help/FormatarDataLoas";

export class RestabelecimentoRequerimentos{
    async handle(parginaDosPrevFormatada: any):Promise<any>{
        //Estrutura para identificar a maior data, e fazer a subtração dela


        const xpathDataAjuzamento = "/html/body/div/div[4]/table/tbody/tr[2]/td"
        const dateAjuizamento = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, xpathDataAjuzamento));
    
        if(!dateAjuizamento) new Error("data ajuizamento não encontrada");
        if(dateAjuizamento.length == 0) new Error("data ajuizamento não encontrada");
        if(!(typeof(convertToDate(dateAjuizamento.trim())) == typeof(new Date()))) new Error("pegou xpath errado do ajuizamento");

        let tamanhoColunasRequerimentos = 2;
        const arrayDatas: Array<Date> = [];
        let verificarWhileRequerimentos = true;
        while(verificarWhileRequerimentos){
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[3]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
                verificarWhileRequerimentos = false; 
                break;
            }
            tamanhoColunasRequerimentos++;
        }

        //console.log(tamanhoColunasRequerimentos)
        // /html/body/div/div[3]/table/tbody/tr
            const objetosEncontradosParaVerificar = []
            for(let t=2; t<tamanhoColunasRequerimentos; t++){
                if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[3]/table/tbody/tr[${t}]`)) === 'string'){
                    const xpathColunaRequerimentos = `/html/body/div/div[3]/table/tbody/tr[${t}]`;
                    const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                    //console.log(buscardatasLoas(xpathCoulaFormatadoRequerimentos))
                    //console.log(xpathCoulaFormatadoRequerimentos)
                    if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1){
                        if(xpathCoulaFormatadoRequerimentos.indexOf("87 - ") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("88 - ") !== -1){
                            console.log("PASSSSOUUUU1")
                            if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1){
                                const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                                //console.log(buscarDataCessaoOuSuspenso[0])
                                if(!buscarDataCessaoOuSuspenso) return new Error("beneficio sem data")
                                const restabelecimento = {
                                    beneficio: "cessaoOuSuspenso",
                                    data: new Date(parseInt(buscarDataCessaoOuSuspenso[0].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[0].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[0].split("/")[0]))
                                }
                                objetosEncontradosParaVerificar.push(restabelecimento)
                            }


                            if(xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1){
                                const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                                buscarDataCessaoOuSuspenso[0]
                                if(!buscarDataCessaoOuSuspenso) return new Error("beneficio sem data")
                                const restabelecimento = {
                                    beneficio: "indeferido",
                                    data: new Date(parseInt(buscarDataCessaoOuSuspenso[0].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[0].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[0].split("/")[0]))
                                }
                                objetosEncontradosParaVerificar.push(restabelecimento)
                            }
                           const datasEncontradas = (buscardatasLoas(xpathCoulaFormatadoRequerimentos))
                        }
                      
                    }
                }
            }
            console.log(objetosEncontradosParaVerificar)
            if(objetosEncontradosParaVerificar.length == 0) {
                return {
                    valorBooleano: true,
                    impeditivo: " AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO -"
                } 
            }

            if (arrayExisteCessadoOuSuspenso(objetosEncontradosParaVerificar)) {

                const dataCessado = formatDate(EncontrarDataCesSusMaisAtual(objetosEncontradosParaVerificar))
                const tempoCesSus = calcularIdadeIdoso(dataCessado, dateAjuizamento)

                // Existem cessados/suspensos e o mais atual tem menos de 5 anos, independente do indeferido = Restabelecimento
                if (tempoCesSus < 5) {
                    return {
                        valorBooleano: true,
                        impeditivo: " RESTABELECIMENTO -"
                    }
                } else {
                    if(EncontrarDataMaisAtual(objetosEncontradosParaVerificar).beneficio == "indeferido") {
                        return false
                    }
                    return {
                        valorBooleano: true,
                        impeditivo: " AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO -"
                    }
                }

            } else {
                return {
                    valorBooleano: true,
                    impeditivo: " AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO -"
                }   
            }
    }
    
 }

    