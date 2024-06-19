const { JSDOM } = require('jsdom');
import { CorrigirCpfComZeros } from "../../CreateInterested/Helps/CorrigirCpfComZeros";
import { IInformationsForCalculeDTO } from "../../../DTO/InformationsForCalcule";
import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { getDocumentoUseCase } from "../../GetDocumento";
import { correçaoDoErroDeFormatoDoSapiens } from "../../../helps/CorreçaoDoErroDeFormatoDoSapiens";
import { convertToDate } from "./createFormatDate";
import { getDERorDCB } from "./getDERorDCB";

export async function getInfoCalcDossieSuper(cookie:string, superDossie: any) {

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

        const dateNascimento = correçaoDoErroDeFormatoDoSapiens(getXPathText(paginaDosPrevFormatadaDossieSuper, xpathDataNascimento));
        if(!dateNascimento || dateNascimento.length == 0) throw new Error("Data de nascimento não encontrada");
        if(!(typeof(convertToDate(dateNascimento.trim())) == typeof(new Date()))) throw new Error("Pegou xpath errado do nascimento");

        console.log('----TESTANDO: ')
        console.log(dateAjuizamento)
        console.log(nomeDosPrev)
        console.log(CorrigirCpfComZeros(cpfDosprev))
        console.log(dateNascimento)




        // REQUERIMENTOS

        const dataReq = await getDERorDCB(paginaDosPrevFormatadaDossieSuper, dateAjuizamento)



    } catch (error) {
        console.error(error.message)
    }

    

    return 
}