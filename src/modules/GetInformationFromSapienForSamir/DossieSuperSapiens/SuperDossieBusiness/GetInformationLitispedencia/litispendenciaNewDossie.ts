import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";

                                               
export class LitispedenciaNewDossie{
    async funcLitis(parginaDosPrevFormatada: any){
        const xpathRelacaoProcesso = "/html/body/div/div[5]/table/tbody/tr";                   
        const xpathRelacaoProcessoFormatada: string = (getXPathText(parginaDosPrevFormatada, xpathRelacaoProcesso).trim());
        const StringParaVerificar: string = "Não há relação dos processos movidos pelo autor contra o INSS.";
        const xpathRelacaoProcessoMovidosFormatada:boolean = xpathRelacaoProcessoFormatada===StringParaVerificar;
        return xpathRelacaoProcessoMovidosFormatada;
        
    }
    
}

