import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { countChildElements } from "../../../../helps/renda.utils/countChildElements";
import { IRelacaoPrevidenciaria } from "../../../dtos/interfaces/IRelacaoPrevidenciaria";
import { IRelacaoPrevidenciariaDetalhada } from "../../../dtos/interfaces/IRelacaoPrevidenciariaDetalhada";
import { IRequerimentos } from "../../../dtos/interfaces/IRequerimentos";
import { getAllCessados } from "../dossieExtractor.utils/getAllCessados";
import { getFormaFiliacaoNormal } from "../dossieExtractor.utils/getFormaFiliacaoNormal";
import { getSeqCompetenciasValidas } from "../dossieExtractor.utils/getSeqCompetenciasValidas";

export async function getCompetenciasDetalhadasNormal(
    dossie: JSDOMType,
    requerimentos: IRequerimentos[],
    relacoesPrevidenciarias: IRelacaoPrevidenciaria[]
): Promise<IRelacaoPrevidenciariaDetalhada[]> {
    const arrayCompetencias: IRelacaoPrevidenciariaDetalhada[] = []; 

    const allCessados = getAllCessados(requerimentos);
    if (allCessados.length === 0) return [];

    const seqCompetenciasValidas = getSeqCompetenciasValidas(allCessados, relacoesPrevidenciarias);

    const baseXPathOptions = [6];
    for (const baseXPath of baseXPathOptions) {
        const baseDivXpath = `/html/body/div/div[${baseXPath}]/div`;
        const divCount = countChildElements(dossie, baseDivXpath);

        for (let i = 1; i <= divCount; i++) {
            const divXPath = `${baseDivXpath}[${i}]`;
            for (const seq of seqCompetenciasValidas) {
                const filiacao = await getFormaFiliacaoNormal(dossie, divXPath, seq);
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
