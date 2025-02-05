import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";

export async function extractField(dom: JSDOMType, xpath: string, errorMessage: string): Promise<string> {
    const value = getXPathText(dom, xpath);
    if (!value || value.trim().length === 0) {
        throw new Error(errorMessage);
    }
    return value.trim();
}
