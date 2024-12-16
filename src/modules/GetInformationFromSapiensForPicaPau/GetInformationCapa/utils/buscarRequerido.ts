
import { getXPathText } from '../../../../shared/utils/GetTextoPorXPATH';
import { JSDOMType } from '../../../../shared/dtos/JSDOM';

export function buscarRequerido(capa: JSDOMType): string | undefined {
    const MAX_DIVS = 10;
    const MAX_ROWS = 6;
    let requerido: string;

    for(let i = 0; i < MAX_DIVS; i++) {
        const pathTableCpf = `/html/body/div/div[${i}]`
        let tableText = getXPathText(capa, pathTableCpf);        

        if (tableText && tableText.includes("PÓLO PASSIVO")) {  
            for (let j = 0; j <= MAX_ROWS; j++) {
                const rowXpath = `html/body/div/div[${i}]/table/tbody/tr[${j}]`;
                const rowText = getXPathText(capa, rowXpath);
                const isRepresentandoAGU = /\bSIM\b/.test(rowText);

                if (rowText && isRepresentandoAGU) {

                        const match = RegExp(/(.*)\s*\(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\)/).exec(rowText);

                        if (match) {
                            requerido = match[1].trim();
                        } else {
                            console.log("Formato inválido.");
                        }
                    return requerido
                }
            }
        }
    }
    return "Sem informações"
}
