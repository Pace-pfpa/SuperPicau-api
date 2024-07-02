import { getXPathText } from "../../../../helps/GetTextoPorXPATH";
                                           
export async function getImoveisSP (paginaSislabra: string) {
        try{

            const xpathImovel = "/html/body/div/main/div/div[12]/div/p/text()";
            const xpathImovel_formatada: string = getXPathText(paginaSislabra, xpathImovel).trim();                  
                       
            const StringParaVerificar: string = "Nenhum dado encontrado";
            
            if(xpathImovel_formatada.includes(StringParaVerificar)) return false
            return true

        } catch(e) {
            console.log('Erro leitura Xpath Imóvel SP (Sislabra)')
            return true
        }
        
        
}

// Se encontrar "Nenhum dado encontrado", retorna false, sem etiqueta.