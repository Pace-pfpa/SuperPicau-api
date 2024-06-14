import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";

export class LoasAtivoDossie {
    async handle(parginaDosPrevFormatada: any): Promise<any> {
        // IDENTIFICAR BENEFÍCIO ATIVO
        let tamanhoColunasRequerimentos = 1;
        let verificarWhileRequerimentos = true;
        // /html/body/div/div[3]
        while (verificarWhileRequerimentos) {
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[3]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
                verificarWhileRequerimentos = false; 
                break;
            }
            tamanhoColunasRequerimentos++;
        }

            for(let t=1; t<tamanhoColunasRequerimentos; t++){
                if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[3]/table/tbody/tr[${t}]`)) === 'string'){
                    const xpathColunaRequerimentos = `/html/body/div/div[3]/table/tbody/tr[${t}]`;
                    const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                    if (xpathCoulaFormatadoRequerimentos.indexOf("ATIVO") !== -1) {
                        if (xpathCoulaFormatadoRequerimentos.indexOf("87 - ") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("88 - ") !== -1) {
                            // IMPEDITIVOS: LOAS ATIVO
                            return {
                                valorBooleano: true,
                                impeditivo: " LOAS ATIVO -"
                            }
                        } else {
                            // IMPEDITIVOS: BENEFÍCIO ATIVO
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

    
    