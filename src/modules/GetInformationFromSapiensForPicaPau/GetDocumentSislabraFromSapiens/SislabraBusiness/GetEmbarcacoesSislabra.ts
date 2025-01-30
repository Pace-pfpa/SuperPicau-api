import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";
                                           
export async function getEmbarcacoes(paginaSislabra: JSDOMType): Promise<boolean> {
        try{
            const xpathEmbarcacao = "/html/body/div/main/div/div[14]/div/p/text()";
            const xpathEmbarcacao_formatada: string = getXPathText(paginaSislabra, xpathEmbarcacao).trim();                  
                       
            const StringParaVerificar: string = "Nenhum dado encontrado";
            
            if(xpathEmbarcacao_formatada.includes(StringParaVerificar)) return false;
            return true;
        } catch(e) {
            console.error('Erro leitura Xpath Embarcação (Sislabra)', e.message);
            return false;
        }
}

// Se encontrar "Nenhum dado encontrado", retorna false, sem etiqueta.