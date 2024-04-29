import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";
import { arrayExisteCessadoOuSuspenso } from "../../../loas/Business/Help/ArrayExisteCessaoOuSuspenso";
import { buscardatasLoas } from "../../../loas/Business/Help/BuscarDatas";
import { EncontrarDataMaisAtual } from "../../../loas/Business/Help/EncontrarDataMaisAtual";

//Se retornar false é porque tem litispedencia.                                               
export class LitispedenciaMaternidade{
    async funcLitis(parginaDosPrevFormatada: any): Promise<any>{
       /*  try{
           
            const xpathRelacaoProcesso = "/html/body/div/div[2]/table/tbody/tr[2]/td";                   
            const xpathRelacaoProcessoFormatada: string = (getXPathText(parginaDosPrevFormatada, xpathRelacaoProcesso).trim());
           
            const StringParaVerificar: string = "Não há relação dos processos movidos pelo autor contra o INSS.";
            const xpathRelacaoProcessoMovidosFormatada:boolean = xpathRelacaoProcessoFormatada===StringParaVerificar;
            
            return xpathRelacaoProcessoMovidosFormatada;
        }catch(e){
            console.log('ERRO LITISPENDENCIA LEITURA PATH DOSSIE SAPIENS 1')
            return false
        } */
        
        try{

            let tamanhoColunasRequerimentos = 2;
            const arrayDatas: Array<Date> = [];
            let verificarWhileRequerimentos = true;
            while(verificarWhileRequerimentos){
                if(typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[3]/table/tbody/tr[${tamanhoColunasRequerimentos}]`)) == 'object'){
                    verificarWhileRequerimentos = false; 
                    break;
                }
                tamanhoColunasRequerimentos++;
            }
            console.log("TAMANHO")
            console.log(tamanhoColunasRequerimentos)
                const objetosEncontradosParaVerificar = []
                for(let t=2; t<tamanhoColunasRequerimentos; t++){
                    if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[3]/table/tbody/tr[${t}]`)) === 'string'){
                        const xpathColunaRequerimentos = `/html/body/div/div[3]/table/tbody/tr[${t}]`;
                        const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                        //console.log(buscardatasLoas(xpathCoulaFormatadoRequerimentos))
                        console.log(xpathCoulaFormatadoRequerimentos)
                        if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1 ){
                            if(xpathCoulaFormatadoRequerimentos.indexOf("80 - ") !== -1 ){
                                if(xpathCoulaFormatadoRequerimentos.indexOf("CESSADO") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("SUSPENSO") !== -1){
                                    const restabelecimento = {
                                        beneficio: "cessaoOuSuspenso",
                                    }
                                    objetosEncontradosParaVerificar.push(restabelecimento)
                                }
    
                               
                            }
                          
                        }
                    }
                }
                if(objetosEncontradosParaVerificar.length == 0) return false
                return true
        }catch(e){
            console.log("erro no maternidade litispendencia"  +e)
            return false;
        }

        
            
        
    }
    
}

