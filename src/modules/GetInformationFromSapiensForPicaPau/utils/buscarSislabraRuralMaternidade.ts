const { JSDOM } = require('jsdom');
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { verificarGeracaoComponentes } from "./verificarGeracaoComponentes";

export async function buscarSislabraRuralMaternidade(
    arrayDeDocumentos: ResponseArvoreDeDocumentoDTO[],
    cookie: string
): Promise<{ sislabraPoloAtivo: JSDOMType, sislabraConjuge: JSDOMType }> {

    let sislabraPoloAtivo: ResponseArvoreDeDocumentoDTO = null;
    let sislabraConjuge: ResponseArvoreDeDocumentoDTO = null;

    let sislabraAutorFormatado: JSDOMType = null;
    let sislabraConjugeFormatado: JSDOMType = null;
    
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

    try {
        const idSislabraAutor = sislabraPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraAutor = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraAutor });
        const paginaFormatadaAutor = new JSDOM(paginaSislabraAutor);
        
        sislabraAutorFormatado = paginaFormatadaAutor;
    } catch (error) {
        console.error(error.message);
        return { sislabraPoloAtivo: null, sislabraConjuge: null }
    }

    try {
        const idSislabraConjuge = sislabraConjuge.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraConjuge = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraConjuge });
        const paginaFormatadaConjuge = new JSDOM(paginaSislabraConjuge);

        sislabraConjugeFormatado = paginaFormatadaConjuge;
    } catch (error) {
        console.error(error.message);
        return { sislabraPoloAtivo: sislabraAutorFormatado, sislabraConjuge: null }
    }

    return { sislabraPoloAtivo: sislabraAutorFormatado, sislabraConjuge: sislabraConjugeFormatado }
}
