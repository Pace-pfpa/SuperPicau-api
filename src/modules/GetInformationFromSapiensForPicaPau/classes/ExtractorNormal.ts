import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { IDossieExtracted } from "../BuscarImpedimentos/dtos/interfaces/IDossieExtracted";
import { IDossieExtractedPartial } from "../BuscarImpedimentos/dtos/interfaces/IDossieExtractedPartial";
import { getCompetenciasDetalhadasNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getCompetenciasDetalhadasNormal";

export class ExtractorNormal {
    async maternidade(
        dosprevPoloAtivo: JSDOMType,
        dossieExtractedPartial: IDossieExtractedPartial
    ): Promise<IDossieExtracted> {
        const competenciasDetalhadas = await getCompetenciasDetalhadasNormal(
            dosprevPoloAtivo, 
            dossieExtractedPartial.requerimentos, 
            dossieExtractedPartial.relacoesPrevidenciarias
        );

        const dossie: IDossieExtracted = {
            ...dossieExtractedPartial,
            competenciasDetalhadas
        }

        return dossie;
    }
}