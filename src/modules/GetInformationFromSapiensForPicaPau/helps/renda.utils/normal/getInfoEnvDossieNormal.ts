const { JSDOM } = require('jsdom');
import { CorrigirCpfComZeros } from "../../../../CreateInterested/Helps/CorrigirCpfComZeros";
import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { getDocumentoUseCase } from "../../../../GetDocumento";
import { correçaoDoErroDeFormatoDoSapiens } from "../../../../../shared/utils/CorreçaoDoErroDeFormatoDoSapiens";
import { convertToDate } from "../../createFormatDate";
import { IPicaPauCalculeDTO } from "../../../dto/Calculo/IPicaPauCalculeDTO";
import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../../../GetArvoreDocumento";
import { getValueCalcDossieNormal } from "./getValueCalcDossieNormal";

async function extractField(dom: JSDOMType, xpath: string, errorMessage: string): Promise<string> {
    const value = getXPathText(dom, xpath);
    if (!value || value.trim().length === 0) {
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    return correçaoDoErroDeFormatoDoSapiens(value.trim());
}

async function validateDate(dateString: string, errorMessage: string): Promise<Date> {
    const date = convertToDate(dateString);
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    return date;
}

export async function getInfoEnvDossieNormal(cookie:string, normalDossie: ResponseArvoreDeDocumentoDTO, dataReq: string): Promise<IPicaPauCalculeDTO> {
    try {
        const idDosprevParaPesquisaDossie = normalDossie.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrevDossie = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossie });
        const paginaDosPrevFormatadaDossie = new JSDOM(paginaDosPrevDossie); 

        const xpathMap = {
            dataAjuizamento: "/html/body/div/div[1]/table/tbody/tr[2]/td",
            nome: "/html/body/div/div[1]/table/tbody/tr[6]/td",
            cpf: "/html/body/div/div[1]/table/tbody/tr[7]/td",
            dataNascimento: "/html/body/div/div[1]/table/tbody/tr[8]/td",
        };

        const dateAjuizamentoRaw = await extractField(paginaDosPrevFormatadaDossie, xpathMap.dataAjuizamento, "Data de ajuizamento não encontrada");
        await validateDate(dateAjuizamentoRaw, "Pegou xpath errado do ajuizamento");

        let nomeCerto: string;
        const nomeDosPrev = await extractField(paginaDosPrevFormatadaDossie, xpathMap.nome, "Nome não encontrado");
        if (nomeDosPrev) nomeCerto = getXPathText(paginaDosPrevFormatadaDossie, xpathMap.nome);

        const cpfDosprevRaw = await extractField(paginaDosPrevFormatadaDossie, xpathMap.cpf, "CPF não encontrado");
        const cpfFormatado = CorrigirCpfComZeros(cpfDosprevRaw);

        const dateNascimentoRaw = await extractField(paginaDosPrevFormatadaDossie, xpathMap.dataNascimento, "Data de nascimento não encontrada");
        await validateDate(dateNascimentoRaw, "Pegou xpath errado do nascimento");

        const valoresCalcule = await getValueCalcDossieNormal(paginaDosPrevFormatadaDossie, dateAjuizamentoRaw, dataReq)

        const objeto: IPicaPauCalculeDTO = {
            nome: nomeCerto,
            dataAjuizamento: dateAjuizamentoRaw,
            dataNascimento: dateNascimentoRaw,
            cpf: cpfFormatado,
            dataRequerimento: dataReq,
            remuneracaoAjuizamento: valoresCalcule.remuneracaoAjz || 0,
            remuneracaoRequerimento: valoresCalcule.remuneracaoReq || 0,
            isFallback: valoresCalcule.isFallback,
            fallbackInfo: valoresCalcule.fallbackInfo
        };

        return objeto;
    } catch (error) {
        console.error(error.message)
        throw error;
    }
}