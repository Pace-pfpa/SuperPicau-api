import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
                                           
export async function getImoveisSP (paginaSislabra: JSDOMType) {
    try{
        const xpathImovel = "/html/body/div/main/div/div[12]/div/p/text()";
        const xpathImovel_formatada: string = getXPathText(paginaSislabra, xpathImovel).trim();                  
                       
        const StringParaVerificar: string = "Nenhum dado encontrado";
            
        if(xpathImovel_formatada.includes(StringParaVerificar)) return false
        return true
    } catch(e) {
        console.error('Erro leitura Xpath Imóvel SP (Sislabra)', e.message);
        return false;
    }
}