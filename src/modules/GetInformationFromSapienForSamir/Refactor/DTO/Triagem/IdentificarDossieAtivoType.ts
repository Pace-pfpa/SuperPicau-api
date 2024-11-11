import { ResponseArvoreDeDocumento } from "../../../../GetArvoreDocumento/dtos"

export type IdentificarDossieAtivoType = {
    dosprevPoloAtivo: ResponseArvoreDeDocumento | null;
    isDosprevPoloAtivoNormal: boolean;
} | {warning: string};
