import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { arrayExisteCessadoOuSuspenso } from "../../../loas/Business/Help/ArrayExisteCessaoOuSuspenso";
import { buscardatasLoas } from "../../../loas/Business/Help/BuscarDatas";
import { calcularIdadeIdoso } from "../../../loas/Business/Help/CalcularIdadeIdoso";
import { EncontrarDataCesSusMaisAtual } from "../../../loas/Business/Help/EncontrarCesSusMaisAtual";
import { EncontrarDataMaisAtual } from "../../../loas/Business/Help/EncontrarDataMaisAtual";
import { formatDate } from "../../../loas/Business/Help/FormatarDataLoas";

export async function getDERorDCBNormal(paginaDosPrevFormatada: any, dataAjuizamento: any): Promise<string> {

    try {
        
        let tamanhoColunasRequerimentos = 2;
        let verificarWhileRequerimentos = true;
        while (verificarWhileRequerimentos) {
            if (typeof (getXPathText(paginaDosPrevFormatada, `/html/body/div/div[3]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object') {
                verificarWhileRequerimentos = false; 
                break;
            }
            tamanhoColunasRequerimentos++;
        } 

        
        const objetosEncontradosParaVerificar = []
        for (let t = 2; t < tamanhoColunasRequerimentos; t++) {

            if (typeof (getXPathText(paginaDosPrevFormatada, `/html/body/div/div[3]/table/tbody/tr[${t}]`)) === 'string') {
                const xpathColunaRequerimentos = `/html/body/div/div[3]/table/tbody/tr[${t}]`;
                const xpathCoulaFormatadoRequerimentos: string = getXPathText(paginaDosPrevFormatada, xpathColunaRequerimentos);


                    if (xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1) {
                        const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                        if(!buscarDataCessaoOuSuspenso) throw new Error("beneficio sem data")
                        const requerimento = {
                            beneficio: "cessaoOuSuspenso",
                            data: new Date(parseInt(buscarDataCessaoOuSuspenso[2].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[2].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[2].split("/")[0]))
                        }
                        objetosEncontradosParaVerificar.push(requerimento)
                    }
        
        
                    if(xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1){
                        const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                        if(!buscarDataCessaoOuSuspenso) throw new Error("beneficio sem data")
                        const requerimento = {
                            beneficio: "indeferido",
                            data: new Date(parseInt(buscarDataCessaoOuSuspenso[0].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[0].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[0].split("/")[0]))
                        }
                        objetosEncontradosParaVerificar.push(requerimento)
                    }



                
                    
                          
            }
        }

        // IDENTIFICAR SE TEM DER OU DCB
        if (arrayExisteCessadoOuSuspenso(objetosEncontradosParaVerificar)) {

            const dataCessado = formatDate(EncontrarDataCesSusMaisAtual(objetosEncontradosParaVerificar))
            const tempoCesSus = calcularIdadeIdoso(dataCessado, dataAjuizamento)

            // Existem cessados/suspensos e o mais atual tem menos de 5 anos, independente do indeferido = Restabelecimento
            if (tempoCesSus < 5) {

                return dataCessado

            } else {
                const req = formatDate(EncontrarDataMaisAtual(objetosEncontradosParaVerificar))
                return req
                
                
            }

        } else {
            const req = formatDate(EncontrarDataMaisAtual(objetosEncontradosParaVerificar))
            return req
        }

    } catch (error) {
        console.error(error.message)
    }


}
