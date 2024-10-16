const { JSDOM } = require('jsdom');
import { getDocumentoUseCase } from "../../../GetDocumento";
import { superDossie } from "../../DossieSuperSapiens";

export class SuperDossie {
    async buscarImpedimentosForRural(dosprevPoloAtivo: any, cookie: string) {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const impeditivosRural = await superDossie.impeditivosRural(paginaDosPrevFormatada, paginaDosPrev);

        return impeditivosRural.split('-');
    }

    async buscarImpedimentosForMaternidade(dosprevPoloAtivo: any, cookie: string) {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const impeditivosMaternidade = await superDossie.impedimentosMaternidade(paginaDosPrevFormatada, paginaDosPrev);

        return impeditivosMaternidade.split('-');
    }
}