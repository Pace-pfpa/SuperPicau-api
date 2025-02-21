const { JSDOM } = require('jsdom');
import { extractorSuper } from ".";
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { IDossieExtractedPartial } from "../BuscarImpedimentos/dtos/interfaces/IDossieExtractedPartial";
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
        dosprevPoloAtivo: JSDOMType, 
        dossieExtractedPartial: IDossieExtractedPartial,
    ): Promise<{ 
        impedimentos: string[], 
        objImpedimentos: IObjInfoImpeditivosMaternidade
    }> {
        try {
            const dossie = await extractorSuper.maternidade(
                dosprevPoloAtivo, 
                dossieExtractedPartial
            );

            const impeditivosMaternidade = await getInformationDossieSuperForPicapau.maternidade(dossie);
    
            const impedimentos = impeditivosMaternidade.arrayDeImpedimentos.split('-');
            const objImpedimentos = impeditivosMaternidade.objImpedimentosRM;
    
            return { impedimentos, objImpedimentos };
        } catch (error) {
            console.error("Erro na busca de impedimentos: ", error.message);
            throw error;
        }
    }

    async buscarImpedimentosForLOAS(
        dossieExtractedPartial: IDossieExtractedPartial,
    ): Promise<{ impedimentos: string[], objImpedimentos: IObjInfoImpeditivosLoas }> {
        try {
            const impeditivosLoas = await getInformationDossieSuperForPicapau.loas(
                dossieExtractedPartial
            );
            
            const impedimentos = impeditivosLoas.arrayDeImpedimentos.split('-');
            const objImpedimentos = impeditivosLoas.objImpedimentosLoas;

            return { impedimentos, objImpedimentos };
        } catch (error) {
            console.error("Erro na busca de impedimentos: ", error.message);
            throw error;
        }
    }
}