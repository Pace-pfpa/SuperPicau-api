const { JSDOM } = require('jsdom');
import { ResponseArvoreDeDocumentoDTO } from "../../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../../GetDocumento";
import { IImpedimentosMaternidade } from "../../dto/Sislabra/interfaces/maternidade/IImpedimentosMaternidade";
import { IResponseSislabraMaternidade } from "../../dto/Sislabra/interfaces/maternidade/IResponseSislabraMaternidade";
import { getDocumentSislabraFromSapiens } from "../../GetDocumentSislabraFromSapiens";

export async function impedimentosSislabraMaternidade(
    documentoPoloAtivo: ResponseArvoreDeDocumentoDTO, 
    documentoConjuge: ResponseArvoreDeDocumentoDTO, 
    cookie: string
): Promise<IResponseSislabraMaternidade> {
    let response = '';
    let impedimentosAutor: IImpedimentosMaternidade;
    let impedimentosConjuge: IImpedimentosMaternidade;

    if (documentoPoloAtivo && documentoConjuge) {

        const idSislabraAutor = documentoPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraAutor = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraAutor });
        const paginaFormatadaAutor = new JSDOM(paginaSislabraAutor);
        const sislabraAutor = await getDocumentSislabraFromSapiens.maternidade(paginaFormatadaAutor, "AUTOR");
        response += sislabraAutor.impedimentos;
        impedimentosAutor = sislabraAutor.objImpedimentos;

        const idSislabraConjuge = documentoConjuge.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraConjuge = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraConjuge });
        const paginaFormatadaConjuge = new JSDOM(paginaSislabraConjuge);
        const sislabraConjuge = await getDocumentSislabraFromSapiens.maternidade(paginaFormatadaConjuge, "CONJUGE");
        response += sislabraConjuge.impedimentos;
        impedimentosConjuge = sislabraConjuge.objImpedimentos;

    } else if (documentoPoloAtivo) {

        const idSislabraAutor = documentoPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaSislabraAutor = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraAutor });
        const paginaFormatadaAutor = new JSDOM(paginaSislabraAutor);
        const sislabraAutor = await getDocumentSislabraFromSapiens.maternidade(paginaFormatadaAutor, "AUTOR");
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
