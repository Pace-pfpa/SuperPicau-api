import { verificarDossieMaisAtual } from "../../helps/verificarDossieMaisAtual";

export async function verificarEAtualizarDossie(cpf: string, cookie: string, dossieNormal: any[], dossieSuper: any[]) {
    try {
        const dossieIsvalid = await verificarDossieMaisAtual(cpf, cookie, dossieNormal, dossieSuper);
        return dossieIsvalid;
    } catch (error) {
        return new Error("Dossiê Inválido")
    }
}