import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
import { IImpeditivoLitispendencia } from "../../dto";

export async function buscarTabelaRelacaoDeProcessosNormalDossie(paginaDosprevFormatada: any, numeroUnicoCnj: string): Promise<IImpeditivoLitispendencia> {
    let impeditivoLitispendencia: string[] = [];


    for (let i = 1; i <= 15; i++) {
        const xpathProcessoJudicial = `/html/body/div/div[2]/table/tbody/tr[${i}]/td[1]`;
        const processoJudicial = getXPathText(paginaDosprevFormatada, xpathProcessoJudicial);

        if (processoJudicial === null) break;

        if (processoJudicial && processoJudicial.trim().length > 0) {
            const numeroProcesso = processoJudicial.trim().replace(/\D/g, "");
            const numeroUnicoNormalizado = numeroUnicoCnj.trim().replace(/\D/g, "");
      
            if (numeroProcesso !== numeroUnicoNormalizado) {
              impeditivoLitispendencia.push(processoJudicial.trim());
            }
        }
    }    

    return {
        haveLitispendencia: impeditivoLitispendencia.length > 0,
        litispendencia: impeditivoLitispendencia
    }
}

