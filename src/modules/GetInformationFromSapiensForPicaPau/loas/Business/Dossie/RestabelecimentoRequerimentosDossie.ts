import { correçaoDoErroDeFormatoDoSapiens } from "../../../../../shared/utils/CorreçaoDoErroDeFormatoDoSapiens";
import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { convertToDate } from "../../../helps/createFormatDate";
import { arrayExisteCessadoOuSuspenso } from "../Help/ArrayExisteCessaoOuSuspenso";
import { buscardatasLoas } from "../Help/BuscarDatas";
import { calcularIdadeIdoso } from "../Help/CalcularIdadeIdoso";
import { EncontrarDataCesSusMaisAtual } from "../Help/EncontrarCesSusMaisAtual";
import { EncontrarDataMaisAtualNew } from "../Help/EncontrarDataMaisAtualNew";
import { formatDate } from "../Help/FormatarDataLoas";

export class RestabelecimentoRequerimentos{
    async handle(parginaDosPrevFormatada: any):Promise<any>{
        //Estrutura para identificar a maior data, e fazer a subtração dela

        let dateAjuizamento
        const xpathDataAjuzamento = "/html/body/div/div[4]/table/tbody/tr[2]/td"
        ///html/body/div/div[1]/table/tbody/tr[2]/td
         dateAjuizamento = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, xpathDataAjuzamento));
        const regex = /\b(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}\b/g;
        const datas = dateAjuizamento.match(regex);
        console.log(datas)
        if(datas == null){
            const newxpath = "/html/body/div/div[1]/table/tbody/tr[2]/td"
            dateAjuizamento = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, newxpath));

        }
    
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
                                console.log(buscarDataCessaoOuSuspenso[buscarDataCessaoOuSuspenso.length-1])
                                const lastDate = buscarDataCessaoOuSuspenso[buscarDataCessaoOuSuspenso.length-1]
                                console.log(lastDate)
                                if(!buscarDataCessaoOuSuspenso) return new Error("beneficio sem data")
                                const restabelecimento = {
                                    beneficio: "cessaoOuSuspenso",
                                    data: new Date(parseInt(lastDate.split("/")[2]), parseInt(lastDate.split("/")[1]) - 1, parseInt(lastDate.split("/")[0]))
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
                console.log(objetosEncontradosParaVerificar)
                console.log('macaco')

                const dataCessado = formatDate(EncontrarDataCesSusMaisAtual(objetosEncontradosParaVerificar))
                console.log(dataCessado)
                const tempoCesSus = calcularIdadeIdoso(dataCessado, dateAjuizamento)
                
                console.log(dateAjuizamento)
                console.log(tempoCesSus)

                // Existem cessados/suspensos e o mais atual tem menos de 5 anos, independente do indeferido = Restabelecimento
                if (tempoCesSus < 5) {
                    return {
                        valorBooleano: true,
                        impeditivo: " RESTABELECIMENTO -"
                    }
                } else {
                    console.log('macaco 2')
                    console.log(EncontrarDataCesSusMaisAtual(objetosEncontradosParaVerificar))
                    if(EncontrarDataMaisAtualNew(objetosEncontradosParaVerificar).beneficio == "indeferido") {
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

    