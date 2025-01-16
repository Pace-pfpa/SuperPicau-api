import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";

function countChildElements(dom: JSDOMType, baseXPath: string): number {
    let count = 0;
    while (typeof getXPathText(dom, `${baseXPath}[${count + 1}]`) === 'string') {
        count++
    }
    return count;
}

function extractTableValues(dom: JSDOMType, tableXPath: string, data: string): number | null {
    const rowCount = countChildElements(dom, `${tableXPath}/tbody/tr`);

    for (let row = 1; row <= rowCount; row++) {
        for (let col = 1; col <= 7; col += 2) {
            const dateXPath = `${tableXPath}/tbody/tr[${row}]/td[${col}]`;
            const valueXPath = `${tableXPath}/tbody/tr[${row}]/td[${col + 2}]`;

            const dateContent = getXPathText(dom, dateXPath);
            const valueContent = getXPathText(dom, valueXPath);

            if (dateContent?.trim() === data) {
                return parseFloat(valueContent?.replace(/[.,]/g, m => (m === "," ? "." : "")) || "0");
            }
        }
    }

    return null;
}

function processCompetencyDiv(dom: JSDOMType, divXPath: string, seq: string, data: string): number | null {
    const divSeq = getXPathText(dom, `${divXPath}/table[1]/tbody/tr[1]/td[1]`);

    if (divSeq === seq) {
        console.log(`Matching seq found: ${seq}`);

        const remunerationTableXPath = `${divXPath}/table[2]`;
        return extractTableValues(dom, remunerationTableXPath, data);
    }

    return null;
}

export async function getRemuneracaoAjzSuperRefactor(seq: string, dom: JSDOMType, data: string): Promise<number | null> {
    try {
        const baseXPathOptions = [9, 10];

        for (const baseXPath of baseXPathOptions) {
            const baseDivXpath = `/html/body/div/div[${baseXPath}]/div`;
            const divCount = countChildElements(dom, baseDivXpath);

            for (let i = 1; i <= divCount; i++) {
                const divXPath = `${baseDivXpath}[${i}]`;
                const result = processCompetencyDiv(dom, divXPath, seq, data);

                if (result !== null) {
                    return result;
                }
            }
        }

        console.log(`No matching data found for seq: ${seq}, data: ${data}`);
        return null;
    } catch (error) {
        console.error("Error in getRemuneracaoAjzSuperRefactor:", error.message);
        return null;
    }
}