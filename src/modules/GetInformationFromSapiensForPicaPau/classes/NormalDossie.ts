const { JSDOM } = require('jsdom');
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { IObjInfoImpeditivosLoas, IObjInfoImpeditivosMaternidade, IReturnImpedimentosLOAS } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { getInformationDossieForPicaPau } from "../GetInformationFromDossieForPicaPau";

export class NormalDossie {
    async buscarImpedimentosForRural(dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRural }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada: JSDOMType = new JSDOM(paginaDosPrev);

        const impeditivosRural = await getInformationDossieForPicaPau.impeditivosRural(paginaDosPrevFormatada, paginaDosPrev);

        const impedimentos = impeditivosRural.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosRural.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async burcarImpedimentosForMaternidade(dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosMaternidade }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada: JSDOMType = new JSDOM(paginaDosPrev); 

        const impeditivosMaternidade = await getInformationDossieForPicaPau.impedimentosMaternidade(paginaDosPrevFormatada, paginaDosPrev);

        const impedimentos = impeditivosMaternidade.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosMaternidade.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async buscarImpedimentosForLoas(dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosLoas }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada: JSDOMType = new JSDOM(paginaDosPrev);

        const impeditivosLoas: IReturnImpedimentosLOAS = await getInformationDossieForPicaPau.impeditivoLoas(paginaDosPrevFormatada);

        const impedimentos: string[] = impeditivosLoas.arrayDeImpedimentos.split('-');
        const objImpedimentos: IObjInfoImpeditivosLoas = impeditivosLoas.objImpedimentosLoas;

        return { impedimentos, objImpedimentos };
    }
}