const { JSDOM } = require('jsdom');
import { IObjInfoImpeditivosRM, IReturnImpedimentosRM } from "../../../../DTO/IObjInfoImpeditivosRM";
import { getDocumentoUseCase } from "../../../GetDocumento";
import { getInformationDossieForPicaPau } from "../../GetInformationFromDossieForPicaPau";

export class NormalDossie {
    async buscarImpedimentosForRural(dosprevPoloAtivo: any, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRM }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const impeditivosRural: IReturnImpedimentosRM = await getInformationDossieForPicaPau.impeditivosRural(paginaDosPrevFormatada, paginaDosPrev);

        const impedimentos: string[] = impeditivosRural.arrayDeImpedimentos.split('-');
        const objImpedimentos: IObjInfoImpeditivosRM = impeditivosRural.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async burcarImpedimentosForMaternidade(dosprevPoloAtivo: any, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRM }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const impeditivosMaternidade: IReturnImpedimentosRM = await getInformationDossieForPicaPau.impedimentosMaternidade(paginaDosPrevFormatada, paginaDosPrev);

        const impedimentos: string[] = impeditivosMaternidade.arrayDeImpedimentos.split('-');
        const objImpedimentos: IObjInfoImpeditivosRM = impeditivosMaternidade.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async buscarImpedimentosForLoas(dosprevPoloAtivo: any, cookie: string): Promise<string[]> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev);

        const impeditivosLoas = await getInformationDossieForPicaPau.impeditivoLoas(paginaDosPrevFormatada);

        return impeditivosLoas.split('-');
    }
}