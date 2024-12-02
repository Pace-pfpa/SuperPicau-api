import { ResponseArvoreDeDocumentoDTO } from "../../../../GetArvoreDocumento";

export type IdentificarDossieAtivoType = {
    dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO | null;
    isDosprevPoloAtivoNormal: boolean;
} | {warning: string};
