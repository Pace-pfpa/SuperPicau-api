import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../../../shared/utils/GetTextoPorXPATH";

export async function hasProcessos(dossie: JSDOMType, divNumber: number): Promise<boolean> {
    try {
        const xpathSuper = `/html/body/div/div[${divNumber}]/table/tbody/tr[1]/td[1]`;
        const xpathNormal = `/html/body/div/div[${divNumber}]/table/tbody/tr[2]/td[1]`;
        let value: string = '';
        if (divNumber === 3) {
            value = getXPathText(dossie, xpathNormal)
        } else {
            value = getXPathText(dossie, xpathSuper)
        }
        
        if (!value || value.trim() === "Não há relação dos processos movidos pelo autor contra o INSS.") return false;
        return true;
    } catch (error) {
        console.error("Erro no hasProcessos", error.message)
        return true;
    }
}