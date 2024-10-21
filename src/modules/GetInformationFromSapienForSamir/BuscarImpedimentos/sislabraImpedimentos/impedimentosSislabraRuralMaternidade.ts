const { JSDOM } = require('jsdom');
import { getDocumentoUseCase } from "../../../GetDocumento";
import { getDocumentSislabraFromSapiens } from "../../GetDocumentSislabraFromSapiens";

export async function impedimentosSislabraRuralMaternidade(documentoPoloAtivo: any, documentoConjuge: any, cookie: string): Promise<string[] | null> {
    let response = '';

    if (documentoPoloAtivo && documentoConjuge) {
        const idSislabraAutor = documentoPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraAutor = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraAutor });
        const paginaFormatadaAutor = new JSDOM(paginaSislabraAutor);
        const sislabraAutor = await getDocumentSislabraFromSapiens.execute(paginaFormatadaAutor, "AUTOR");
        response += sislabraAutor;

        const idSislabraConjuge = documentoConjuge.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraConjuge = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraConjuge });
        const paginaFormatadaConjuge = new JSDOM(paginaSislabraConjuge);
        const sislabraConjuge = await getDocumentSislabraFromSapiens.execute(paginaFormatadaConjuge, "CONJUGE");
        response += sislabraConjuge;
    } else if (documentoPoloAtivo) {
        const idSislabraAutor = documentoPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraAutor = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraAutor });
        const paginaFormatadaAutor = new JSDOM(paginaSislabraAutor);
        const sislabraAutor = await getDocumentSislabraFromSapiens.execute(paginaFormatadaAutor, "AUTOR");
        response += sislabraAutor;
    } else if (documentoConjuge) {
        const idSislabraConjuge = documentoConjuge.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraConjuge = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraConjuge });
        const paginaFormatadaConjuge = new JSDOM(paginaSislabraConjuge);
        const sislabraConjuge = await getDocumentSislabraFromSapiens.execute(paginaFormatadaConjuge, "CONJUGE");
        response += sislabraConjuge;
    } else {
        response += " SISLABRA GF NÃO EXISTE -";
    }

    return response.split('-');
}