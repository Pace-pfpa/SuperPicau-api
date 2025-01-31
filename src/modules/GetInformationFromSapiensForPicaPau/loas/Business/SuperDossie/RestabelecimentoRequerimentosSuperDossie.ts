import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { correçaoDoErroDeFormatoDoSapiens } from "../../../../../shared/utils/CorreçaoDoErroDeFormatoDoSapiens";
import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { convertToDate } from "../../../helps/createFormatDate";
import { arrayExisteCessadoOuSuspenso } from "../Help/ArrayExisteCessaoOuSuspenso";
import { buscardatasLoas } from "../Help/BuscarDatas";
import { calcularIdadeIdoso } from "../Help/CalcularIdadeIdoso";
import { EncontrarDataCesSusMaisAtual } from "../Help/EncontrarCesSusMaisAtual";
import { EncontrarDataMaisAtualNew } from "../Help/EncontrarDataMaisAtualNew";
import { formatDate } from "../Help/FormatarDataLoas";

export class RestabelecimentoRequerimentosSuperDossie {
    async handle(parginaDosPrevFormatada: JSDOMType): Promise<{ valorBooleano: boolean, impeditivo: string } | Error> {

        const xpathDataAjuzamento = "/html/body/div/div[4]/table/tbody/tr[2]/td";
        const dateAjuizamento = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, xpathDataAjuzamento));
    
        if(!dateAjuizamento) throw new Error("data ajuizamento não encontrada");
        if(dateAjuizamento.length == 0) throw new Error("data ajuizamento não encontrada");
        if(typeof(convertToDate(dateAjuizamento.trim())) != typeof(new Date())) throw new Error("pegou xpath errado do ajuizamento");


        let tamanhoColunasRequerimentos = 1;
        let verificarWhileRequerimentos = true;
        while(verificarWhileRequerimentos) {
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[6]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){ 
                break;
            }
            tamanhoColunasRequerimentos++;
        }
        
        const objetosEncontradosParaVerificar = []
            for(let t=1; t<tamanhoColunasRequerimentos; t++){
                if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[6]/table/tbody/tr[${t}]`)) === 'string'){
                    const xpathColunaRequerimentos = `/html/body/div/div[6]/table/tbody/tr[${t}]`;
                    const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                    if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1){
                        if(xpathCoulaFormatadoRequerimentos.indexOf("87 - ") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("88 - ") !== -1){
                            if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1){
                                const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                                if(!buscarDataCessaoOuSuspenso) return new Error("beneficio sem data")
                                const restabelecimento = {
                                    beneficio: "cessaoOuSuspenso",
                                    data: new Date(parseInt(buscarDataCessaoOuSuspenso[2].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[2].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[2].split("/")[0]))
                                }
                                objetosEncontradosParaVerificar.push(restabelecimento)
                            }


                            if(xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1){
                                const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                                if(!buscarDataCessaoOuSuspenso) return new Error("beneficio sem data")
                                const restabelecimento = {
                                    beneficio: "indeferido",
                                    data: new Date(parseInt(buscarDataCessaoOuSuspenso[0].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[0].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[0].split("/")[0]))
                                }
                                objetosEncontradosParaVerificar.push(restabelecimento)
                            }
                           const datasEncontradas = (buscardatasLoas(xpathCoulaFormatadoRequerimentos))
                        }
                      
                    } else if (xpathCoulaFormatadoRequerimentos.indexOf("ATIVO") !== -1) {
                        return {
                            valorBooleano: false,
                            impeditivo: ""
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
                        valorBooleano: false,
                        impeditivo: " RESTABELECIMENTO -"
                    }
                } else {
                    if(EncontrarDataMaisAtualNew(objetosEncontradosParaVerificar).beneficio == "indeferido") {
                        return {
                            valorBooleano: false,
                            impeditivo: ""
                        }
                    }
                    return {
                        valorBooleano: true,
                        impeditivo: " AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO -"
                    }
                }

            } else {
                return {
                    valorBooleano: false,
                    impeditivo: ""
                }
            }
                
    }
    
    async handleMaternidade(parginaDosPrevFormatada: JSDOMType): Promise<{ valorBooleano: boolean, impeditivo: string } | Error> {
        const xpathDataAjuzamento = "/html/body/div/div[4]/table/tbody/tr[2]/td";
        const dateAjuizamento = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, xpathDataAjuzamento));
    
        if(!dateAjuizamento) throw new Error("data ajuizamento não encontrada");
        if(dateAjuizamento.length == 0) throw new Error("data ajuizamento não encontrada");
        if(typeof(convertToDate(dateAjuizamento.trim())) !== typeof(new Date())) throw new Error("pegou xpath errado do ajuizamento");

        let tamanhoColunasRequerimentos = 1;
        let verificarWhileRequerimentos = true;
        while(verificarWhileRequerimentos) {
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[6]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){ 
                break;
            }
            tamanhoColunasRequerimentos++;
        }

        const outrosBeneficios = []
        const beneficiosCessados = []
        for(let t=1; t<tamanhoColunasRequerimentos; t++) {
            if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[6]/table/tbody/tr[${t}]`)) === 'string'){
                const xpathColunaRequerimentos = `/html/body/div/div[6]/table/tbody/tr[${t}]`;
                const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                if (xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1) {

                        if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1) {
                            const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                            if(!buscarDataCessaoOuSuspenso) return new Error("beneficio sem data")
                            const restabelecimento = {
                                beneficio: "cessado",
                                data: new Date(parseInt(buscarDataCessaoOuSuspenso[2].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[2].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[2].split("/")[0]))
                            }
                            beneficiosCessados.push(restabelecimento)
                        }


                        if(xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1){
                            const buscarDataCessaoOuSuspenso = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                            if(!buscarDataCessaoOuSuspenso) return new Error("beneficio sem data")
                            const restabelecimento = {
                                beneficio: "indeferido",
                                data: new Date(parseInt(buscarDataCessaoOuSuspenso[0].split("/")[2]), parseInt(buscarDataCessaoOuSuspenso[0].split("/")[1]) - 1, parseInt(buscarDataCessaoOuSuspenso[0].split("/")[0]))
                            }
                            outrosBeneficios.push(restabelecimento)
                        }
                    
                } else if (xpathCoulaFormatadoRequerimentos.indexOf("ATIVO") !== -1) {
                    return {
                        valorBooleano: true,
                        impeditivo: " BENEFÍCIO ATIVO -"
                    }
                }
            }
        }

        const objetosEncontradosParaVerificar = [...outrosBeneficios, ...beneficiosCessados]

        if(objetosEncontradosParaVerificar.length === 0) {
            return {
                valorBooleano: true,
                impeditivo: " AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO -"
            }
        }

        if (beneficiosCessados.length > 0) {
            const arrayPossiveisConcessoes = [];
            for (const beneficio of beneficiosCessados) {
                const tempoCessado = calcularIdadeIdoso(formatDate(beneficio.data), dateAjuizamento)
                if (tempoCessado <= 6) {
                    arrayPossiveisConcessoes.push(beneficio)
                }
            }

        } else {
            return {
                valorBooleano: false,
                impeditivo: ""
            }
        }

    }
}

    
    