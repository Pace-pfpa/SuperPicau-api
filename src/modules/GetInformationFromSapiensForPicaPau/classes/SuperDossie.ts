const { JSDOM } = require('jsdom');
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { getFichaSinteticaDoProcessoSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getFichaSinteticoDoProcessoSuper";
import { getProcessosMovidosSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getProcessosMovidosSuper";
import { getRequerimentosSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getRequerimentosSuper";
import { getInformationDossieSuperForPicapau } from "../DossieSuperSapiens";
import { IObjInfoImpeditivosLoas, IObjInfoImpeditivosMaternidade } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";

export class SuperDossie {
    async buscarImpedimentosForRural(
        dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRural }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const impeditivosRural = await getInformationDossieSuperForPicapau.impeditivosRural(paginaDosPrevFormatada);

        const impedimentos = impeditivosRural.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosRural.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async buscarImpedimentosForMaternidade(
        dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosMaternidade }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const fichaSintetica = await getFichaSinteticaDoProcessoSuper(paginaDosPrevFormatada);
        const processosMovidos = await getProcessosMovidosSuper(paginaDosPrevFormatada);
        const requerimentos = await getRequerimentosSuper(paginaDosPrevFormatada);
        console.log("FICHA SINTÉTICA")
        console.log(fichaSintetica);
        console.log("PROCESSOS MOVIDOS")
        console.log(processosMovidos)
        console.log("REQUERIMENTOS")
        console.log(requerimentos)

        const impeditivosMaternidade = await getInformationDossieSuperForPicapau.impedimentosMaternidade(paginaDosPrevFormatada);

        const impedimentos = impeditivosMaternidade.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosMaternidade.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async buscarImpedimentosForLOAS(
        dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO,
        cookie: string
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosLoas }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev);

        const impeditivosLoas = await getInformationDossieSuperForPicapau.impeditivosLoas(paginaDosPrevFormatada);

        const impedimentos = impeditivosLoas.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosLoas.objImpedimentosLoas;

        return { impedimentos, objImpedimentos };
    }

    async dossieExtractorMaternidade(dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<void> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev);

        const fichaSintetica = await getFichaSinteticaDoProcessoSuper(paginaDosPrevFormatada);
        const processosMovidos = await getProcessosMovidosSuper(paginaDosPrevFormatada);
        const requerimentos = await getRequerimentosSuper(paginaDosPrevFormatada);
        console.log("FICHA SINTÉTICA")
        console.log(fichaSintetica);
        console.log("PROCESSOS MOVIDOS")
        console.log(processosMovidos)
        console.log("REQUERIMENTOS")
        console.log(requerimentos)
    }
}