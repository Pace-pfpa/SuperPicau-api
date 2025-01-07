import { JSDOM } from 'jsdom';
import { getDocumentoUseCase } from "../../../GetDocumento";
import { getDocumentSislabraFromSapiensLoas } from "../../GetDocumentSislabraFromSapiens";
import { ResponseArvoreDeDocumentoDTO } from '../../../GetArvoreDocumento';

// Ajustar o retorno da função para o tipo correto
export async function impedimentosSislabraLOAS(labrasPoloAtivo: ResponseArvoreDeDocumentoDTO[], labrasGF: any, cookie: string): Promise<string[] | null> {
    let response = '';

    if (labrasPoloAtivo.length > 0) {
        for (let labra of labrasPoloAtivo) {
            const idSislabraParaPesquisa = labra.documentoJuntado.componentesDigitais[0].id;
            const paginaSislabra = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraParaPesquisa });
            const paginaFormatada = new JSDOM(paginaSislabra);
            const sislabraPoloAtivo = await getDocumentSislabraFromSapiensLoas.execute(paginaFormatada, true);
            if (!response.includes(sislabraPoloAtivo)) {
                response += sislabraPoloAtivo;
            }
        }
    }

    if (labrasGF?.length > 0) {
        for (let labra of labrasGF) {
            const idSislabraParaPesquisaGF = labra.documentoJuntado.componentesDigitais[0].id;
            const paginaSislabraGF = await getDocumentoUseCase.execute({ cookie, idDocument: idSislabraParaPesquisaGF });
            const paginaFormatadaGF = new JSDOM(paginaSislabraGF);
            const sislabraGF = await getDocumentSislabraFromSapiensLoas.execute(paginaFormatadaGF, false);
            response += sislabraGF;
        }
    } else {
        response += " SISLABRA GF NÃO EXISTE -";
    }

    return response.split('-');
}