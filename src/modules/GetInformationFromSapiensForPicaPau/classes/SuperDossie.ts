const { JSDOM } = require('jsdom');
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { IDossieExtracted } from "../BuscarImpedimentos/dtos/interfaces/IDossieExtracted";
import { getCompetenciasDetalhadasSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getCompetenciasDetalhadasSuper";
import { getFichaSinteticaDoProcessoSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getFichaSinteticoDoProcessoSuper";
import { getProcessosMovidosSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getProcessosMovidosSuper";
import { getRelacoesPrevidenciariasSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getRelacoesPrevidenciariasSuper";
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

        const dossie = await this.dossieExtractorMaternidadeSuper(paginaDosPrevFormatada);
        const impeditivosMaternidade = await getInformationDossieSuperForPicapau.maternidade(dossie);

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

    async dossieExtractorMaternidadeSuper(dosprevPoloAtivo: JSDOMType): Promise<IDossieExtracted> {
        const fichaSintetica = await getFichaSinteticaDoProcessoSuper(dosprevPoloAtivo);
        const processosMovidos = await getProcessosMovidosSuper(dosprevPoloAtivo);
        const requerimentos = await getRequerimentosSuper(dosprevPoloAtivo);
        const relacoesPrevidenciarias = await getRelacoesPrevidenciariasSuper(dosprevPoloAtivo);
        const competenciasDetalhadas = await getCompetenciasDetalhadasSuper(dosprevPoloAtivo, requerimentos, relacoesPrevidenciarias);

        const dossie: IDossieExtracted = {
            fichaSintetica,
            processosMovidos,
            requerimentos,
            relacoesPrevidenciarias,
            competenciasDetalhadas
        }

        return dossie;
    }
}