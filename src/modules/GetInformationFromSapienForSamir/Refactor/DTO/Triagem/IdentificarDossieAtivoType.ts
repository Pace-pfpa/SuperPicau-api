import { ResponseArvoreDeDocumento } from "../../../../GetArvoreDocumento/DTO"

export type IdentificarDossieAtivoType = {
    dosprevPoloAtivo: ResponseArvoreDeDocumento | null;
    isDosprevPoloAtivoNormal: boolean;
} | {warning: string};
