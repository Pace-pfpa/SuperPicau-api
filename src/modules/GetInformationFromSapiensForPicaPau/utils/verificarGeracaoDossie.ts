import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { ResponseArvoreDeDocumentoDTO } from "../../GetArvoreDocumento";
import { getDocumentoUseCase } from "../../GetDocumento";
import { JSDOM } from 'jsdom';

export async function verificarGeracaoDossie(dosprev: ResponseArvoreDeDocumentoDTO, cookie: string): Promise<Error> {
    const idDosprevParaPesquisa = dosprev.documentoJuntado.componentesDigitais[0].id;
    
    try {
        const paginaDosPrev = await getDocumentoUseCase.execute({ cookie, idDocument: idDosprevParaPesquisa });
        const paginaDosPrevFormatada = new JSDOM(paginaDosPrev);
        const verifarSeFoiGeradoComFalha = (getXPathText(paginaDosPrevFormatada, "/html/body/div")).trim() == "Não foi possível a geração do dossiê previdenciário.";
    
        if (verifarSeFoiGeradoComFalha) {
            throw new Error()
        }
    
        const NewDossiewithErro = (getXPathText(paginaDosPrevFormatada, '/html/body/div')).trim() == 'Falha ao gerar dossiê. Será necessário solicitá-lo novamente.';
        
        if (NewDossiewithErro) {
            throw new Error()
        }

    } catch (error) {
        console.error("Dossiê com falha na geração.");
        throw new Error("DOSPREV COM FALHA NA GERAÇÃO");
    }
    
    return null;
}