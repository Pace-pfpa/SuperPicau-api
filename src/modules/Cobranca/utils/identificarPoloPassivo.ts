import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";

export function identificarPoloPassivo(
    capa: JSDOMType, 
    divInteressados: number
): { nome: string, isEmpresa: boolean } {
    let nome: string = '';

    const baseXPath = `/html/body/div/div[${divInteressados}]/table/tbody`
    
    for (let baseTableRow = 2; baseTableRow < 7; baseTableRow++) {
        let modalidade = getXPathText(capa, `${baseXPath}/tr[${baseTableRow}]/td[2]`)
        if (!modalidade.includes('PÓLO PASSIVO')) continue;
        
        let representandoAGU = getXPathText(capa, `${baseXPath}/tr[${baseTableRow}]/td[3]`)
        if (representandoAGU !== "NÃO") continue;

        nome = getXPathText(capa, `${baseXPath}/tr[${baseTableRow}]/td[1]`)
        if (nome) break
    }

    let isEmpresa = verificarEmpresa(nome);

    return { nome: nome.trim().replace(/\s+/g, ' '), isEmpresa }
}

function verificarEmpresa(passivo: string): boolean {
    const regexCNPJ = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/;
    const regexCPF = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/;

    return regexCNPJ.test(passivo) && !regexCPF.test(passivo);
}