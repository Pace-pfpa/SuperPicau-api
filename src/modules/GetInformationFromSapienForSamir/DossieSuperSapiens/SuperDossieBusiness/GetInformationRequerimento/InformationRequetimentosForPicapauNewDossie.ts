import { extractDatesFromString } from "../../../../../helps/FiltrarDatas";
import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";
import { encontrarDataMaisAtual } from "../../../../../helps/VerificarDataMaisAtual";
import { SubtrairAnoMaisAtual } from "../../../../../helps/subtrairAnoAtual";


export class DatasRequerimentoNewDossie{
    async dataRequerimento(parginaDosPrevFormatada: any, dataSubtrair: number):Promise<Date[]>{
        //Estrutura para identificar a maior data, e fazer a subtração dela
        let tamanhoColunasRequerimentos = 1;
        const arrayDatas: Array<Date> = [];
        let verificarWhileRequerimentos = true;
        while(verificarWhileRequerimentos){
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[6]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
                verificarWhileRequerimentos = false; 
                break;
            }
            tamanhoColunasRequerimentos++;
        }
            for(let t=1; t<tamanhoColunasRequerimentos; t++){
                if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[6]/table/tbody/tr[${t}]`)) === 'string'){
                    const xpathColunaRequerimentos = `/html/body/div/div[6]/table/tbody/tr[${t}]`;
                    const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                    if(xpathCoulaFormatadoRequerimentos.indexOf("INDEFERIDO") !== -1){
                        const date: Array<Date> = extractDatesFromString(xpathCoulaFormatadoRequerimentos);
                        arrayDatas.push(...date);
                    }
                }
            }
            const dataAtual = encontrarDataMaisAtual(arrayDatas);
            const dataMenosdezesseis = SubtrairAnoMaisAtual(dataAtual, -16);
            return [dataAtual, dataMenosdezesseis]
    }
    
}
