import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { IDossieExtracted } from "../BuscarImpedimentos/dtos/interfaces/IDossieExtracted";
import { IDossieExtractedPartial } from "../BuscarImpedimentos/dtos/interfaces/IDossieExtractedPartial";
import { getCompetenciasDetalhadasSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getCompetenciasDetalhadasSuper";

export class ExtractorSuper {
    async maternidade(
        dosprevPoloAtivo: JSDOMType,
        dossieExtractedPartial: IDossieExtractedPartial
    ): Promise<IDossieExtracted> {
        const competenciasDetalhadas = await getCompetenciasDetalhadasSuper(
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