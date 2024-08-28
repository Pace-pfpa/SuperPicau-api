import { getXPathText } from "../../../../helps/GetTextoPorXPATH";
                                           
export async function getAeronaves (paginaSislabra: string) {
        try{

            const xpathAeronave = "/html/body/div/main/div/div[15]/div/p/text()";
            const xpathAeronave_formatada: string = getXPathText(paginaSislabra, xpathAeronave).trim();                  
                       
            const StringParaVerificar: string = "Nenhum dado encontrado";
            
            if(xpathAeronave_formatada.includes(StringParaVerificar)) return false
            return true

        } catch(e) {
            console.log('Erro leitura Xpath Aeronave (Sislabra)')
            return true
        }
        
        
}

// Se encontrar "Nenhum dado encontrado", retorna false, sem etiqueta.