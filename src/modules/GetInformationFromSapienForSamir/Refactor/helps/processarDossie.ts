import { ResponseArvoreDeDocumento } from "../../../GetArvoreDocumento/dtos";

export async function processarDossie(arrayDeDocumentos: ResponseArvoreDeDocumento[]): Promise<{ arrayDeDossiesNormais: ResponseArvoreDeDocumento[], arrayDeDossiesSuper: ResponseArvoreDeDocumento[] }> {
    let objectDosPrev = arrayDeDocumentos.filter(
        Documento => Documento.documentoJuntado.tipoDocumento.sigla === "DOSPREV" && 
        Documento.documentoJuntado.origemDados.fonteDados === "SAT_INSS");

    let objectDosPrev2 = arrayDeDocumentos.filter(Documento => {
        const movimento = Documento.movimento.split(".");
        return movimento[0] === "JUNTADA DOSSIE DOSSIE PREVIDENCIARIO REF";
    });

    if (objectDosPrev.length > 0) {
        return { arrayDeDossiesNormais: objectDosPrev, arrayDeDossiesSuper: objectDosPrev2.length > 0 ? objectDosPrev2 : null };
    } else {
        return { arrayDeDossiesNormais: null, arrayDeDossiesSuper: objectDosPrev2.length > 0 ? objectDosPrev2 : null };
    }
}
