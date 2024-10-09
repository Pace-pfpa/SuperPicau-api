import { ResponseArvoreDeDocumento } from "../../../../sapiensOperations/response/ResponseArvoreDeDocumento";

export async function processarDossie(arrayDeDocumentos: ResponseArvoreDeDocumento[]): Promise<{dossieNormal: any, superDossie: any}> {
    let objectDosPrev = arrayDeDocumentos.filter(Documento => Documento.documentoJuntado.tipoDocumento.sigla === "DOSPREV" && Documento.documentoJuntado.origemDados.fonteDados === "SAT_INSS");
    let objectDosPrev2 = arrayDeDocumentos.filter(Documento => {
        const movimento = Documento.movimento.split(".");
        return movimento[0] === "JUNTADA DOSSIE DOSSIE PREVIDENCIARIO REF";
    });

    if (objectDosPrev.length > 0) {
        return { dossieNormal: objectDosPrev, superDossie: objectDosPrev2.length > 0 ? objectDosPrev2 : null };
    } else {
        return { dossieNormal: null, superDossie: objectDosPrev2.length > 0 ? objectDosPrev2 : null };
    }
}
