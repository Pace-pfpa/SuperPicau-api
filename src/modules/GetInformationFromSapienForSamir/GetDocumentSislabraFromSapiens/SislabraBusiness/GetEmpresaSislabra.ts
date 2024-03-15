import { getXPathText } from "../../../../helps/GetTextoPorXPATH";

//Se retornar false é porque tem litispedencia.                                               
export async function getEmpresa(paginaSislabra: string){
        try{
            //console.log("Entrou na litispendencia sapiens 1")
            const xpathEmpresaPartSocietaria_1 = "/html/body/div/main/div/div[6]/div/p/text()";
            const xpathEmpresaPartSocietaria_2 = "/html/body/div/main/div/div[7]/div/p/text()";
            const xpathEmpresaPartSocietaria_1_formatada: string = getXPathText(paginaSislabra, xpathEmpresaPartSocietaria_1).trim();                     
            const xpathEmpresaPartSocietaria_2_formatada: string = getXPathText(paginaSislabra, xpathEmpresaPartSocietaria_2).trim();                     
                       
            const StringParaVerificar: string = "Nenhum dado encontrado";
            
            if(xpathEmpresaPartSocietaria_1_formatada.includes(StringParaVerificar) || xpathEmpresaPartSocietaria_2_formatada.includes(StringParaVerificar)) return false
            return true
            //return xpathRelacaoProcessoMovidosFormatada;
        }catch(e){
            console.log('Erro leitura Xpath Empresa (Sislabra)')
            return true
        }
        
        
    }
    


