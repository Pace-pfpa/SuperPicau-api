export async function buscarSislabraRuralMaternidade(arrayDeDocumentos: any[]): Promise<{ sislabraPoloAtivo: any, sislabraConjuge: any }> {
    let sislabraPoloAtivo = null;
    let sislabraConjuge = null;
    
    const documentoPoloAtivo = arrayDeDocumentos.find((doc) => doc.movimento?.indexOf("PÓLO ATIVO") !== -1);

    if (documentoPoloAtivo) {
        sislabraPoloAtivo = documentoPoloAtivo;
    } else {
        sislabraPoloAtivo = null;
    }

    const documentoConjuge = arrayDeDocumentos.find((doc) => doc.movimento?.includes("SISLABRA - GF") && doc.documentoJuntado?.tipoDocumento?.sigla.includes('SITCADCPF'))
        || arrayDeDocumentos.find((doc) => doc.movimento?.includes("POSSÍVEL CÔNJUGE"));

    if (documentoConjuge) {
        sislabraConjuge = documentoPoloAtivo;
    } else {
        sislabraConjuge = null;
    }

    return { sislabraPoloAtivo, sislabraConjuge }
}