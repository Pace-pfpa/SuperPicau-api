import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { findDatesInString } from "./findDatesInString";
import { convertCurrencyStringsToNumbers } from "./findValuesAndConvert";

export async function getRemuneracaoAjuizamentoNormal (seq: string, dosprev: string, data: string) {
    try {
        // /html/body/div/div[6]/div[1]

        let tamanhoDivsCompetencias = 0;
        let verificarWhileCompetencias = true;
        // /html/body/div/div[6]
        
        while (verificarWhileCompetencias) {
            if (typeof (getXPathText(dosprev, `/html/body/div/div[6]/div[${tamanhoDivsCompetencias + 1}]`)) !== 'string') {
                verificarWhileCompetencias = false; 
                break;
            }
            tamanhoDivsCompetencias++;
        }


        // DEFINIU O TANTO DE DIVS QUE CONTÉM AS COMPETÊNCIAS, AGORA É ACHAR A QUE TEM O EXATO SEQ DO PARÂMETRO

        const regexSeq = /\b\d{1,2}\b/g;

        for(let t = 0; t < tamanhoDivsCompetencias; t++) {
            if(typeof (getXPathText(dosprev,`/html/body/div/div[6]/div[${t + 1}]`)) === 'string') {
                const xpathDivCompetencia = `/html/body/div/div[6]/div[${t + 1}]`
                const DivFormatadaCompetencia: string = getXPathText(dosprev, xpathDivCompetencia)
                const SeqDiv = DivFormatadaCompetencia.match(regexSeq)
                // /html/body/div/div[6]/div[1]/table[3]/tbody/tr[1]
                if (SeqDiv[0] === seq) {
                    // ENCONTROU A DIV CORRESPONDENTE
                    if (DivFormatadaCompetencia.indexOf('Empregado') !== -1) {
                        // VÍNCULO DE EMPREGADO (ACHAR REMUNERAÇÃO)

                        let tamanhoRowsRemuneracoes = 0;
                        let verificarWhileRows = true;

                        while (verificarWhileRows) {
                            if (typeof (getXPathText(dosprev, `${xpathDivCompetencia}/table[3]/tbody/tr[${tamanhoRowsRemuneracoes + 1}]`)) !== 'string') {
                                verificarWhileRows = false
                                break
                            }
                            tamanhoRowsRemuneracoes++
                        }

                        // ACHOU O NÚMERO DE LINHAS DAS REMUNERAÇÕES E ITERA SOBRE TODAS

                        for (let r = 0; r <= tamanhoRowsRemuneracoes; r++) {
                            if (typeof (getXPathText(dosprev, `${xpathDivCompetencia}/table[3]/tbody/tr[${r}]`)) === 'string') {
                                const xpathRowRemuneracao = `${xpathDivCompetencia}/table[3]/tbody/tr[${r}]`
                                const rowFormatadaRemuneracao: string = getXPathText(dosprev, xpathRowRemuneracao)
                                if (rowFormatadaRemuneracao.indexOf(`${data}`) !== -1) {

                                    const arrayDatas = findDatesInString(rowFormatadaRemuneracao)
                                    console.log(arrayDatas)

                                    const arrayValues = convertCurrencyStringsToNumbers(rowFormatadaRemuneracao)
                                    console.log(arrayValues)

                                    console.log(arrayDatas.length)
                                    console.log(arrayValues.length)

                                    if(arrayDatas.length === 1 && arrayValues.length === 2) {
                                        return arrayValues[1]
                                    }

                                    if (arrayDatas[0] === data) {
                                        return arrayValues[0]
                                    } else if (arrayDatas[1] === data) {
                                        return arrayValues[1]
                                    }

                                }
                            }
                        }

                        return 0

                    } else {
                        // VÍNCULO DE RECOLHIMENTO (ACHAR SALÁRIO CONTRIBUIÇÃO)
                    }
                }
            }
        }

        return null

    } catch (error) {
        console.error(error)
    }
}