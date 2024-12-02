import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { buscardatasLoas } from "../../../loas/Business/Help/BuscarDatas";

//Se retornar false é porque tem litispedencia.                                               
export class LitispedenciaRural{
    async funcLitis(parginaDosPrevFormatada: any): Promise<any>{
        
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

                const objetosEncontradosParaVerificar = []
                for(let t=2; t<tamanhoColunasRequerimentos; t++){
                    if(typeof (getXPathText(parginaDosPrevFormatada,`/html/body/div/div[3]/table/tbody/tr[${t}]`)) === 'string'){
                        const xpathColunaRequerimentos = `/html/body/div/div[3]/table/tbody/tr[${t}]`;
                        const xpathCoulaFormatadoRequerimentos: string = getXPathText(parginaDosPrevFormatada, xpathColunaRequerimentos);
                        //console.log(buscardatasLoas(xpathCoulaFormatadoRequerimentos))
                        console.log(xpathCoulaFormatadoRequerimentos)
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

