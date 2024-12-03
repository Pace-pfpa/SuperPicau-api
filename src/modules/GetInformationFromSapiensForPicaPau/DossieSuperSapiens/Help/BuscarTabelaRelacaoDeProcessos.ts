import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
import { IImpeditivoLitispendencia } from "../../dto";

export async function buscarTabelaRelacaoDeProcessos(paginaDosprevFormatada: any, numeroUnicoCnj: string): Promise<IImpeditivoLitispendencia> {
    let impeditivoLitispendencia: string | null = null;

    
    ///html/body/div/div[5]/table/tbody/tr[2]/td[1]

    for (let i = 0; i < 15; i++) {
        const xpathProcessoJudicial = `/html/body/div/div[5]/table/tbody/tr[${i}]/td[1]`;
        const processoJudicial = getXPathText(paginaDosprevFormatada, xpathProcessoJudicial);

        

        if(processoJudicial !== null && processoJudicial != undefined && processoJudicial.trim().length > 0){
            
            if(processoJudicial && processoJudicial.trim().replace(/\D/g, '') !== numeroUnicoCnj.trim().replace(/\D/g, '')){
                impeditivoLitispendencia = getXPathText(paginaDosprevFormatada, `/html/body/div/div[5]/table/tbody/tr[${i}]`).trim();
                return {
                    haveLitispendencia: true,
                    litispendencia: impeditivoLitispendencia
                }
              }
        }

    }

    return {
        haveLitispendencia: false,
        litispendencia: impeditivoLitispendencia
    }

}

