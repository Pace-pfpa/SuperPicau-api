import { verificarDossieMaisAtual } from "../../helps/verificarDossieMaisAtual";
import { atualizarEtiquetaAviso } from "./atualizarEtiquetaAviso";

export async function verificarEAtualizarDossie(cpf: string, cookie: string, dossieNormal: any[], dossieSuper: any[], tarefaId) {
    try {
        const dossieIsvalid = await verificarDossieMaisAtual(cpf, cookie, dossieNormal, dossieSuper);
        return dossieIsvalid;
    } catch (error) {
        return new Error("Dossiê Inválido")
    }
}