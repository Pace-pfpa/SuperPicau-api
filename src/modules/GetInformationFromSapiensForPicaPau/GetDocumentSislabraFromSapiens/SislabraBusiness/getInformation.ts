import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
                                           
export async function getInformation(paginaSislabra: JSDOMType): Promise<string> {
    try{
        const xpathNome = "/html/body/div/main/div/div[1]/div[2]/p";
        const xpathNome_formatada: string = getXPathText(paginaSislabra, xpathNome).trim();                  
        
        return xpathNome_formatada;
    } catch(e) {
        console.error('Erro leitura Xpath Informações (Sislabra)', e.message);
        return 'Pessoa não identificada';
    }
}