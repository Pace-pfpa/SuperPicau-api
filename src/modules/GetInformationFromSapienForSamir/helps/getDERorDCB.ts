import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { arrayExisteCessadoOuSuspenso } from "../loas/Business/Help/ArrayExisteCessaoOuSuspenso";
import { buscardatasLoas } from "../loas/Business/Help/BuscarDatas";
import { calcularIdadeIdoso } from "../loas/Business/Help/CalcularIdadeIdoso";
import { EncontrarDataCesSusMaisAtual } from "../loas/Business/Help/EncontrarCesSusMaisAtual";
import { EncontrarDataMaisAtual } from "../loas/Business/Help/EncontrarDataMaisAtual";
import { formatDate } from "../loas/Business/Help/FormatarDataLoas";

export async function getDERorDCB(paginaDosPrevFormatada: any, dataAjuizamento: any) {

    try {
        
        let tamanhoColunasRequerimentos = 1;
        let verificarWhileRequerimentos = true;
        while (verificarWhileRequerimentos) {
            if (typeof (getXPathText(paginaDosPrevFormatada, `/html/body/div/div[6]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object') {
                verificarWhileRequerimentos = false; 
                break;
            }
            tamanhoColunasRequerimentos++;
        } 
    
        const objetosEncontradosParaVerificar = []
        for (let t = 1; t < tamanhoColunasRequerimentos; t++) {

            if (typeof (getXPathText(paginaDosPrevFormatada, `/html/body/div/div[6]/table/tbody/tr[${t}]`)) === 'string') {
                const xpathColunaRequerimentos = `/html/body/div/div[6]/table/tbody/tr[${t}]`;
                const xpathCoulaFormatadoRequerimentos: string = getXPathText(paginaDosPrevFormatada, xpathColunaRequerimentos);
                // NÃO FAZER O CÁLCULO QUANDO TEM ALGUM ATIVO
                if (xpathCoulaFormatadoRequerimentos.indexOf("ATIVO") !== -1) {
                    return {
                        valorBooleano: false,
                        beneficio: "ativo",
                        data: null
                    }
                }


                const tipoRequerimento = ["87 - ", "88 - ", "04 - ", "05 - ", "06 - ", "32 - ", "92 - "]
                const achouBeneficio = tipoRequerimento.some(tipoRequerimento => xpathCoulaFormatadoRequerimentos.indexOf(tipoRequerimento))

                // NÃO FAZER O CÁLCULO SE HOUVER ALGUM DESSES BENEFÍCIOS
                if (achouBeneficio) {
                    return {
                        valorBooleano: false,
                        beneficio: "no_calc",
                        data: null
                    }
                } else {
                    if (xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1) {
                        const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                        if(!buscarDataCessaoOuSuspenso) throw new Error("beneficio sem data")
                        const requerimento = {
                            valorBooleano: true,
                            beneficio: "cessaoOuSuspenso",
                            data: new Date(parseInt(buscarDataCessaoOuSuspenso[2].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[2].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[2].split("/")[0]))
                        }
                        objetosEncontradosParaVerificar.push(requerimento)
                    }
        
        
                    if(xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1){
                        const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                        if(!buscarDataCessaoOuSuspenso) throw new Error("beneficio sem data")
                        const requerimento = {
                            valorBooleano: true,
                            beneficio: "indeferido",
                            data: new Date(parseInt(buscarDataCessaoOuSuspenso[0].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[0].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[0].split("/")[0]))
                        }
                        objetosEncontradosParaVerificar.push(requerimento)
                    }
                }


                // NÃO FAZER O CÁLCULO SE FOR "AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO"
                if(objetosEncontradosParaVerificar.length == 0) {
                    return {
                        valorBooleano: false,
                        beneficio: 'no_req',
                        data: null
                    }
                }


                // IDENTIFICAR SE TEM DER OU DCB
                if (arrayExisteCessadoOuSuspenso(objetosEncontradosParaVerificar)) {

                    const dataCessado = formatDate(EncontrarDataCesSusMaisAtual(objetosEncontradosParaVerificar))
                    const tempoCesSus = calcularIdadeIdoso(dataCessado, dataAjuizamento)
    
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
    } catch (error) {
        console.error(error.message)
    }


}
