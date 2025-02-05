import { JSDOMType } from "../../../../../../shared/dtos/JSDOM";
import { countChildElements } from "../../../../helps/renda.utils/countChildElements";
import { safeExtractField } from "../dossieExtractor.utils/safeExtractField";
import { IRelacaoPrevidenciaria } from "../../../dtos/interfaces/IRelacaoPrevidenciaria";
import { hasRelacoesPrevidenciarias } from "../dossieExtractor.utils/hasRelacoesPrevidenciarias";

export async function getRelacoesPrevidenciariasSuper(dossie: JSDOMType): Promise<IRelacaoPrevidenciaria[]> {
    const arrayRelacoes: IRelacaoPrevidenciaria[] = [];
    const divOptions = [7, 8]

    for (const div of divOptions) {
        const possuiRelacoes = await hasRelacoesPrevidenciarias(dossie, div);
        if (!possuiRelacoes) continue;
    
        try {
            const baseXPath = `/html/body/div/div[${div}]/table/tbody/tr`;
            const rowCount = countChildElements(dossie, `${baseXPath}`);
    
            for (let row = 1; row <= rowCount; row++) {
                const seqRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[1]`, "Seq não encontrado");
                const nbRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[3]`, "NB não encontrado");
                const origemVinculoRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[4]`, "Origem não encontrada");
                const dataInicioRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[5]`, "Data de início não encontrada");
                const dataFimRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[6]`, "Data fim não encontrada");
                const tipoFiliacaoRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[7]`, "Tipo de filiação não encontrado");
                const ocupacaoRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[8]`, "Ocupação não encontrada");
                const ultimaRemuneracaoRaw = await safeExtractField(dossie, `${baseXPath}[${row}]/td[9]`, "Última remuneração não encontrada");
    
                const objetoRelacao: IRelacaoPrevidenciaria = {
                    seq: seqRaw,
                    nb: nbRaw,
                    origemDoVinculo: origemVinculoRaw,
                    dataInicio: dataInicioRaw,
                    dataFim: dataFimRaw,
                    tipoFiliacao: tipoFiliacaoRaw,
                    ocupacao: ocupacaoRaw,
                    ultimaRemuneracao: ultimaRemuneracaoRaw
                }
    
                arrayRelacoes.push(objetoRelacao);
            }
    
            return arrayRelacoes;
        } catch (error) {
            console.error("Error in getRelacoesSuper:", error.message);
            return [];
        }
    }

    return arrayRelacoes;
}
