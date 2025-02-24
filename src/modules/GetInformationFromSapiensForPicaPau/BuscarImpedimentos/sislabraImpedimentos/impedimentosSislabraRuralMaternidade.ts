const { JSDOM } = require('jsdom');
import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { IResponseSislabraRural, IImpedimentosRural } from "../../dto";
import { getDocumentSislabraFromSapiens } from "../../GetDocumentSislabraFromSapiens";

export async function impedimentosSislabraRural(
    documentoPoloAtivo: JSDOMType, 
    documentoConjuge: JSDOMType
): Promise<IResponseSislabraRural> {
    let response = '';
    let impedimentosAutor: IImpedimentosRural;
    let impedimentosConjuge: IImpedimentosRural;

    if (documentoPoloAtivo && documentoConjuge) {
        const sislabraAutor = await getDocumentSislabraFromSapiens.execute(documentoPoloAtivo, "AUTOR");
        response += sislabraAutor.impedimentos;
        impedimentosAutor = sislabraAutor.objImpedimentos;

        const sislabraConjuge = await getDocumentSislabraFromSapiens.execute(documentoConjuge, "CONJUGE");
        response += sislabraConjuge.impedimentos;
        impedimentosConjuge = sislabraConjuge.objImpedimentos;
    } else if (documentoPoloAtivo) {
        const sislabraAutor = await getDocumentSislabraFromSapiens.execute(documentoPoloAtivo, "AUTOR");
        response += sislabraAutor.impedimentos;
        impedimentosAutor = sislabraAutor.objImpedimentos;

    } else {
        response += " SISLABRA GF NÃO EXISTE -";
    }

    const impedimentosString = response.split('-')

    const impedimentos: IResponseSislabraRural = {
        impedimentos: impedimentosString,
        autor: impedimentosAutor,
        conjuge: impedimentosConjuge
    }

    return impedimentos;
}
