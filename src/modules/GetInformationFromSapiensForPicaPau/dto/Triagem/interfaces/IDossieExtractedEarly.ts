import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { IDossieExtractedPartial } from "../../../BuscarImpedimentos/dtos/interfaces/IDossieExtractedPartial";

export interface IDossieExtractedEarly {
    isAviso: boolean;
    avisoMessage?: string;
    dossiePartial?: IDossieExtractedPartial;
    dossieFormatado?: JSDOMType;
}