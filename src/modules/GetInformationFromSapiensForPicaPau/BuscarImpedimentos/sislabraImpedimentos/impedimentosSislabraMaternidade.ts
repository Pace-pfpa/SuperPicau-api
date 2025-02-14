import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { IImpedimentosMaternidade } from "../../dto/Sislabra/interfaces/maternidade/IImpedimentosMaternidade";
import { IResponseSislabraMaternidade } from "../../dto/Sislabra/interfaces/maternidade/IResponseSislabraMaternidade";
import { getDocumentSislabraFromSapiens } from "../../GetDocumentSislabraFromSapiens";

export async function impedimentosSislabraMaternidade(
    documentoPoloAtivo: JSDOMType, 
    documentoConjuge: JSDOMType
): Promise<IResponseSislabraMaternidade> {
    let response = '';
    let impedimentosAutor: IImpedimentosMaternidade;
    let impedimentosConjuge: IImpedimentosMaternidade;

    if (documentoPoloAtivo && documentoConjuge) {
        const sislabraAutor = await getDocumentSislabraFromSapiens.maternidade(documentoPoloAtivo, "AUTOR");
        response += sislabraAutor.impedimentos;
        impedimentosAutor = sislabraAutor.objImpedimentos;

        const sislabraConjuge = await getDocumentSislabraFromSapiens.maternidade(documentoConjuge, "CONJUGE");
        response += sislabraConjuge.impedimentos;
        impedimentosConjuge = sislabraConjuge.objImpedimentos;

    } else if (documentoPoloAtivo) {
        const sislabraAutor = await getDocumentSislabraFromSapiens.maternidade(documentoPoloAtivo, "AUTOR");
        response += sislabraAutor.impedimentos;
        impedimentosAutor = sislabraAutor.objImpedimentos;

    } else {
        response += " SISLABRA GF NÃO EXISTE -";
    }

    const impedimentosString = response.split('-')

    const impedimentos: IResponseSislabraMaternidade = {
        impedimentos: impedimentosString,
        autor: impedimentosAutor,
        conjuge: impedimentosConjuge
    }

    return impedimentos;
}
