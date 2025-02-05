import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../../../shared/utils/GetTextoPorXPATH";

export async function getFormaFiliacaoNormal(dossie: JSDOMType, divXPath: string, seq: string): Promise<string | null> {
    try {
        const divSeq = getXPathText(dossie, `${divXPath}/table[1]/tbody/tr[2]/td[1]`);
        
        if (divSeq === seq) {
            const formaFiliacao = getXPathText(dossie, `${divXPath}/table[3]/tbody/tr[2]/td[1]`);
            return formaFiliacao;
        }
    } catch (error) {
        console.error(error.message)
        return null;   
    }
    return null;
}
