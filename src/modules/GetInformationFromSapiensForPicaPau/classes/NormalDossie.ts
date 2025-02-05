const { JSDOM } = require('jsdom');
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { IDossieExtracted } from "../BuscarImpedimentos/dtos/interfaces/IDossieExtracted";
import { getCompetenciasDetalhadasNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getCompetenciasDetalhadasNormal";
import { getFichaSinteticaDoProcessoNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getFichaSinteticaDoProcessoNormal";
import { getProcessosMovidosNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getProcessosMovidosNormal";
import { getRelacoesPrevidenciariasNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getRelacoesPrevidenciariasNormal";
import { getRequerimentosNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getRequerimentosNormal";
import { getInformationDossieSuperForPicapau } from "../DossieSuperSapiens";
import { IObjInfoImpeditivosLoas, IObjInfoImpeditivosMaternidade } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { getInformationDossieForPicaPau } from "../GetInformationFromDossieForPicaPau";

export class NormalDossie {
    async buscarImpedimentosForRural(
        dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO,
        cookie: string
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosRural }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev);

        const impeditivosRural = await getInformationDossieForPicaPau.impeditivosRural(paginaDosPrevFormatada);

        const impedimentos = impeditivosRural.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosRural.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async burcarImpedimentosForMaternidade(
        dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, 
        cookie: string
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosMaternidade }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev); 

        const dossie = await this.dossieExtractorMaternidadeNormal(paginaDosPrevFormatada);
        const impeditivosMaternidade = await getInformationDossieSuperForPicapau.maternidade(dossie);

        const impedimentos = impeditivosMaternidade.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosMaternidade.objImpedimentosRM;

        return { impedimentos, objImpedimentos };
    }

    async buscarImpedimentosForLoas(
        dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, 
        cookie: string
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosLoas }> {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev);

        const impeditivosLoas = await getInformationDossieForPicaPau.impeditivoLoas(paginaDosPrevFormatada);

        const impedimentos = impeditivosLoas.arrayDeImpedimentos.split('-');
        const objImpedimentos = impeditivosLoas.objImpedimentosLoas;

        return { impedimentos, objImpedimentos };
    }

    async dossieExtractorMaternidadeNormal(
        dosprevPoloAtivo: JSDOMType
    ): Promise<IDossieExtracted> {
        const fichaSintetica = await getFichaSinteticaDoProcessoNormal(dosprevPoloAtivo);
        const processosMovidos = await getProcessosMovidosNormal(dosprevPoloAtivo);
        const requerimentos = await getRequerimentosNormal(dosprevPoloAtivo);
        const relacoesPrevidenciarias = await getRelacoesPrevidenciariasNormal(dosprevPoloAtivo);
        const competenciasDetalhadas = await getCompetenciasDetalhadasNormal(dosprevPoloAtivo, requerimentos, relacoesPrevidenciarias);

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
