import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { IImpeditivoRequerimentoAtivo } from "../../../dto";

export class DatasRequerimentoAtivo{
    async handle(parginaDosPrevFormatada: any):Promise<IImpeditivoRequerimentoAtivo>{
        let impedimentoRequerimentoAtivo: string = '';
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
                    if(xpathCoulaFormatadoRequerimentos.indexOf("ATIVO") !== -1){
                        impedimentoRequerimentoAtivo = xpathCoulaFormatadoRequerimentos;
                        return {
                            haveRequerimentoAtivo: true,
                            requerimentoAtivo: impedimentoRequerimentoAtivo
                        }
                    }
                }
            }

            return {
                haveRequerimentoAtivo: false,
                requerimentoAtivo: impedimentoRequerimentoAtivo
            }
            
    }
    
    }