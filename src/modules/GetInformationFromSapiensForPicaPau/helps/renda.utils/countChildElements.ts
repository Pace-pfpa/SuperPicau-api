import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";

export function countChildElements(dom: JSDOMType, baseXPath: string): number {
    let count = 0;
    while (typeof getXPathText(dom, `${baseXPath}[${count + 1}]`) === 'string') {
        count++;
    }
    return count;
}
