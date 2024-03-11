import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";

                                               
export class LitispedenciaNewDossie{
    async funcLitis(parginaDosPrevFormatada: any){
        console.log("Entrou na litispendencia sapiens 2")
        const xpathProcessoJudicial = "/html/body/div/div[5]/table/tbody/tr/td[1]";
        const xpathCNJ = "/html/body/div/div[4]/table/tbody/tr[1]/td";                    
        const xpathProcessoJudicialFormatado: string = (getXPathText(parginaDosPrevFormatada, xpathProcessoJudicial).trim().replace(/[-.]/g, ""));
        const xpathCNJFormatado: string = (getXPathText(parginaDosPrevFormatada, xpathCNJ).trim().replace(/[-.]/g, ""));
        
        const xpathRelacaoProcessoMovidosFormatada:boolean = xpathProcessoJudicialFormatado===xpathCNJFormatado;
        //console.log("CNJ: ", xpathCNJFormatado)
        //console.log("Processo Judicial: ", xpathProcessoJudicialFormatado)
        //console.log("Litispendência boolean: ",xpathRelacaoProcessoMovidosFormatada);
        //console.log("Litisp. S2: ", xpathRelacaoProcessoMovidosFormatada)
        return xpathRelacaoProcessoMovidosFormatada;
    }
    /*async funcLitis(parginaDosPrevFormatada: any){
        const xpathRelacaoProcesso = "/html/body/div/div[5]/table/tbody/tr";                   
        const xpathRelacaoProcessoFormatada: string = (getXPathText(parginaDosPrevFormatada, xpathRelacaoProcesso).trim());
        const StringParaVerificar: string = "Não há relação dos processos movidos pelo autor contra o INSS.";
        const xpathRelacaoProcessoMovidosFormatada:boolean = xpathRelacaoProcessoFormatada===StringParaVerificar;
        return xpathRelacaoProcessoMovidosFormatada;
        
    }*/
    
}

