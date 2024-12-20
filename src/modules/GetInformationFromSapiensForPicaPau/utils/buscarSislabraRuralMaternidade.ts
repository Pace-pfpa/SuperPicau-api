import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";

export async function buscarSislabraRuralMaternidade(
    arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[]
): Promise<{ sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO, sislabraConjuge: ResponseArvoreDeDocumentoDTO }> {

    let sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO = null;
    let sislabraConjuge: ResponseArvoreDeDocumentoDTO = null;
    
    const documentoPoloAtivo = arrayDeDocumentos.find((doc) => doc.movimento?.indexOf("PÓLO ATIVO") !== -1);

    if (documentoPoloAtivo) {
        sislabraPoloAtivo = documentoPoloAtivo;
    }

    const documentoConjuge = arrayDeDocumentos.find((doc) => 
        doc.movimento?.includes("SISLABRA - GF") && doc.documentoJuntado?.tipoDocumento?.sigla.includes('SITCADCPF'))
        || arrayDeDocumentos.find((doc) => doc.movimento?.includes("POSSÍVEL CÔNJUGE")
    );

    if (documentoConjuge) {
        sislabraConjuge = documentoConjuge;
    }

    return { sislabraPoloAtivo, sislabraConjuge }
}
