import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { findDatesInString } from "./findDatesInString";
import { convertCurrencyStringsToNumbers } from "./findValuesAndConvert";
import { JSDOM } from 'jsdom';

export async function getRemuneracaoAjuizamentoSuper (seq: string, dosprev: string, data: string) {
    try {
        const dom = new JSDOM(dosprev);

        let tamanhoDivsCompetencias = 0;
        let verificarWhileCompetencias = true;
        let supostoxpath = 9
        
        while (verificarWhileCompetencias) {
            if (typeof (getXPathText(dom, `/html/body/div/div[${supostoxpath}]/div[${tamanhoDivsCompetencias + 1}]`)) !== 'string') {
                verificarWhileCompetencias = false; 
                break;
            }

            tamanhoDivsCompetencias++;
        }


        if (tamanhoDivsCompetencias === 0) {
            supostoxpath = 10
            verificarWhileCompetencias = true
            while (verificarWhileCompetencias) {
                if (typeof (getXPathText(dom, `/html/body/div/div[${supostoxpath}]/div[${tamanhoDivsCompetencias + 1}]`)) !== 'string') {
                    verificarWhileCompetencias = false; 
                    break;
                }

                tamanhoDivsCompetencias++;
            }
        }

        console.log('--JABUTI')
        console.log(tamanhoDivsCompetencias)

        // DEFINIU O TANTO DE DIVS QUE CONTÉM AS COMPETÊNCIAS, AGORA É ACHAR A QUE TEM O EXATO SEQ DO PARÂMETRO

        const regexSeq = /\b\d{1,2}\b/g;

        for(let t = 0; t < tamanhoDivsCompetencias; t++) {
            if(typeof (getXPathText(dom,`/html/body/div/div[${supostoxpath}]/div[${t + 1}]`)) === 'string') {
                const xpathDivCompetencia = `/html/body/div/div[${supostoxpath}]/div[${t + 1}]`
                const DivFormatadaCompetencia: string = getXPathText(dom, xpathDivCompetencia)
                const SeqDiv = DivFormatadaCompetencia.match(regexSeq)


                if (SeqDiv[0] === seq) {
                    // ENCONTROU A DIV CORRESPONDENTE
                    if (DivFormatadaCompetencia.indexOf('Empregado') !== -1) {
                        // VÍNCULO DE EMPREGADO (ACHAR REMUNERAÇÃO)
                        // /html/body/div/div[10]/div[6]/table[2]/tbody/tr[1]


                        let tamanhoRowsRemuneracoes = 0;
                        let verificarWhileRows = true;

                        while (verificarWhileRows) {
                            if (typeof (getXPathText(dom, `${xpathDivCompetencia}/table[3]/tbody/tr[${tamanhoRowsRemuneracoes + 1}]`)) !== 'string') {
                                verificarWhileRows = false
                                break
                            }
                            tamanhoRowsRemuneracoes++
                        }

                        console.log('NATURAL MYSTIC')
                        console.log(tamanhoRowsRemuneracoes)


                        for (let r = 0; r <= tamanhoRowsRemuneracoes; r++) {
                            if (typeof (getXPathText(dom, `${xpathDivCompetencia}/table[3]/tbody/tr[${r}]`)) === 'string') {
                                const xpathRowRemuneracao = `${xpathDivCompetencia}/table[3]/tbody/tr[${r}]`
                                const rowFormatadaRemuneracao: string = getXPathText(dom, xpathRowRemuneracao)
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


                    } else if (DivFormatadaCompetencia.indexOf('RECOLHIMENTO') !== -1) {
                        // VÍNCULO DE RECOLHIMENTO (ACHAR SALÁRIO CONTRIBUIÇÃO)
                        ///html/body/div/div[10]/div[12]/table[2]/tbody/tr[1]
                        

                        let tamanhoRowsContribuicoes = 0;
                        let verificarWhileRows = true;

                        while (verificarWhileRows) {
                            if (typeof (getXPathText(dom, `${xpathDivCompetencia}/table[2]/tbody/tr[${tamanhoRowsContribuicoes + 1}]`)) !== 'string') {
                                verificarWhileRows = false
                                break
                            }
                            tamanhoRowsContribuicoes++
                        }

                        console.log('SUN IS SHINING')
                        console.log(tamanhoRowsContribuicoes)


                        for (let r = 0; r <= tamanhoRowsContribuicoes; r++) {
                            if (typeof (getXPathText(dom, `${xpathDivCompetencia}/table[2]/tbody/tr[${r}]`)) === 'string') {
                                const xpathRowRemuneracao = `${xpathDivCompetencia}/table[2]/tbody/tr[${r}]`
                                const rowFormatadaRemuneracao: string = getXPathText(dom, xpathRowRemuneracao)
                                if (rowFormatadaRemuneracao.indexOf(`${data}`) !== -1) {
                                    //console.log(rowFormatadaRemuneracao)

                                    const arrayDatas = findDatesInString(rowFormatadaRemuneracao)
                                    console.log(arrayDatas)

                                    console.log('--VALORES ACHADOS')
                                    const arrayValues = convertCurrencyStringsToNumbers(rowFormatadaRemuneracao)
                                    console.log(arrayValues)

                                    if (arrayDatas[0] === data) {
                                        return arrayValues[2]
                                    } else if (arrayDatas[2] === data) {
                                        return arrayValues[5]
                                    }

                                }
                            }
                        }

                    }
                }
            }
        }


        // TABELA 2 RELACOES PREVIDENCIARIAS
        for(let t = 0; t < tamanhoDivsCompetencias; t++) {
            if(typeof (getXPathText(dom,`/html/body/div/div[${supostoxpath}]/div[${t + 1}]`)) === 'string') {
                const xpathDivCompetencia = `/html/body/div/div[${supostoxpath}]/div[${t + 1}]`
                const DivFormatadaCompetencia: string = getXPathText(dom, xpathDivCompetencia)
                const SeqDiv = DivFormatadaCompetencia.match(regexSeq)

                if (SeqDiv[0] === seq) {
                    // ENCONTROU A DIV CORRESPONDENTE
                    if (DivFormatadaCompetencia.indexOf('Empregado') !== -1) {
                        // VÍNCULO DE EMPREGADO (ACHAR REMUNERAÇÃO)
                        // /html/body/div/div[10]/div[6]/table[2]/tbody/tr[1]


                        let tamanhoRowsRemuneracoes = 0;
                        let verificarWhileRows = true;

                        while (verificarWhileRows) {
                            if (typeof (getXPathText(dom, `${xpathDivCompetencia}/table[2]/tbody/tr[${tamanhoRowsRemuneracoes + 1}]`)) !== 'string') {
                                verificarWhileRows = false
                                break
                            }
                            tamanhoRowsRemuneracoes++
                        }

                        console.log('NATURAL MYSTIC 2')
                        console.log(tamanhoRowsRemuneracoes)


                        for (let r = 0; r <= tamanhoRowsRemuneracoes; r++) {
                            if (typeof (getXPathText(dom, `${xpathDivCompetencia}/table[2]/tbody/tr[${r}]`)) === 'string') {
                                const xpathRowRemuneracao = `${xpathDivCompetencia}/table[2]/tbody/tr[${r}]`
                                const rowFormatadaRemuneracao: string = getXPathText(dom, xpathRowRemuneracao)
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
                                        return arrayValues[1]
                                    } else if (arrayDatas[1] === data) {
                                        return arrayValues[3]
                                    }

                                }
                            }
                        }


                    } else if (DivFormatadaCompetencia.indexOf('RECOLHIMENTO') !== -1) {
                        // VÍNCULO DE RECOLHIMENTO (ACHAR SALÁRIO CONTRIBUIÇÃO)
                        ///html/body/div/div[10]/div[12]/table[2]/tbody/tr[1]
                        

                        let tamanhoRowsContribuicoes = 0;
                        let verificarWhileRows = true;

                        while (verificarWhileRows) {
                            if (typeof (getXPathText(dom, `${xpathDivCompetencia}/table[2]/tbody/tr[${tamanhoRowsContribuicoes + 1}]`)) !== 'string') {
                                verificarWhileRows = false
                                break
                            }
                            tamanhoRowsContribuicoes++
                        }

                        console.log('SUN IS SHINING')
                        console.log(tamanhoRowsContribuicoes)


                        for (let r = 0; r <= tamanhoRowsContribuicoes; r++) {
                            if (typeof (getXPathText(dom, `${xpathDivCompetencia}/table[2]/tbody/tr[${r}]`)) === 'string') {
                                const xpathRowRemuneracao = `${xpathDivCompetencia}/table[2]/tbody/tr[${r}]`
                                const rowFormatadaRemuneracao: string = getXPathText(dom, xpathRowRemuneracao)
                                if (rowFormatadaRemuneracao.indexOf(`${data}`) !== -1) {
                                    //console.log(rowFormatadaRemuneracao)

                                    const arrayDatas = findDatesInString(rowFormatadaRemuneracao)
                                    console.log(arrayDatas)

                                    console.log('--VALORES ACHADOS')
                                    const arrayValues = convertCurrencyStringsToNumbers(rowFormatadaRemuneracao)
                                    console.log(arrayValues)

                                    if (arrayDatas[0] === data) {
                                        return arrayValues[2]
                                    } else if (arrayDatas[2] === data) {
                                        return arrayValues[5]
                                    }

                                }
                            }
                        }

                    }
                }
            }
        }

        
    } catch (error) {
        console.error(error)
    }
}