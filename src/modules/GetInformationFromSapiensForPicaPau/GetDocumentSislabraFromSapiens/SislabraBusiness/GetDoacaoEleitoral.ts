import { JSDOMType } from "../../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../../shared/utils/GetTextoPorXPATH";      

export async function getDoacaoEleitoral(paginaSislabra: JSDOMType): Promise<boolean> {
        try {
            const xpathDoacaoEleitoral = "/html/body/div/main/div/div[16]/div/p/text()";
            const xpathDoacaoEleitoral_formatada: string = getXPathText(paginaSislabra, xpathDoacaoEleitoral).trim();              
                       
            const StringParaVerificar: string = "Nenhum dado encontrado";
            
            if(xpathDoacaoEleitoral_formatada.includes(StringParaVerificar)) return false;
            return true

        } catch(e) {
            console.error('Erro leitura Xpath Doacao (Sislabra)', e.message);
            return false;
        }
}