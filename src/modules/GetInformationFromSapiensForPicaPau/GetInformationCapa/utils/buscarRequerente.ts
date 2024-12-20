
import { getXPathText } from '../../../../shared/utils/GetTextoPorXPATH';
import { JSDOMType } from '../../../../shared/dtos/JSDOM';

export function buscarRequerente(capa: JSDOMType): {nome: string; cpf: string} | undefined {
    const MAX_DIVS = 10;
    const MAX_ROWS = 6;
    let requerente: string;
    let requerente_cpf: string;

    for(let i = 0; i < MAX_DIVS; i++) {
        const pathTableCpf = `/html/body/div/div[${i}]`
        let tableText = getXPathText(capa, pathTableCpf);        
        ///html/body/div/div[6]/table/tbody/tr[6]/td[1]/text()

        if (tableText && tableText.includes("PÓLO ATIVO")) {  
            for (let j = 0; j <= MAX_ROWS; j++) {
                const rowXpath = `html/body/div/div[${i}]/table/tbody/tr[${j}]`;
                const rowText = getXPathText(capa, rowXpath);

                if (rowText) {
                    const isPoloAtivo = rowText.includes("PÓLO ATIVO");
                    const isRepresentandoAGU = /\bSIM\b/.test(rowText);
                    ///html/body/div/div[6]/table/tbody/tr[3]/td[1]

                    if (isPoloAtivo && !isRepresentandoAGU) {
                        const newRowXpath = `html/body/div/div[${i}]/table/tbody/tr[${j}]/td[1]`;
                        const newRowText = getXPathText(capa, newRowXpath);
                        let nomePoloAtivo = newRowText.split("(")[0];
                        nomePoloAtivo = nomePoloAtivo.replace(/\n/g, '').trim();

                        const match = RegExp(/(.*)\((\d{3}\.\d{3}\.\d{3}-\d{2})\)/).exec(newRowText);

                        if (match) {
                            requerente = nomePoloAtivo;
                            requerente_cpf = match[2];
                        } else {
                            console.log("Formato inválido.");
                        }

                        return {nome: requerente, cpf: requerente_cpf}
                    }

                }
            }
        }
    }
    return undefined
}
