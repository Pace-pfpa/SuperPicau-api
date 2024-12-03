import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { IImpeditivoRequerimentoAtivo } from "../../../dto";

export class DatasRequerimentoAtivoNewDossie {
    async handle(parginaDosPrevFormatada: any):Promise<IImpeditivoRequerimentoAtivo>{

        let impedimentoRequerimentoAtivo: string | null = null;
        let tamanhoColunasRequerimentos = 1;
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

    