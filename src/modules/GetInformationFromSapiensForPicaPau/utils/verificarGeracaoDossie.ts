import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";

export async function verificarGeracaoDossie(paginaDosPrevFormatada: JSDOMType): Promise<Error> {
    
    try {
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