import { ResponseArvoreDeDocumentoDTO } from "../../../../GetArvoreDocumento";

export interface ISislabraGF {
    isGrupoFamiliarAusente: boolean;
    labrasGrupoFamiliar: ResponseArvoreDeDocumentoDTO[] | null;
}