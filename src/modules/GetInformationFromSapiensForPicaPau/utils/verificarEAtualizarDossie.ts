import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { verificarDossieMaisAtual } from "../helps/verificarDossieMaisAtual";

export async function verificarEAtualizarDossie(
    cpf: string, 
    cookie: string, 
    dossieNormal: ResponseArvoreDeDocumentoDTO[], 
    dossieSuper: ResponseArvoreDeDocumentoDTO[]) {
        
    try {
        const dossieIsvalid = await verificarDossieMaisAtual(cpf, cookie, dossieNormal, dossieSuper);
        return dossieIsvalid;
    } catch (error) {
        return new Error("Dossiê Inválido")
    }
}
