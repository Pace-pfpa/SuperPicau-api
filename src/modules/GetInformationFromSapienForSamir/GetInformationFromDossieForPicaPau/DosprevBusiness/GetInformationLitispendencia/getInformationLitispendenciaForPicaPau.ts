import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";

//Se retornar false é porque tem litispedencia.                                               
export class Litispedencia{
    async funcLitis(parginaDosPrevFormatada: any): Promise<boolean>{
        try{
            //console.log("Entrou na litispendencia sapiens 1")
            const xpathRelacaoProcesso = "/html/body/div/div[2]/table/tbody/tr[2]/td";                   
            const xpathRelacaoProcessoFormatada: string = (getXPathText(parginaDosPrevFormatada, xpathRelacaoProcesso).trim());
            //console.log("string XfullPath: ",xpathRelacaoProcessoFormatada)
            const StringParaVerificar: string = "Não há relação dos processos movidos pelo autor contra o INSS.";
            const xpathRelacaoProcessoMovidosFormatada:boolean = xpathRelacaoProcessoFormatada===StringParaVerificar;
            //console.log("Litisp. S1: ", xpathRelacaoProcessoMovidosFormatada)
            return xpathRelacaoProcessoMovidosFormatada;
        }catch(e){
            console.log('ERRO LITISPENDENCIA LEITURA PATH DOSSIE SAPIENS 1')
            return false
        }
        
        
    }
    
}

