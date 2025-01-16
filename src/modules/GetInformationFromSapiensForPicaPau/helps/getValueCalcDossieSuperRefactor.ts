import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { getDocumentoUseCase } from "../../GetDocumento";
import { parseDate } from "./parseDate";
import { isDateInRange } from "./dataIsInRange";
import { getRemuneracaoAjzSuperRefactor } from "./getRemuneracaoAjzSuperRefactor";
import { removeDayFromDate } from "./removeDayFromDate";
import { parseDateToString } from "./parseDateToString";
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
const { JSDOM } = require('jsdom'); 

type RelacaoPrevidenciaria = {
    seq: string;
    dataInicio: Date;
    dataFim: Date | null;
    originalString: string;
};

async function getRelacoesPrevidenciarias(dom: JSDOMType): Promise<RelacaoPrevidenciaria[]> {
    const relacoes: RelacaoPrevidenciaria[] = [];
    const baseXPath = `/html/body/div/div[7]/table/tbody/tr`;
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
    fallbackSeq: string | null, 
    fallbackDate: string | null
) {
    const remuneracaoAjuizamento = await getRemuneracaoAjzSuperRefactor(seqAjz, dom, dates.ajuizamento);
    const remuneracaoRequerimento = await getRemuneracaoAjzSuperRefactor(seqReq, dom, dates.requerimento);

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

    if (fallbackSeq && fallbackDate) {
        const fallbackRemuneracao = await getRemuneracaoAjzSuperRefactor(fallbackSeq, dom, fallbackDate);
        return {
            remuneracaoAjz: remuneracaoAjuizamento || fallbackRemuneracao || 0,
            remuneracaoReq: remuneracaoRequerimento || fallbackRemuneracao || 0,
            isFallback: true,
            fallbackInfo: {
                fallbackRemuneracao: fallbackRemuneracao || 0,
                fallbackDate: fallbackDate
            }
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

export async function getValueCalcDossieSuperRefactor(
    cookie: string, 
    superDossie: ResponseArvoreDeDocumentoDTO, 
    dataAjuizamento: string, 
    dataRequerimento: string
) {
    try {
        const idDosprevParaPesquisaDossieSuper = superDossie.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrevDossieSuper = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieSuper });
        const dom = new JSDOM(paginaDosPrevDossieSuper);

        const relacoes = await getRelacoesPrevidenciarias(dom);
        if (relacoes.length === 0) {
            throw new Error('No previdenciary relations found.');
        }

        const mostRecentRelacao = relacoes.reduce((mostRecent, relacao) => {
            if (!relacao.dataFim) return mostRecent;
            return !mostRecent || relacao.dataFim > mostRecent.dataFim ? relacao : mostRecent;
        }, null)

        const seqIntervaloAjuizamento = isDateInRange(relacoes, parseDate(dataAjuizamento));
        const seqIntervaloRequerimento = isDateInRange(relacoes, parseDate(dataRequerimento));

        console.log(`Seq for Ajuizamento: ${seqIntervaloAjuizamento}, Seq for Requerimento: ${seqIntervaloRequerimento}`);

        return await getRemuneracoes(
            seqIntervaloAjuizamento || mostRecentRelacao?.seq || '',
            seqIntervaloRequerimento || mostRecentRelacao?.seq || '',
            dom,
            { ajuizamento: removeDayFromDate(dataAjuizamento), requerimento: removeDayFromDate(dataRequerimento) },
            mostRecentRelacao?.seq || null,
            mostRecentRelacao ? removeDayFromDate(parseDateToString(mostRecentRelacao.dataFim)) : null
        );
    } catch (error) {
        console.error('Error in getValueCalcDossieSuperRefactor:', error.message);
        return { remuneracaoAjz: 0, remuneracaoReq: 0, isFallback: false, fallbackInfo: null };
    }
}