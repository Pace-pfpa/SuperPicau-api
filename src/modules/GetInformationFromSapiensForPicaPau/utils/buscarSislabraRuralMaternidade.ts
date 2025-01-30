import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { verificarGeracaoComponentes } from "./verificarGeracaoComponentes";

export async function buscarSislabraRuralMaternidade(
    arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[],
    cookie: string
): Promise<{ sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO, sislabraConjuge: ResponseArvoreDeDocumentoDTO }> {

    let sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO = null;
    let sislabraConjuge: ResponseArvoreDeDocumentoDTO = null;
    
    const documentoPoloAtivo = arrayDeDocumentos.filter((doc) => doc.movimento?.indexOf("PÓLO ATIVO") !== -1);

    for (const documento of documentoPoloAtivo) {
        const isErroComponente = await verificarGeracaoComponentes(documento, cookie)
        if (isErroComponente instanceof Error) continue;
        sislabraPoloAtivo = documento;
    }

    const documentoConjuge = arrayDeDocumentos.find((doc) => 
        doc.movimento?.includes("SISLABRA - GF") && doc.documentoJuntado?.tipoDocumento?.sigla.includes('SITCADCPF'))
        || arrayDeDocumentos.find((doc) => doc.movimento?.includes("POSSÍVEL CÔNJUGE")
    );

    if (documentoConjuge) sislabraConjuge = documentoConjuge;    

    return { sislabraPoloAtivo, sislabraConjuge }
}
