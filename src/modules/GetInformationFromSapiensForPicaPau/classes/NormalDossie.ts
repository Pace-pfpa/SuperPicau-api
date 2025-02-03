const { JSDOM } = require('jsdom');
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { getFichaSinteticaDoProcessoNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getFichaSinteticaDoProcessoNormal";
import { getProcessosMovidosNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getProcessosMovidosNormal";
import { getRequerimentosNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getRequerimentosNormal";
import { IObjInfoImpeditivosLoas, IObjInfoImpeditivosMaternidade } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { getInformationDossieForPicaPau } from "../GetInformationFromDossieForPicaPau";

export class NormalDossie {
    async buscarImpedimentosForRural(dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRural }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev);

        const impeditivosRural = await getInformationDossieForPicaPau.impeditivosRural(paginaDosPrevFormatada);

        const impedimentos = impeditivosRural.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosRural.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async burcarImpedimentosForMaternidade(dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosMaternidade }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const fichaSintetica = await getFichaSinteticaDoProcessoNormal(paginaDosPrevFormatada);
        const processosMovidos = await getProcessosMovidosNormal(paginaDosPrevFormatada);
        const requerimentos = await getRequerimentosNormal(paginaDosPrevFormatada);
        console.log("FICHA SINTÉTICA")
        console.log(fichaSintetica);
        console.log("PROCESSOS MOVIDOS")
        console.log(processosMovidos)
        console.log("REQUERIMENTOS")
        console.log(requerimentos)

        const impeditivosMaternidade = await getInformationDossieForPicaPau.impedimentosMaternidade(paginaDosPrevFormatada);

        const impedimentos = impeditivosMaternidade.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosMaternidade.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async buscarImpedimentosForLoas(dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosLoas }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev);

        const impeditivosLoas = await getInformationDossieForPicaPau.impeditivoLoas(paginaDosPrevFormatada);

        const impedimentos = impeditivosLoas.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosLoas.objImpedimentosLoas;

        return { impedimentos, objImpedimentos };
    }

    async dossieExtractorMaternidade(dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<void> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev);

        const fichaSintetica = await getFichaSinteticaDoProcessoNormal(paginaDosPrevFormatada);
        const processosMovidos = await getProcessosMovidosNormal(paginaDosPrevFormatada);
        const requerimentos = await getRequerimentosNormal(paginaDosPrevFormatada);
        console.log("FICHA SINTÉTICA")
        console.log(fichaSintetica);
        console.log("PROCESSOS MOVIDOS")
        console.log(processosMovidos)
        console.log("REQUERIMENTOS")
        console.log(requerimentos)

    }
}