const { JSDOM } = require('jsdom');
import { GetArvoreDocumentoDTO, getArvoreDocumentoUseCase, ResponseArvoreDeDocumentoDTO } from '../../GetArvoreDocumento';
import { getCapaDoPassivaUseCase } from '../../GetCapaDoPassiva/index';
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { correçaoDoErroDeFormatoDoSapiens } from '../../../shared/utils/CorreçaoDoErroDeFormatoDoSapiens';
export async function coletarArvoreDeDocumentoDoPassivo(data: GetArvoreDocumentoDTO): Promise<Array<ResponseArvoreDeDocumentoDTO>>{
    const capaHTMLDoPassivo = await getCapaDoPassivaUseCase.execute(data.nup, data.cookie)
    const capaDoPassivoFormata =  new JSDOM(capaHTMLDoPassivo)
    const xphatDaNUP_Principal =  "/html/body/div/div[4]/table/tbody/tr[13]/td[2]/a[1]/b"
    try {
        data.nup = correçaoDoErroDeFormatoDoSapiens(getXPathText(capaDoPassivoFormata, xphatDaNUP_Principal)).replace("(PRINCIPAL)", "").replace("-", "").replace("/", "").replace(".", "");
        return (await getArvoreDocumentoUseCase.execute(data)).reverse();   
    } catch (error) {
        console.log(error);
        return [];
    }

}