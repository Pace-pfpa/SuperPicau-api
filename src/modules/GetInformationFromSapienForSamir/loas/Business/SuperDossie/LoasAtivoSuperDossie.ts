import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";

export class LoasAtivoSuperDossie {
    async handle(parginaDosPrevFormatada: any): Promise<any> {
        // IDENTIFICAR BENEFÍCIO ATIVO
        let tamanhoColunasRequerimentos = 1;
        let verificarWhileRequerimentos = true;

        while (verificarWhileRequerimentos) {
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
                    if (xpathCoulaFormatadoRequerimentos.indexOf("ATIVO") !== -1 && xpathCoulaFormatadoRequerimentos.indexOf("226") === -1) {                       

                        if (xpathCoulaFormatadoRequerimentos.indexOf("87 - ") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("88 - ") !== -1) {
                            
        
                            return {
                                valorBooleano: true,
                                impeditivo: " BPC ATIVO -"
                            }
                        } else {

                            return {
                                valorBooleano: true,
                                impeditivo: " BENEFÍCIO ATIVO -"
                            }
                        }
                      
                    }
                }
            }
            
    }
    
    }

    
    