import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { isDateInRange } from "../../dataIsInRange";
import { parseDate } from "../../parseDate";
import { removeDayFromDate } from "../../removeDayFromDate";
import { getRemuneracaoAjzNormal } from "./getRemuneracaoAjzNormal";

type RelacaoPrevidenciaria = {
    seq: string;
    dataInicio: Date;
    dataFim: Date | null;
    originalString: string;
};

async function getRelacoesPrevidenciarias(dom: JSDOMType): Promise<RelacaoPrevidenciaria[]> {
    const relacoes: RelacaoPrevidenciaria[] = [];
    const baseXPath = `/html/body/div/div[4]/table/tbody/tr`;
    const rowCount = countChildElements(dom, baseXPath)

    for (let i = 1; i <= rowCount; i++) {
        const rowXPath = `${baseXPath}[${i}]`;
        const rowContent = getXPathText(dom, rowXPath);

        if (typeof rowContent === 'string' && !rowContent.includes('Benefício')) {
            const seq = (rowContent.match(/\b\d{1,2}\b/g) || [])[0];
            const dates = (rowContent.match(/\b(?:\d{1,2}\/)?\d{1,2}\/\d{4}\b/g) || []).map(parseDate);

            if (seq && dates.length > 0) {
                relacoes.push({
                    seq,
                    dataInicio: dates[0],
                    dataFim: dates[1] || null,
                    originalString: rowContent,
                })
            }
        }
    }

    return relacoes;
}

async function getRemuneracoes(
    seqAjz: string, 
    seqReq: string,
    dom: JSDOMType, 
    dates: { ajuizamento: string, requerimento: string },
) {
    const remuneracaoAjuizamento = await getRemuneracaoAjzNormal(seqAjz, dom, dates.ajuizamento);
    const remuneracaoRequerimento = await getRemuneracaoAjzNormal(seqReq, dom, dates.requerimento);

    console.log(`Remunerations found: Ajuizamento = ${remuneracaoAjuizamento}, Requerimento = ${remuneracaoRequerimento}`);

    if (remuneracaoAjuizamento && remuneracaoRequerimento) {
        return { 
            remuneracaoAjz: remuneracaoAjuizamento, 
            remuneracaoReq: remuneracaoRequerimento, 
            isFallback: false, 
            fallbackInfo: null
        };
    }

    if (remuneracaoAjuizamento && !remuneracaoRequerimento) {
        return { 
            remuneracaoAjz: remuneracaoAjuizamento, 
            remuneracaoReq: 0, 
            isFallback: false, 
            fallbackInfo: null
        };
    } else if (!remuneracaoAjuizamento && remuneracaoRequerimento) {
        return { 
            remuneracaoAjz: 0, 
            remuneracaoReq: remuneracaoRequerimento, 
            isFallback: false, 
            fallbackInfo: null
        };
    }

    return { 
        remuneracaoAjz: 0, 
        remuneracaoReq: 0, 
        isFallback: false, 
        fallbackInfo: null 
    };
}

function countChildElements(dom: JSDOMType, baseXPath: string): number {
    let count = 0;
    while (typeof getXPathText(dom, `${baseXPath}[${count + 1}]`) === 'string') {
        count++;
    }
    return count;
}

export async function getValueCalcDossieNormal(
    dossie: JSDOMType,
    dataAjuizamento: string, 
    dataRequerimento: string
) {
    try {
        const relacoes = await getRelacoesPrevidenciarias(dossie);
        if (relacoes.length === 0) {
            throw new Error('No previdenciary relations found.');
        }

        const seqIntervaloAjuizamento = isDateInRange(relacoes, parseDate(dataAjuizamento));
        const seqIntervaloRequerimento = isDateInRange(relacoes, parseDate(dataRequerimento));

        console.log(`Seq for Ajuizamento: ${seqIntervaloAjuizamento}, Seq for Requerimento: ${seqIntervaloRequerimento}`);

        return await getRemuneracoes(
            seqIntervaloAjuizamento || '',
            seqIntervaloRequerimento || '',
            dossie,
            { ajuizamento: removeDayFromDate(dataAjuizamento), requerimento: removeDayFromDate(dataRequerimento) },
        );
    } catch (error) {
        console.error('Error in getValueCalcDossieNormalRefactor:', error.message);
        return { remuneracaoAjz: 0, remuneracaoReq: 0, isFallback: false, fallbackInfo: null };
    }
}