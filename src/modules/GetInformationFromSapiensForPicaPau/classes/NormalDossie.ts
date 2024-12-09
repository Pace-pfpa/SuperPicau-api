const { JSDOM } = require('jsdom');
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { IObjInfoImpeditivosLoas, IObjInfoImpeditivosRM, IReturnImpedimentosLOAS, IReturnImpedimentosRM } from "../dto";
import { getInformationDossieForPicaPau } from "../GetInformationFromDossieForPicaPau";

export class NormalDossie {
    async buscarImpedimentosForRural(dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRM }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada: JSDOMType = new JSDOM(paginaDosPrev);

        const impeditivosRural: IReturnImpedimentosRM = await getInformationDossieForPicaPau.impeditivosRural(paginaDosPrevFormatada, paginaDosPrev);

        const impedimentos: string[] = impeditivosRural.arrayDeImpedimentos.split('-');
        const objImpedimentos: IObjInfoImpeditivosRM = impeditivosRural.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async burcarImpedimentosForMaternidade(dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRM }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada: JSDOMType = new JSDOM(paginaDosPrev); 

        const impeditivosMaternidade: IReturnImpedimentosRM = await getInformationDossieForPicaPau.impedimentosMaternidade(paginaDosPrevFormatada, paginaDosPrev);

        const impedimentos: string[] = impeditivosMaternidade.arrayDeImpedimentos.split('-');
        const objImpedimentos: IObjInfoImpeditivosRM = impeditivosMaternidade.objImpedimentosRM;

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