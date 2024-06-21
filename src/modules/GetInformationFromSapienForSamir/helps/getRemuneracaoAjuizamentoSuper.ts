import { getXPathText } from "../../../helps/GetTextoPorXPATH";

export async function getRemuneracaoAjuizamentoSuper (seq: string, dosprev: string) {
    try {
        // /html/body/div/div[9]/div/table/tbody/tr/td[1]

        let tamanhoDivsCompetencias = 0;
        let verificarWhileCompetencias = true;
        
        while (verificarWhileCompetencias) {
            if (typeof (getXPathText(dosprev, `/html/body/div/div[9]/div[${tamanhoDivsCompetencias + 1}]`)) !== 'string') {
                verificarWhileCompetencias = false; 
                break;
            }
            console.log(getXPathText(dosprev, `/html/body/div/div[9]/div[${tamanhoDivsCompetencias + 1}]`))
            tamanhoDivsCompetencias++;
        }

        // DEFINIU O TANTO DE DIVS QUE CONTÉM AS COMPETÊNCIAS, AGORA É ACHAR A QUE TEM O EXATO SEQ DO PARÂMETRO

        const regexSeq = /\b\d{1,2}\b/g;

        for(let t = 0; t < tamanhoDivsCompetencias; t++) {
            if(typeof (getXPathText(dosprev,`/html/body/div/div[9]/div[${t + 1}]`)) === 'string') {
                const xpathDivCompetencia = `/html/body/div/div[9]/div[${t + 1}]`
                const DivFormatadaCompetencia: string = getXPathText(dosprev, xpathDivCompetencia)
                const SeqDiv = DivFormatadaCompetencia.match(regexSeq)

                if (SeqDiv[0] === seq) {
                    // ENCONTROU A DIV CORRESPONDENTE
                    if (DivFormatadaCompetencia.indexOf('Empregado') !== -1) {
                        // VÍNCULO DE EMPREGADO (ACHAR REMUNERAÇÃO)
                    } else {
                        // VÍNCULO DE RECOLHIMENTO (ACHAR SALÁRIO CONTRIBUIÇÃO)
                    }
                }
            }
        }

        
    } catch (error) {
        
    }
}