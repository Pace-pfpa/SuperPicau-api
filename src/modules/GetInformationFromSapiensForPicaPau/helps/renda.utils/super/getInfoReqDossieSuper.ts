import { IPicaPauCalculeDTO } from "../../../dto/Calculo/IPicaPauCalculeDTO";
import { getValueCalcDossieSuper } from "./getValueCalcDossieSuper";
import { IDossieExtractedPartial } from "../../../BuscarImpedimentos/dtos/interfaces/IDossieExtractedPartial";
import { getDERorDCB } from "../../getDERorDCB";
import { JSDOMType } from "../../../../../shared/dtos/JSDOM";

export async function getInfoReqDossieSuper(
    dossieParcial: IDossieExtractedPartial,
    dossieJSDOM: JSDOMType
): Promise<IPicaPauCalculeDTO> {
    try {
        const dataDeRequerimento = getDERorDCB(
            dossieParcial.requerimentos, 
            dossieParcial.fichaSintetica.dataAjuizamento
        )
        
        const valoresCalcule = await getValueCalcDossieSuper(
            dossieJSDOM, 
            dossieParcial.fichaSintetica.dataAjuizamento, 
            dataDeRequerimento
        );

        const objeto: IPicaPauCalculeDTO = {
            nome: dossieParcial.fichaSintetica.nome,
            dataAjuizamento: dossieParcial.fichaSintetica.dataAjuizamento,
            dataNascimento: dossieParcial.fichaSintetica.dataNascimento,
            cpf: dossieParcial.fichaSintetica.cpf,
            dataRequerimento: dataDeRequerimento,
            remuneracaoAjuizamento: valoresCalcule.remuneracaoAjz || 0,
            remuneracaoRequerimento: valoresCalcule.remuneracaoReq || 0,
            isFallback: valoresCalcule.isFallback,
            fallbackInfo: valoresCalcule.fallbackInfo
        };

        return objeto;
    } catch (error) {
        console.error(error.message)
        const objeto: IPicaPauCalculeDTO = {
            nome: "SEM INFORMAÇÃO",
            dataAjuizamento: "SEM INFORMAÇÃO",
            dataNascimento: "SEM INFORMAÇÃO",
            cpf: "SEM INFORMAÇÃO",
            dataRequerimento: "SEM INFORMAÇÃO",
            remuneracaoAjuizamento: 0,
            remuneracaoRequerimento: 0,
            isFallback: false,
            fallbackInfo: null
        }

        return objeto;
    }
}