import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { buscardatasLoas } from "../Help/BuscarDatas";
import { EncontrarDataMaisAtual } from "../Help/EncontrarDataMaisAtual";
import { formatDate } from "../Help/FormatarDataLoas";
import { calcularIdadeIdoso } from "../Help/CalcularIdadeIdoso";
import { correçaoDoErroDeFormatoDoSapiens } from "../../../../../shared/utils/CorreçaoDoErroDeFormatoDoSapiens";

export class LoasIdadeSuperDossie {
    async handle(parginaDosPrevFormatada: any):Promise<any> {

        const dataNascXpath: string = "/html/body/div/div[4]/table/tbody/tr[8]/td";
        const dataNascFormatado: string = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, dataNascXpath));


        let tamanhoColunasRequerimentos = 1;
        let verificarWhileRequerimentos = true;
        // Mapeia a quantidade de requerimentos
        while(verificarWhileRequerimentos){
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[6]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
                verificarWhileRequerimentos = false; 
                break;
            }
            tamanhoColunasRequerimentos++;
        }
        // Itera sobre os requerimentos buscando por status
        const objetosEncontradosParaVerificar = []
            for(let t=1; t<tamanhoColunasRequerimentos; t++){
                if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[6]/table/tbody/tr[${t}]`)) === 'string'){
                    const xpathColunaRequerimentos = `/html/body/div/div[6]/table/tbody/tr[${t}]`;
                    const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                    
                        if(xpathCoulaFormatadoRequerimentos.indexOf("88 - ") !== -1){
                            console.log("----LOOOOP")
                            
                            
                                const buscarData = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                                if(!buscarData) return new Error("beneficio sem data")
                                const restabelecimento = {
                                    beneficio: "cessaoOuSuspenso",
                                    data: new Date(parseInt(buscarData[0].split("/")[2]), parseInt(buscarData[0].split("/")[1]) - 1, parseInt(buscarData[0].split("/")[0]))
                                }
                                objetosEncontradosParaVerificar.push(restabelecimento)
                        }
                }
            }

            if (objetosEncontradosParaVerificar.length <= 0) {
                return true
            }

            console.log(EncontrarDataMaisAtual(objetosEncontradosParaVerificar))

            const dataAtual = EncontrarDataMaisAtual(objetosEncontradosParaVerificar)

            console.log("---DATA MAIS ATUAL: " + EncontrarDataMaisAtual(objetosEncontradosParaVerificar).data)

            const formattedDate = formatDate(dataAtual)
            console.log("----DATA FORMATADA: " + formattedDate)
            console.log("-----DATA NASC FORMATADA: " + dataNascFormatado)

            const idade = calcularIdadeIdoso(dataNascFormatado, formattedDate)
            console.log(idade)

            if (idade < 65) {
                return false;
            }

            return true;
            
    }
    
    }

    
    