const { JSDOM } = require('jsdom');
import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { IDossieExtractedPartial } from "../BuscarImpedimentos/dtos/interfaces/IDossieExtractedPartial";
import { IFichaSintetica } from "../BuscarImpedimentos/dtos/interfaces/IFichaSintetica";
import { IProcessosMovidos } from "../BuscarImpedimentos/dtos/interfaces/IProcessosMovidos";
import { IRelacaoPrevidenciaria } from "../BuscarImpedimentos/dtos/interfaces/IRelacaoPrevidenciaria";
import { IRequerimentos } from "../BuscarImpedimentos/dtos/interfaces/IRequerimentos";
import { getFichaSinteticaDoProcessoNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getFichaSinteticaDoProcessoNormal";
import { getProcessosMovidosNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getProcessosMovidosNormal";
import { getRelacoesPrevidenciariasNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getRelacoesPrevidenciariasNormal";
import { getRequerimentosNormal } from "../BuscarImpedimentos/utils/dossieExtractor/normal/getRequerimentosNormal";
import { getFichaSinteticaDoProcessoSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getFichaSinteticoDoProcessoSuper";
import { getProcessosMovidosSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getProcessosMovidosSuper";
import { getRelacoesPrevidenciariasSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getRelacoesPrevidenciariasSuper";
import { getRequerimentosSuper } from "../BuscarImpedimentos/utils/dossieExtractor/super/getRequerimentosSuper";
import { IDossieExtractedEarly } from "../dto/Triagem/interfaces/IDossieExtractedEarly";
import { verificarGeracaoDossie } from "./verificarGeracaoDossie";

export async function dossieExtractorMain(
    dosprevPoloAtivo: ResponseArvoreDeDocumentoDTO, 
    isDosprevPoloAtivoNormal: boolean,
    cookie: string
): Promise<IDossieExtractedEarly> {
    if (!dosprevPoloAtivo) {
        return { 
            isAviso: true,
            avisoMessage: "DOSPREV POLO ATIVO NÃO ENCONTRADO",
        };
    }

    let paginaDosPrevFormatada: JSDOMType;

    try {
        const idDosprevParaPesquisa = dosprevPoloAtivo.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        paginaDosPrevFormatada = new JSDOM(paginaDosPrev);

        const falhaNaGeracao = await verificarGeracaoDossie(paginaDosPrevFormatada);
        if (falhaNaGeracao instanceof Error) {
            return { 
                isAviso: true,
                avisoMessage: "DOSPREV COM FALHA NA GERAÇÃO",
            };
        }
    } catch (error) {
        console.error("Erro no dossieExtractorMain: ", error.message);
        return { 
            isAviso: true,
            avisoMessage: "DOSPREV COM FALHA NA BUSCA",
        };
    }
    
    let fichaSintetica: IFichaSintetica;
    let processosMovidos: IProcessosMovidos[];
    let requerimentos: IRequerimentos[];
    let relacoesPrevidenciarias: IRelacaoPrevidenciaria[];

    if (isDosprevPoloAtivoNormal) {
        fichaSintetica = await getFichaSinteticaDoProcessoNormal(paginaDosPrevFormatada);
        processosMovidos = await getProcessosMovidosNormal(paginaDosPrevFormatada);
        requerimentos = await getRequerimentosNormal(paginaDosPrevFormatada);
        relacoesPrevidenciarias = await getRelacoesPrevidenciariasNormal(paginaDosPrevFormatada)
    } else {
        fichaSintetica = await getFichaSinteticaDoProcessoSuper(paginaDosPrevFormatada);
        processosMovidos = await getProcessosMovidosSuper(paginaDosPrevFormatada);
        requerimentos = await getRequerimentosSuper(paginaDosPrevFormatada);
        relacoesPrevidenciarias = await getRelacoesPrevidenciariasSuper(paginaDosPrevFormatada);
    }

    if (!fichaSintetica.numeroUnico) {
        return { 
            isAviso: true,
            avisoMessage: "NÚMERO ÚNICO NÃO ENCONTRADO NO DOSSIÊ",
        };
    }

    if (!fichaSintetica.dataAjuizamento) {
        return { 
            isAviso: true,
            avisoMessage: "DATA DE AJUIZAMENTO NÃO ENCONTRADO NO DOSSIÊ",
        };
    }

    const dossie: IDossieExtractedPartial = {
        fichaSintetica,
        processosMovidos,
        requerimentos,
        relacoesPrevidenciarias,
    }

    return {
        isAviso: false,
        dossiePartial: dossie,
        dossieFormatado: paginaDosPrevFormatada
    }
}