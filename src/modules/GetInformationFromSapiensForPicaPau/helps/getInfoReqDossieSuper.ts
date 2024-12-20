const { JSDOM } = require('jsdom');
import { CorrigirCpfComZeros } from "../../CreateInterested/Helps/CorrigirCpfComZeros";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { getDocumentoUseCase } from "../../GetDocumento";
import { correçaoDoErroDeFormatoDoSapiens } from "../../../shared/utils/CorreçaoDoErroDeFormatoDoSapiens";
import { convertToDate } from "./createFormatDate";
import { getDERorDCBSuper } from "./getDERorDCBSuper";
import { getValueCalcDossieSuper } from "./getValueCalcDossieSuper";
import { IPicaPauCalculeDTO } from "../dto/Calculo/IPicaPauCalculeDTO";

export async function getInfoReqDossieSuper (cookie:string, superDossie: any): Promise<IPicaPauCalculeDTO> {

    try {

        const idDosprevParaPesquisaDossieSuper = superDossie.documentoJuntado.componentesDigitais[0].id;
        const paginaDosPrevDossieSuper = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieSuper });
        
        const paginaDosPrevFormatadaDossieSuper = new JSDOM(paginaDosPrevDossieSuper); 
        
        // FICHA SINTÉTICA DO PROCESSO XPATH
        const xpathDataAjuizamento = "/html/body/div/div[4]/table/tbody/tr[2]/td"
        const xpathNome = "/html/body/div/div[4]/table/tbody/tr[6]/td"
        const xpathCpfDosprev = "/html/body/div/div[4]/table/tbody/tr[7]/td"
        const xpathDataNascimento = "/html/body/div/div[4]/table/tbody/tr[8]/td"

        const dateAjuizamento = correçaoDoErroDeFormatoDoSapiens(getXPathText(paginaDosPrevFormatadaDossieSuper, xpathDataAjuizamento));
        if(!dateAjuizamento || dateAjuizamento.length == 0) throw new Error("Data de ajuizamento não encontrada");
        if(!(typeof(convertToDate(dateAjuizamento.trim())) == typeof(new Date()))) throw new Error("Pegou xpath errado do ajuizamento");

        const nomeDosPrev = getXPathText(paginaDosPrevFormatadaDossieSuper, xpathNome);
        if(!nomeDosPrev || nomeDosPrev.length == 0) throw new Error("Nome não encontrado");

        const cpfDosprev = correçaoDoErroDeFormatoDoSapiens(getXPathText(paginaDosPrevFormatadaDossieSuper, xpathCpfDosprev));
        if (!cpfDosprev || cpfDosprev.length == 0) throw new Error("CPF não encontrado")
        const cpfFormatado = CorrigirCpfComZeros(cpfDosprev)

        const dateNascimento = correçaoDoErroDeFormatoDoSapiens(getXPathText(paginaDosPrevFormatadaDossieSuper, xpathDataNascimento));
        if(!dateNascimento || dateNascimento.length == 0) throw new Error("Data de nascimento não encontrada");
        if(!(typeof(convertToDate(dateNascimento.trim())) == typeof(new Date()))) throw new Error("Pegou xpath errado do nascimento");

        // DATA DER OU DCB 

        const dataReq = await getDERorDCBSuper(paginaDosPrevFormatadaDossieSuper, dateAjuizamento)

        console.log('--REQ DATE')
        console.log(dataReq)

        const valoresCalcule = await getValueCalcDossieSuper(cookie, superDossie, dateAjuizamento, dataReq)

        if (valoresCalcule instanceof Error) {

            const objeto: IPicaPauCalculeDTO = { nome: nomeDosPrev, dataAjuizamento: dateAjuizamento, dataNascimento: dateNascimento, cpf: cpfFormatado, dataRequerimento: dataReq, remuneracaoAjuizamento: 0, remuneracaoRequerimento: 0 }

            return objeto
        } else {
            const objeto: IPicaPauCalculeDTO = { nome: nomeDosPrev, dataAjuizamento: dateAjuizamento, dataNascimento: dateNascimento, cpf: cpfFormatado, dataRequerimento: dataReq, remuneracaoAjuizamento: valoresCalcule.remuneracaoAjz, remuneracaoRequerimento: valoresCalcule.remuneracaoReq }

            return objeto
        }




    } catch (error) {
        console.error(error.message)
    }

    

    return 
}