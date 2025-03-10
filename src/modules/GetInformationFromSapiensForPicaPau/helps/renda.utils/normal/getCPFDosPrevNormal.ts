import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { getDocumentoUseCase } from "../../../../GetDocumento";
const { JSDOM } = require('jsdom');


export async function getCPFDosPrevNormal (normalDossie: any, cookie: string): Promise<string> {

    const idDosprevParaPesquisaDossieNormal = normalDossie.documentoJuntado.componentesDigitais[0].id;
    const parginaDosPrevDossieNormal = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisaDossieNormal });
        
    const parginaDosPrevFormatadaDossieNormal = new JSDOM(parginaDosPrevDossieNormal); 
        
    const xpathCpfDosprev = "/html/body/div/div[1]/table/tbody/tr[7]/td"
    const cpfDosprev = getXPathText(parginaDosPrevFormatadaDossieNormal, xpathCpfDosprev);

    return cpfDosprev;
}
