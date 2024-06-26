import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { findDatesInString } from "./findDatesInString";
import { convertCurrencyStringsToNumbers } from "./findValuesAndConvert";

export async function getRemuneracaoAjuizamentoSuper (seq: string, dosprev: string, data: string) {
    try {
        // /html/body/div/div[9]/div/table/tbody/tr/td[1]
        ///html/body/div/div[10]/div[1]

        let tamanhoDivsCompetencias = 0;
        let verificarWhileCompetencias = true;
        let supostoxpath = 9
        
        while (verificarWhileCompetencias) {
            if (typeof (getXPathText(dosprev, `/html/body/div/div[${supostoxpath}]/div[${tamanhoDivsCompetencias + 1}]`)) !== 'string') {
                verificarWhileCompetencias = false; 
                break;
            }
            //console.log(getXPathText(dosprev, `/html/body/div/div[${supostoxpath}]/div[${tamanhoDivsCompetencias + 1}]`))
            tamanhoDivsCompetencias++;
        }


        if (tamanhoDivsCompetencias === 0) {
            supostoxpath = 10
            verificarWhileCompetencias = true
            while (verificarWhileCompetencias) {
                if (typeof (getXPathText(dosprev, `/html/body/div/div[${supostoxpath}]/div[${tamanhoDivsCompetencias + 1}]`)) !== 'string') {
                    verificarWhileCompetencias = false; 
                    break;
                }
                //console.log(getXPathText(dosprev, `/html/body/div/div[${supostoxpath}]/div[${tamanhoDivsCompetencias + 1}]`))
                tamanhoDivsCompetencias++;
            }
        }

        console.log('--JABUTI')
        console.log(tamanhoDivsCompetencias)

        // DEFINIU O TANTO DE DIVS QUE CONTÉM AS COMPETÊNCIAS, AGORA É ACHAR A QUE TEM O EXATO SEQ DO PARÂMETRO

        const regexSeq = /\b\d{1,2}\b/g;

        for(let t = 0; t < tamanhoDivsCompetencias; t++) {
            if(typeof (getXPathText(dosprev,`/html/body/div/div[${supostoxpath}]/div[${t + 1}]`)) === 'string') {
                const xpathDivCompetencia = `/html/body/div/div[${supostoxpath}]/div[${t + 1}]`
                const DivFormatadaCompetencia: string = getXPathText(dosprev, xpathDivCompetencia)
                const SeqDiv = DivFormatadaCompetencia.match(regexSeq)

                if (SeqDiv[0] === seq) {
                    // ENCONTROU A DIV CORRESPONDENTE
                    if (DivFormatadaCompetencia.indexOf('Empregado') !== -1) {
                        // VÍNCULO DE EMPREGADO (ACHAR REMUNERAÇÃO)
                        // /html/body/div/div[10]/div[6]/table[2]/tbody/tr[1]


                        let tamanhoRowsRemuneracoes = 0;
                        let verificarWhileRows = true;

                        while (verificarWhileRows) {
                            if (typeof (getXPathText(dosprev, `${xpathDivCompetencia}/table[3]/tbody/tr[${tamanhoRowsRemuneracoes + 1}]`)) !== 'string') {
                                verificarWhileRows = false
                                break
                            }
                            tamanhoRowsRemuneracoes++
                        }

                        console.log('NATURAL MYSTIC')
                        console.log(tamanhoRowsRemuneracoes)


                        for (let r = 0; r <= tamanhoRowsRemuneracoes; r++) {
                            if (typeof (getXPathText(dosprev, `${xpathDivCompetencia}/table[3]/tbody/tr[${r}]`)) === 'string') {
                                const xpathRowRemuneracao = `${xpathDivCompetencia}/table[3]/tbody/tr[${r}]`
                                const rowFormatadaRemuneracao: string = getXPathText(dosprev, xpathRowRemuneracao)
                                if (rowFormatadaRemuneracao.indexOf(`${data}`) !== -1) {

                                    const arrayDatas = findDatesInString(rowFormatadaRemuneracao)
                                    console.log(arrayDatas)

                                    const arrayValues = convertCurrencyStringsToNumbers(rowFormatadaRemuneracao)
                                    console.log(arrayValues)

                                    if (arrayDatas[0] === data) {
                                        return arrayValues[0]
                                    } else if (arrayDatas[1] === data) {
                                        return arrayValues[1]
                                    }

                                }
                            }
                        }


                    } else {
                        // VÍNCULO DE RECOLHIMENTO (ACHAR SALÁRIO CONTRIBUIÇÃO)
                    }
                }
            }
        }


        // TABELA 2 RELACOES PREVIDENCIARIAS
        for(let t = 0; t < tamanhoDivsCompetencias; t++) {
            if(typeof (getXPathText(dosprev,`/html/body/div/div[${supostoxpath}]/div[${t + 1}]`)) === 'string') {
                const xpathDivCompetencia = `/html/body/div/div[${supostoxpath}]/div[${t + 1}]`
                const DivFormatadaCompetencia: string = getXPathText(dosprev, xpathDivCompetencia)
                const SeqDiv = DivFormatadaCompetencia.match(regexSeq)

                if (SeqDiv[0] === seq) {
                    // ENCONTROU A DIV CORRESPONDENTE
                    if (DivFormatadaCompetencia.indexOf('Empregado') !== -1) {
                        // VÍNCULO DE EMPREGADO (ACHAR REMUNERAÇÃO)
                        // /html/body/div/div[10]/div[6]/table[2]/tbody/tr[1]


                        let tamanhoRowsRemuneracoes = 0;
                        let verificarWhileRows = true;

                        while (verificarWhileRows) {
                            if (typeof (getXPathText(dosprev, `${xpathDivCompetencia}/table[2]/tbody/tr[${tamanhoRowsRemuneracoes + 1}]`)) !== 'string') {
                                verificarWhileRows = false
                                break
                            }
                            tamanhoRowsRemuneracoes++
                        }

                        console.log('NATURAL MYSTIC')
                        console.log(tamanhoRowsRemuneracoes)


                        for (let r = 0; r <= tamanhoRowsRemuneracoes; r++) {
                            if (typeof (getXPathText(dosprev, `${xpathDivCompetencia}/table[2]/tbody/tr[${r}]`)) === 'string') {
                                const xpathRowRemuneracao = `${xpathDivCompetencia}/table[2]/tbody/tr[${r}]`
                                const rowFormatadaRemuneracao: string = getXPathText(dosprev, xpathRowRemuneracao)
                                if (rowFormatadaRemuneracao.indexOf(`${data}`) !== -1) {

                                    const arrayDatas = findDatesInString(rowFormatadaRemuneracao)
                                    console.log(arrayDatas)

                                    const arrayValues = convertCurrencyStringsToNumbers(rowFormatadaRemuneracao)
                                    console.log(arrayValues)

                                    if (arrayDatas[0] === data) {
                                        return arrayValues[0]
                                    } else if (arrayDatas[1] === data) {
                                        return arrayValues[1]
                                    }

                                }
                            }
                        }


                    } else {
                        // VÍNCULO DE RECOLHIMENTO (ACHAR SALÁRIO CONTRIBUIÇÃO)
                    }
                }
            }
        }

        
    } catch (error) {
        console.error(error)
    }
}