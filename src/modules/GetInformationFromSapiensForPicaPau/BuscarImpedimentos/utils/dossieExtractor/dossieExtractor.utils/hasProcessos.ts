import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../../../shared/utils/GetTextoPorXPATH";

export async function hasProcessos(dossie: JSDOMType, divNumber: number): Promise<boolean> {
    const value = getXPathText(dossie, `/html/body/div/div[${divNumber}]/table/tbody/tr[1]/td[1]`);
    if (value.trim() === "Não há relação dos processos movidos pelo autor contra o INSS.") return false;
    return true;
}