import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
import { JSDOMType } from "../../../../shared/dtos/JSDOM";
                                           
export async function getBensTSE (paginaSislabra: JSDOMType): Promise<boolean> {
        try{
            const xpathBens = "/html/body/div/main/div/div[10]/div/p/text()";
            const xpathBens_formatada: string = getXPathText(paginaSislabra, xpathBens).trim();                  
                       
            const StringParaVerificar: string = "Nenhum dado encontrado";
            
            if(xpathBens_formatada.includes(StringParaVerificar)) return false;
            return true;
        } catch(e) {
            console.error('Erro leitura Xpath Bens (Sislabra)', e.message);
            return false;
        }
}

// Se encontrar "Nenhum dado encontrado", retorna false, sem etiqueta.