import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { buscardatasLoas } from "../Help/BuscarDatas";
import { EncontrarDataMaisAtual } from "../Help/EncontrarDataMaisAtual";
import { formatDate } from "../Help/FormatarDataLoas";
import { calcularIdadeIdoso } from "../Help/CalcularIdadeIdoso";
import { correçaoDoErroDeFormatoDoSapiens } from "../../../../../shared/utils/CorreçaoDoErroDeFormatoDoSapiens";
import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { IIdadeDTO } from "../../../DossieSuperSapiens/SuperDossieBusiness/CalcularIdade/dtos/IIdadeDTO";

export class LoasIdadeDossie {
    async handle(parginaDosPrevFormatada: JSDOMType): Promise<{ idadeImpeditivo: boolean; idadeAutor: IIdadeDTO }> {

        const dataNascXpath: string = "/html/body/div/div[4]/table/tbody/tr[8]/td";
        const dataNascFormatado: string = correçaoDoErroDeFormatoDoSapiens(getXPathText(parginaDosPrevFormatada, dataNascXpath));


        let tamanhoColunasRequerimentos = 1;
        let verificarWhileRequerimentos = true;
        // Mapeia a quantidade de requerimentos
        while(verificarWhileRequerimentos){
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[3]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
                break;
            }
            tamanhoColunasRequerimentos++;
        }
        // Itera sobre os requerimentos buscando por status
        const objetosEncontradosParaVerificar = []
            for(let t=1; t<tamanhoColunasRequerimentos; t++){
                if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[3]/table/tbody/tr[${t}]`)) === 'string'){
                    const xpathColunaRequerimentos = `/html/body/div/div[3]/table/tbody/tr[${t}]`;
                    const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                    
                        if(xpathCoulaFormatadoRequerimentos.indexOf("88 - ") !== -1){
                            
                                const buscarData = buscardatasLoas(xpathCoulaFormatadoRequerimentos);
                                if(!buscarData) throw new Error("beneficio sem data")
                                const restabelecimento = {
                                    beneficio: "cessaoOuSuspenso",
                                    data: new Date(parseInt(buscarData[0].split("/")[2]), parseInt(buscarData[0].split("/")[1]) - 1, parseInt(buscarData[0].split("/")[0]))
                                }
                                objetosEncontradosParaVerificar.push(restabelecimento)
                        }
                }
            }

            if (objetosEncontradosParaVerificar.length <= 0) {
                return {
                    idadeImpeditivo: false,
                    idadeAutor: {
                        dataAjuizamento: null,
                        dataNascimento: null,
                        idade: null
                    }
                }
            }

            const dataAtual = EncontrarDataMaisAtual(objetosEncontradosParaVerificar).data
            if (!dataAtual) {
                console.error('Data não encontrada')
                return {
                    idadeImpeditivo: false,
                    idadeAutor: {
                        dataAjuizamento: null,
                        dataNascimento: null,
                        idade: null
                    }
                }
            }

            console.log("---DATA MAIS ATUAL: " + EncontrarDataMaisAtual(objetosEncontradosParaVerificar).data)

            const formattedDate = formatDate(dataAtual)
            console.log("----DATA FORMATADA: " + formattedDate)
            console.log("-----DATA NASC FORMATADA: " + dataNascFormatado)

            const idade = calcularIdadeIdoso(dataNascFormatado, formattedDate)
            console.log(idade)

            if (idade < 65) {
                return {
                    idadeImpeditivo: true,
                    idadeAutor: {
                        dataAjuizamento: formattedDate,
                        dataNascimento: dataNascFormatado,
                        idade: idade
                    }
                }
                
            }

            return {
                idadeImpeditivo: false,
                idadeAutor: {
                    dataAjuizamento: null,
                    dataNascimento: null,
                    idade: null
                }
            }
            
    }
    
}