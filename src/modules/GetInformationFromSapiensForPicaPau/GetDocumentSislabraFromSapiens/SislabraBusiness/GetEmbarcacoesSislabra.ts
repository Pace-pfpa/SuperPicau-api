import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
                                           
export async function getEmbarcacoes (paginaSislabra: JSDOMType) {
        try{

            const xpathEmbarcacao = "/html/body/div/main/div/div[14]/div/p/text()";
            const xpathEmbarcacao_formatada: string = getXPathText(paginaSislabra, xpathEmbarcacao).trim();                  
                       
            const StringParaVerificar: string = "Nenhum dado encontrado";
            
            if(xpathEmbarcacao_formatada.includes(StringParaVerificar)) return false
            return true

        } catch(e) {
            console.log('Erro leitura Xpath Embarcação (Sislabra)')
            return true
        }
        
        
}

// Se encontrar "Nenhum dado encontrado", retorna false, sem etiqueta.