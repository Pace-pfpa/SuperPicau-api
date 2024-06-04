import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";
import { arrayExisteCessadoOuSuspenso } from "../Help/ArrayExisteCessaoOuSuspenso";
import { buscardatasLoas } from "../Help/BuscarDatas";
import { EncontrarDataMaisAtual } from "../Help/EncontrarDataMaisAtual";

export class LoasLitispendenciaSuperDossie{
    async handle(parginaDosPrevFormatada: any):Promise<any>{
        //Estrutura para identificar a maior data, e fazer a subtração dela
        let tamanhoColunasRequerimentos = 1;
        const arrayDatas: Array<Date> = [];
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
                    if(xpathCoulaFormatadoRequerimentos.indexOf("86 - ") !== -1 || xpathCoulaFormatadoRequerimentos.indexOf("87 - ")){
                                
                        const restabelecimento = {
                            beneficio: "qualquerEspecie",
                        }
                        objetosEncontradosParaVerificar.push(restabelecimento)
                    

                   
                }
              
            
        }
    }
    if(objetosEncontradosParaVerificar.length < 2) return false
            
            
    }
    
    }

    
    