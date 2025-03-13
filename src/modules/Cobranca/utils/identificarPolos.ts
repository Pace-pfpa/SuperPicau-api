import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { countChildElements } from "../../GetInformationFromSapiensForPicaPau/helps/renda.utils/countChildElements";

export interface PoloInfo {
    nome: string;
    isEmpresa: boolean;
}

export function identificarPolos(
    capa: JSDOMType, 
    divInteressados: number
): { poloAtivo: PoloInfo, poloPassivo: PoloInfo[] } {
    const baseXPath = `/html/body/div/div[${divInteressados}]/table/tbody`
    
    const defaultPolo = { nome: '', isEmpresa: false };
    const result: { poloAtivo: PoloInfo, poloPassivo: PoloInfo[] } = {
        poloAtivo: { ...defaultPolo },
        poloPassivo: []
    };

    const divCount = countChildElements(capa, `${baseXPath}/tr`);

    for (let baseTableRow = 2; baseTableRow <= divCount; baseTableRow++) {
        const nome = getXPathText(capa, `${baseXPath}/tr[${baseTableRow}]/td[1]`);
        const modalidade = getXPathText(capa, `${baseXPath}/tr[${baseTableRow}]/td[2]`);
        const representandoAGU = getXPathText(capa, `${baseXPath}/tr[${baseTableRow}]/td[3]`);
            
        if (!result.poloAtivo.nome && modalidade.includes('PÓLO ATIVO')) {
            const [nomeFormatado, _resto] = cortarNoPrimeiroParentese(formatarNome(nome))
            result.poloAtivo = {
                nome: nomeFormatado,
                isEmpresa: false
            };
        }
            
        if (modalidade.includes('PÓLO PASSIVO') && representandoAGU === "NÃO") {
            result.poloPassivo.push({
                nome: formatarNome(nome),
                isEmpresa: verificarEmpresa(nome)
            })
        }
    }

    if (!result.poloAtivo.nome) throw new Error('POLO ATIVO NÃO ENCONTRADO')
    if (result.poloPassivo.length === 0) throw new Error('POLO PASSIVO NÃO ENCONTRADO')
    
    return result;
}

function verificarEmpresa(passivo: string): boolean {
    const regexCNPJ = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/;
    const regexCPF = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/;

    return regexCNPJ.test(passivo) && !regexCPF.test(passivo);
}

function formatarNome(nome: string): string {
    return nome.trim().replace(/\s+/g, ' ');
}

function cortarNoPrimeiroParentese(texto: string): [string, string] {
    const [parte1, parte2] = texto.split(/(\))/, 2);
    return parte2 
        ? [`${parte1})`, parte2 + texto.slice((parte1 + parte2).length)] 
        : [texto, ''];
}