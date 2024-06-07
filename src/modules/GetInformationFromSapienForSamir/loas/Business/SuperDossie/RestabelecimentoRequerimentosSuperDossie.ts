import { correçaoDoErroDeFormatoDoSapiens } from "../../../../../helps/CorreçaoDoErroDeFormatoDoSapiens";
import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";
import { convertToDate } from "../../../helps/createFormatDate";
import { arrayExisteCessadoOuSuspenso } from "../Help/ArrayExisteCessaoOuSuspenso";
import { buscardatasLoas } from "../Help/BuscarDatas";
import { calcularIdadeIdoso } from "../Help/CalcularIdadeIdoso";
import { EncontrarDataCesSusMaisAtual } from "../Help/EncontrarCesSusMaisAtual";
import { EncontrarDataMaisAtual } from "../Help/EncontrarDataMaisAtual";
import { formatDate } from "../Help/FormatarDataLoas";

export class RestabelecimentoRequerimentosSuperDossie{
    async handle(parginaDosPrevFormatada: any):Promise<any>{
        // Estrutura para etiquetar os requerimentos


        const xpathDataAjuzamento = "/html/body/div/div[4]/table/tbody/tr[2]/td"
        const dateAjuizamento = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, xpathDataAjuzamento));
    
        if(!dateAjuizamento) new Error("data ajuizamento não encontrada");
        if(dateAjuizamento.length == 0) new Error("data ajuizamento não encontrada");
        if(!(typeof(convertToDate(dateAjuizamento.trim())) == typeof(new Date()))) new Error("pegou xpath errado do ajuizamento");


        let tamanhoColunasRequerimentos = 1;
        const arrayDatas: Array<Date> = [];
        let verificarWhileRequerimentos = true;
        while(verificarWhileRequerimentos){
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[6]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
                verificarWhileRequerimentos = false; 
                break;
            }
            tamanhoColunasRequerimentos++;
        } // /html/body/div/div[6]/table/tbody/tr[1]/td[5]
        const objetosEncontradosParaVerificar = []
            for(let t=1; t<tamanhoColunasRequerimentos; t++){
                if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[6]/table/tbody/tr[${t}]`)) === 'string'){
                    const xpathColunaRequerimentos = `/html/body/div/div[6]/table/tbody/tr[${t}]`;
                    const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                    if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1){
                        if(xpathCoulaFormatadoRequerimentos.indexOf("87 - ") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("88 - ") !== -1){
                            if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1){
                                const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                                console.log("---DATA RESTABELECIMENTO: " + buscarDataCessaoOuSuspenso[2])
                                if(!buscarDataCessaoOuSuspenso) return new Error("beneficio sem data")
                                const restabelecimento = {
                                    beneficio: "cessaoOuSuspenso",
                                    data: new Date(parseInt(buscarDataCessaoOuSuspenso[2].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[2].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[2].split("/")[0]))
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
                return false
            }
                
    }
    
    }

    
    