import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { ILoasAtivo } from "../../dtos/ILoasAtivo";

export class LoasAtivoDossie {
    async handle(parginaDosPrevFormatada: JSDOMType): Promise<ILoasAtivo> {
        // IDENTIFICAR BENEFÍCIO ATIVO
        let tamanhoColunasRequerimentos = 1;
        let verificarWhileRequerimentos = true;
        // /html/body/div/div[3]
        while (verificarWhileRequerimentos) {
            if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[3]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
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

                            const nomeBeneficio = getXPathText(parginaDosPrevFormatada, `/html/body/div/div[3]/table/tbody/tr[${t}]/td[2]`);

                            return {
                                valorBooleano: true,
                                impeditivo: " BPC ATIVO -",
                                tipo: 1,
                                nomeImpeditivo: nomeBeneficio || "NOME DO BENEFÍCIO NÃO ENCONTRADO"
                            }
                        } else {
                            const nomeBeneficio = getXPathText(parginaDosPrevFormatada, `/html/body/div/div[3]/table/tbody/tr[${t}]/td[2]`);

                            return {
                                valorBooleano: true,
                                impeditivo: " BENEFÍCIO ATIVO -",
                                tipo: 2,
                                nomeImpeditivo: nomeBeneficio || "NOME DO BENEFÍCIO NÃO ENCONTRADO"
                            }
                        }
                      
                    }
                }
            }

            return {
                valorBooleano: false,
                impeditivo: ""
            }
            
    }
    
    }

    
    