import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";

                                               
export class LitispedenciaNewDossie{
    async funcLitis(parginaDosPrevFormatada: any){
        console.log("Entrou na litispendencia sapiens 2")
        const xpathProcessoJudicial = "/html/body/div/div[5]/table/tbody/tr/td[1]";
        const xpathCNJ = "/html/body/div/div[4]/table/tbody/tr[1]/td";                    
        const xpathProcessoJudicialFormatado: string = getXPathText(parginaDosPrevFormatada, xpathProcessoJudicial).trim().replace(/[-.]/g, "");
        const xpathCNJFormatado: string = getXPathText(parginaDosPrevFormatada, xpathCNJ).trim().replace(/[-.]/g, "");
        
        const xpathRelacaoProcessoMovidosFormatada:boolean = xpathProcessoJudicialFormatado===xpathCNJFormatado;
        return xpathRelacaoProcessoMovidosFormatada;
    }
}

