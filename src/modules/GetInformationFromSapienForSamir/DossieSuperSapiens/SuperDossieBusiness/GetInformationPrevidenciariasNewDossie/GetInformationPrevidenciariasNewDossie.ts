import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";
import { verificarDataNoPeriodoDeDezesseisAnos } from "../../../../../helps/VerificarDataNoPeriodoDosdezeseisAnos";
import { converterDatasParaDate } from "../../../../../helps/TransformarStringParaFormatoDate";
import { ordenarDatas } from "../../../../../helps/BuscarDatasEmString";

//Estrutura para identificar data de emprego

///html/body/div/div[7]/table/tbody/tr[1]
///html/body/div/div[7]/table/tbody/tr[2]
export class DataPrevidenciariasNewDossie{
    async Previdenciarias(dataAtual: Date, dataMenosdezesseis: Date, parginaDosPrevFormatada: any): Promise<boolean>{
        let tamanhoColunaPrevidenciarias = 1;
    let verificarWhilePrevidenciarias = true;
    while(verificarWhilePrevidenciarias){
        if(typeof (getXPathText(parginaDosPrevFormatada, `html/body/div/div[7]/table/tbody/tr[${tamanhoColunaPrevidenciarias}]`)) == 'object'){
            verificarWhilePrevidenciarias = false; 
            break;
        }
        tamanhoColunaPrevidenciarias++;
    }
                            
    for(let p=1; p<tamanhoColunaPrevidenciarias; p++){
        if(typeof (getXPathText(parginaDosPrevFormatada,`html/body/div/div[7]/table/tbody/tr[${p}]`)) === 'string'){
        const xpathColunaPrevidenciarias = `html/body/div/div[7]/table/tbody/tr[${p}]`;
        const xpathCoulaFormatadoPrevidenciarias: string = getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias);
            if(xpathCoulaFormatadoPrevidenciarias.indexOf("Empregado") !== -1 || xpathCoulaFormatadoPrevidenciarias.indexOf("Contribuinte Individual") !== -1){
                    const datasEmprego = converterDatasParaDate(ordenarDatas(getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias))); 
                    //console.log(dataAtual, dataMenosdezesseis, datasEmprego[0], datasEmprego[1])            
                    const impeditivoBoolean = verificarDataNoPeriodoDeDezesseisAnos(dataAtual, dataMenosdezesseis, datasEmprego[0], datasEmprego[1]);
                    //console.log(impeditivoBoolean)
                        if(impeditivoBoolean){
                            return true;
                        }
            }
            
                                    
        }
    }
    return false;
    }
    
}
    
                        