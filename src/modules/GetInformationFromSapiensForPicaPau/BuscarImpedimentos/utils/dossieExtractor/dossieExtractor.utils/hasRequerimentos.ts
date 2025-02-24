import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../../../shared/utils/GetTextoPorXPATH";

export async function hasRequerimentos(dossie: JSDOMType, divNumber: number): Promise<boolean> {
    try {
        const xpathSuper = `/html/body/div/div[${divNumber}]/table/tbody/tr[1]/td[1]`;
        const xpathNormal = `/html/body/div/div[${divNumber}]/table/tbody/tr[2]/td[1]`;
        let value: string = '';
        if (divNumber === 3) {
            value = getXPathText(dossie, xpathNormal)
        } else {
            value = getXPathText(dossie, xpathSuper)
        }
    
        if (!value || value.trim() === "Não foram encontrados requerimentos em nome do autor.") return false;
        return true;
    } catch (error) {
        console.error("Erro no hasRequerimentos", error.message)
        return true;
    }
}
