import { getXPathText } from "../../../../helps/GetTextoPorXPATH";
import { arrayExisteCessadoOuSuspenso } from "./Help/ArrayExisteCessaoOuSuspenso";
import { buscardatasLoas } from "./Help/BuscarDatas";
import { EncontrarDataMaisAtual } from "./Help/EncontrarDataMaisAtual";

export class LoasLitispendencia{
    async handle(parginaDosPrevFormatada: any):Promise<any>{
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
                            if(xpathCoulaFormatadoRequerimentos.indexOf("86 - ") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("87 - ") !== -1){
                                
                                    const restabelecimento = {
                                        beneficio: "qualquerEspecie",
                                    }
                                    objetosEncontradosParaVerificar.push(restabelecimento)
                                
    
                               
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

    