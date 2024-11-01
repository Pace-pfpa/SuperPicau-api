const { JSDOM } = require('jsdom');
import { IImpedimentos, IResponseSislabra } from "../../../../DTO/IResponseSislabra";
import { getDocumentoUseCase } from "../../../GetDocumento";
import { getDocumentSislabraFromSapiens } from "../../GetDocumentSislabraFromSapiens";

export async function impedimentosSislabraRuralMaternidade(documentoPoloAtivo: any, documentoConjuge: any, cookie: string): Promise<IResponseSislabra> {
    let response = '';
    let impedimentosAutor: IImpedimentos;
    let impedimentosConjuge: IImpedimentos;

    if (documentoPoloAtivo && documentoConjuge) {

        const idSislabraAutor = documentoPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraAutor = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraAutor });
        const paginaFormatadaAutor = new JSDOM(paginaSislabraAutor);
        const sislabraAutor = await getDocumentSislabraFromSapiens.execute(paginaFormatadaAutor, "AUTOR");
        response += sislabraAutor.impedimentos;
        impedimentosAutor = sislabraAutor.objImpedimentos;

        const idSislabraConjuge = documentoConjuge.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraConjuge = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraConjuge });
        const paginaFormatadaConjuge = new JSDOM(paginaSislabraConjuge);
        const sislabraConjuge = await getDocumentSislabraFromSapiens.execute(paginaFormatadaConjuge, "CONJUGE");
        response += sislabraConjuge.impedimentos;
        impedimentosConjuge = sislabraConjuge.objImpedimentos;

    } else if (documentoPoloAtivo) {

        const idSislabraAutor = documentoPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraAutor = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraAutor });
        const paginaFormatadaAutor = new JSDOM(paginaSislabraAutor);
        const sislabraAutor = await getDocumentSislabraFromSapiens.execute(paginaFormatadaAutor, "AUTOR");
        response += sislabraAutor.impedimentos;
        impedimentosAutor = sislabraAutor.objImpedimentos;

    } else if (documentoConjuge) {
        
        const idSislabraConjuge = documentoConjuge.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraConjuge = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraConjuge });
        const paginaFormatadaConjuge = new JSDOM(paginaSislabraConjuge);
        const sislabraConjuge = await getDocumentSislabraFromSapiens.execute(paginaFormatadaConjuge, "CONJUGE");
        response += sislabraConjuge.impedimentos;
        impedimentosConjuge = sislabraConjuge.objImpedimentos;

    } else {
        response += " SISLABRA GF NÃO EXISTE -";
    }

    const impedimentosString = response.split('-')

    const impedimentos: IResponseSislabra = {
        impedimentos: impedimentosString,
        autor: impedimentosAutor,
        conjuge: impedimentosConjuge
    }

    return impedimentos;
}
