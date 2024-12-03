const { JSDOM } = require('jsdom');
import { getDocumentoUseCase } from "../../GetDocumento";
import { superDossie } from "../DossieSuperSapiens";
import { IObjInfoImpeditivosLoas, IObjInfoImpeditivosRM, IReturnImpedimentosLOAS, IReturnImpedimentosRM } from "../dto";

export class SuperDossie {
    async buscarImpedimentosForRural(dosprevPoloAtivo: any, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRM }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const impeditivosRural: IReturnImpedimentosRM = await superDossie.impeditivosRural(paginaDosPrevFormatada, paginaDosPrev);

        const impedimentos: string[] = impeditivosRural.arrayDeImpedimentos.split('-');
        const objImpedimentos: IObjInfoImpeditivosRM = impeditivosRural.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async buscarImpedimentosForMaternidade(dosprevPoloAtivo: any, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRM }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const impeditivosMaternidade: IReturnImpedimentosRM = await superDossie.impedimentosMaternidade(paginaDosPrevFormatada, paginaDosPrev);

        const impedimentos: string[] = impeditivosMaternidade.arrayDeImpedimentos.split('-');
        const objImpedimentos: IObjInfoImpeditivosRM = impeditivosMaternidade.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async buscarImpedimentosForLOAS(dosprevPoloAtivo: any, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosLoas }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev);

        const impeditivosLoas: IReturnImpedimentosLOAS = await superDossie.impeditivosLoas(paginaDosPrevFormatada, paginaDosPrev);

        const impedimentos: string[] = impeditivosLoas.arrayDeImpedimentos.split('-');
        const objImpedimentos: IObjInfoImpeditivosLoas = impeditivosLoas.objImpedimentosLoas;

        return { impedimentos, objImpedimentos };
    }
}