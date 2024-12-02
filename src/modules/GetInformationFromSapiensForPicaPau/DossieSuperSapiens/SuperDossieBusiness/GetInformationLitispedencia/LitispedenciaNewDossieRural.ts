import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { buscardatasLoas } from "../../../loas/Business/Help/BuscarDatas";

                                               
export class LitispedenciaNewDossieRural{
    async funcLitis(parginaDosPrevFormatada: any){
        /* console.log("Entrou na litispendencia sapiens 2")
        const xpathProcessoJudicial = "/html/body/div/div[5]/table/tbody/tr/td[1]";
        const xpathCNJ = "/html/body/div/div[4]/table/tbody/tr[1]/td";                    
        const xpathProcessoJudicialFormatado: string = getXPathText(parginaDosPrevFormatada, xpathProcessoJudicial).trim().replace(/[-.]/g, "");
        const xpathCNJFormatado: string = getXPathText(parginaDosPrevFormatada, xpathCNJ).trim().replace(/[-.]/g, "");
        
        const xpathRelacaoProcessoMovidosFormatada:boolean = xpathProcessoJudicialFormatado===xpathCNJFormatado;
        return xpathRelacaoProcessoMovidosFormatada; */

         //Estrutura para identificar a maior data, e fazer a subtração dela
         try{

             let tamanhoColunasRequerimentos = 1;
             let verificarWhileRequerimentos = true;
             while(verificarWhileRequerimentos){
                 if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[6]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
                     verificarWhileRequerimentos = false; 
                     break;
                 }
                 tamanhoColunasRequerimentos++;
             }
             const objetosEncontradosParaVerificar = []
                 for(let t=1; t<tamanhoColunasRequerimentos; t++){
                     if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[6]/table/tbody/tr[${t}]`)) === 'string'){
                         const xpathColunaRequerimentos = `/html/body/div/div[6]/table/tbody/tr[${t}]`;
                         const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                         if(xpathCoulaFormatadoRequerimentos.indexOf("41 - ") !== -1 ){
                            
                               
                           
                             
                                const restabelecimento = {
                                    beneficio: "qualquerStatus",
                                   
                                }
                                objetosEncontradosParaVerificar.push(restabelecimento)
                            

                           const datasEncontradas = (buscardatasLoas(xpathCoulaFormatadoRequerimentos))
                        }
                      
                    
                }
            }
            if(objetosEncontradosParaVerificar.length < 2) return false
            return true
    }catch(e){
        console.log("erro no maternidade litispendencia"  +e)
        return false;
    }


    }
}

