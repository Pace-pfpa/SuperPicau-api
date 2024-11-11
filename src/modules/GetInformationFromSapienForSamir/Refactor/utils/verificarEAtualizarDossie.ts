import { ResponseArvoreDeDocumento } from "../../../GetArvoreDocumento/dtos";
import { verificarDossieMaisAtual } from "../../helps/verificarDossieMaisAtual";

export async function verificarEAtualizarDossie(
    cpf: string, 
    cookie: string, 
    dossieNormal: ResponseArvoreDeDocumento[], 
    dossieSuper: ResponseArvoreDeDocumento[]) {
        
    try {
        const dossieIsvalid = await verificarDossieMaisAtual(cpf, cookie, dossieNormal, dossieSuper);
        return dossieIsvalid;
    } catch (error) {
        return new Error("Dossiê Inválido")
    }
}