const { JSDOM } = require('jsdom');
import { getDocumentoUseCase } from "../../../GetDocumento";
import { getInformationDossieForPicaPau } from "../../GetInformationFromDossieForPicaPau";

export class NormalDossie {
    async buscarImpedimentosForRural(dosprevPoloAtivo: any, cookie: string) {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const impeditivosRural = await getInformationDossieForPicaPau.impeditivosRural(paginaDosPrevFormatada, paginaDosPrev);

        return impeditivosRural.split('-');
    }

    async burcarImpedimentosForMaternidade(dosprevPoloAtivo: any, cookie: string) {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const impeditivosMaternidade = await getInformationDossieForPicaPau.impedimentosMaternidade(paginaDosPrevFormatada, paginaDosPrev);

        return impeditivosMaternidade.split('-');
    }
}