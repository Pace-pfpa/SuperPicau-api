import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../../../shared/utils/GetTextoPorXPATH";

export async function hasRelacoesPrevidenciarias(dossie: JSDOMType, divNumber: number): Promise<boolean> {
    try {
        const xpathSuper = `/html/body/div/div[${divNumber}]/table/tbody/tr[1]/td[1]`;
        const xpathNormal = `/html/body/div/div[${divNumber}]/table/tbody/tr[2]/td[1]`;
        let value: string = '';
        if (divNumber === 4) {
            value = getXPathText(dossie, xpathNormal)
        } else {
            value = getXPathText(dossie, xpathSuper)
        }

        if (!value || value.trim() === "Não há Relação Previdenciária") return false;
        return true;
    } catch (error) {
        console.error("Erro no hasRelacoesPrevidenciarias", error.message)
        return true;
    }
}