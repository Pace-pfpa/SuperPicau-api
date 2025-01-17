const { JSDOM } = require('jsdom');
import { CorrigirCpfComZeros } from "../../../../CreateInterested/Helps/CorrigirCpfComZeros";
import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { getDocumentoUseCase } from "../../../../GetDocumento";
import { correçaoDoErroDeFormatoDoSapiens } from "../../../../../shared/utils/CorreçaoDoErroDeFormatoDoSapiens";
import { convertToDate } from "../../createFormatDate";
import { getDERorDCBSuper } from "./getDERorDCBSuper";
import { IPicaPauCalculeDTO } from "../../../dto/Calculo/IPicaPauCalculeDTO";
import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { ResponseArvoreDeDocumentoDTO } from "../../../../GetArvoreDocumento";
import { getValueCalcDossieSuper } from "./getValueCalcDossieSuper";

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

export async function getInfoReqDossieSuper(cookie:string, superDossie: ResponseArvoreDeDocumentoDTO): Promise<IPicaPauCalculeDTO> {
    try {

        const idDosprevParaPesquisaDossieSuper = superDossie.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrevDossieSuper = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieSuper });
        const paginaDosPrevFormatadaDossieSuper = new JSDOM(paginaDosPrevDossieSuper); 

        const xpathMap = {
            dataAjuizamento: "/html/body/div/div[4]/table/tbody/tr[2]/td",
            nome: "/html/body/div/div[4]/table/tbody/tr[6]/td",
            cpf: "/html/body/div/div[4]/table/tbody/tr[7]/td",
            dataNascimento: "/html/body/div/div[4]/table/tbody/tr[8]/td",
        };

        const dateAjuizamentoRaw = await extractField(paginaDosPrevFormatadaDossieSuper, xpathMap.dataAjuizamento, "Data de ajuizamento não encontrada");
        await validateDate(dateAjuizamentoRaw, "Pegou xpath errado do ajuizamento");

        let nomeCerto: string;
        const nomeDosPrev = await extractField(paginaDosPrevFormatadaDossieSuper, xpathMap.nome, "Nome não encontrado");
        if (nomeDosPrev) nomeCerto = getXPathText(paginaDosPrevFormatadaDossieSuper, xpathMap.nome);

        const cpfDosprevRaw = await extractField(paginaDosPrevFormatadaDossieSuper, xpathMap.cpf, "CPF não encontrado");
        const cpfFormatado = CorrigirCpfComZeros(cpfDosprevRaw);

        const dateNascimentoRaw = await extractField(paginaDosPrevFormatadaDossieSuper, xpathMap.dataNascimento, "Data de nascimento não encontrada");
        await validateDate(dateNascimentoRaw, "Pegou xpath errado do nascimento");

        const dataReq = await getDERorDCBSuper(paginaDosPrevFormatadaDossieSuper, dateAjuizamentoRaw)
        
        const valoresCalcule = await getValueCalcDossieSuper(cookie, superDossie, dateAjuizamentoRaw, dataReq)

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