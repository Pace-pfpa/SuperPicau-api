
import { JSDOMType } from '../../../../shared/dtos/JSDOM';
import { getXPathText } from '../../../../shared/utils/GetTextoPorXPATH';

export function tentarBuscaMultipla(dom: JSDOMType, baseXpath: string, tentativas: number): string | null {
    for (let i = 4; i < 4 + tentativas; i++) {
        const xpathAtual = baseXpath.replace("div[4]", `div[${i}]`);
        const resultado = getXPathText(dom, xpathAtual);
        if (resultado) return resultado;
    }
    return "Sem informações"
}