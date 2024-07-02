import { getXPathText } from "../../../../helps/GetTextoPorXPATH";
                                           
export async function getBensTSE (paginaSislabra: string) {
        try{

            const xpathBens = "/html/body/div/main/div/div[10]/div/p/text()";
            const xpathBens_formatada: string = getXPathText(paginaSislabra, xpathBens).trim();                  
                       
            const StringParaVerificar: string = "Nenhum dado encontrado";
            
            if(xpathBens_formatada.includes(StringParaVerificar)) return false
            return true

        } catch(e) {
            console.log('Erro leitura Xpath Bens (Sislabra)')
            return true
        }
        
        
}

// Se encontrar "Nenhum dado encontrado", retorna false, sem etiqueta.