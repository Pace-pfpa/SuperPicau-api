import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { countChildElements } from "../../../../helps/renda.utils/countChildElements";
import { IRelacaoPrevidenciaria } from "../../../dtos/interfaces/IRelacaoPrevidenciaria";
import { IRelacaoPrevidenciariaDetalhada } from "../../../dtos/interfaces/IRelacaoPrevidenciariaDetalhada";
import { IRequerimentos } from "../../../dtos/interfaces/IRequerimentos";
import { getAllCessados } from "../dossieExtractor.utils/getAllCessados";
import { getFormaFiliacao } from "../dossieExtractor.utils/getFormaFiliacao";
import { getSeqCompetenciasValidas } from "../dossieExtractor.utils/getSeqCompetenciasValidas";

export async function getCompetenciasDetalhadasSuper(
    dossie: JSDOMType,
    requerimentos: IRequerimentos[],
    relacoesPrevidenciarias: IRelacaoPrevidenciaria[]
): Promise<IRelacaoPrevidenciariaDetalhada[]> {
    const arrayCompetencias: IRelacaoPrevidenciariaDetalhada[] = []; 

    const allCessados = getAllCessados(requerimentos);
    if (allCessados.length === 0) return [];

    const seqCompetenciasValidas = getSeqCompetenciasValidas(allCessados, relacoesPrevidenciarias);

    const baseXPathOptions = [9, 10, 11];
    for (const baseXPath of baseXPathOptions) {
        const baseDivXpath = `/html/body/div/div[${baseXPath}]/div`;
        const divCount = countChildElements(dossie, baseDivXpath);

        for (let i = 1; i <= divCount; i++) {
            const divXPath = `${baseDivXpath}[${i}]`;
            for (const seq of seqCompetenciasValidas) {
                const filiacao = await getFormaFiliacao(dossie, divXPath, seq);
                if (!filiacao) continue;

                const relPrevidenciaria = relacoesPrevidenciarias.find(rp => rp.seq === seq);
                if (!relPrevidenciaria) continue;
                
                const objetoCompetencia: IRelacaoPrevidenciariaDetalhada = {
                    ...relPrevidenciaria,
                    formaFiliacao: filiacao.trim()
                };

                arrayCompetencias.push(objetoCompetencia);
            }   
        }
    }

    return arrayCompetencias;
}
