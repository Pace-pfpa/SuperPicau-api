import { extractDatesFromString } from "../../../../../shared/utils/FiltrarDatas";
import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { encontrarDataMaisAtual } from "../../../../../shared/utils/VerificarDataMaisAtual";
import { SubtrairAnoMaisAtual } from "../../../../../shared/utils/subtrairAnoAtual";


export class DatasRequerimento{
    async dataRequerimento(parginaDosPrevFormatada: any, dataSubtrair: number):Promise<Date[]>{
        //Estrutura para identificar a maior data, e fazer a subtração dela
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
         
            for(let t=2; t<tamanhoColunasRequerimentos; t++){
                if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[3]/table/tbody/tr[${t}]`)) === 'string'){
                    const xpathColunaRequerimentos = `/html/body/div/div[3]/table/tbody/tr[${t}]`;   
                    const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                    if(xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1){
                        const date: Array<Date> = extractDatesFromString(xpathCoulaFormatadoRequerimentos);
                        arrayDatas.push(...date);
                    }
                }
            }
            const dataAtual = encontrarDataMaisAtual(arrayDatas);
            const dataMenosdezesseis = SubtrairAnoMaisAtual(dataAtual, -dataSubtrair);

            return [dataAtual, dataMenosdezesseis]
    }
    
    }
