import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";
import { verificarDataNoPeriodoDeDezesseisAnos } from "../../../../../helps/VerificarDataNoPeriodoDosdezeseisAnos";
import { converterDatasParaDate } from "../../../../../helps/TransformarStringParaFormatoDate";
import { ordenarDatas } from "../../../../../helps/BuscarDatasEmString";
import { subtrairDates } from "../../../../../helps/SubstrairDates";
import { calcularDiasEmprego } from "../../../helps/calcularDiasEmprego";
import { IImpeditivoEmpregoRM } from "../../../../../DTO/IImpeditivosRM";

//Estrutura para identificar data de emprego
export class DataPrevidenciarias {
    async Previdenciarias(dataAtual: Date, dataMenosdezesseis: Date, parginaDosPrevFormatada: any): Promise<IImpeditivoEmpregoRM> {
        let impeditivoEmprego: string = ''; 

        let tamanhoColunaPrevidenciarias = 2;
        let verificarWhilePrevidenciarias = true;
        while (verificarWhilePrevidenciarias) {
            if (typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[4]/table/tbody/tr[${tamanhoColunaPrevidenciarias}]`)) == 'object') {
                verificarWhilePrevidenciarias = false;
                break;
            }
            tamanhoColunaPrevidenciarias++;
        }


        for (let p = 2; p < tamanhoColunaPrevidenciarias; p++) {
            if (typeof (getXPathText(parginaDosPrevFormatada, `/html/body/div/div[4]/table/tbody/tr[${p}]`)) === 'string') {
                //console.log(tamanhoColunaPrevidenciarias)
                const xpathColunaPrevidenciarias = `/html/body/div/div[4]/table/tbody/tr[${p}]`;
                //console.log('ERRO1')
                const xpathCoulaFormatadoPrevidenciarias: string = getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias);
                if (xpathCoulaFormatadoPrevidenciarias.indexOf("Empregado") !== -1 || xpathCoulaFormatadoPrevidenciarias.indexOf("Contribuinte Individual") !== -1) {
                    //console.log('ERRO2 ' + getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias))
                    const datasOrdenadas = ordenarDatas(getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias))
                    if (!datasOrdenadas) continue

                    const datasEmprego = converterDatasParaDate(datasOrdenadas);
   
                    const impeditivoBoolean = verificarDataNoPeriodoDeDezesseisAnos(dataAtual, dataMenosdezesseis, datasEmprego[0], datasEmprego[1]);

                    if (impeditivoBoolean) {

                        if (calcularDiasEmprego(datasEmprego[0], datasEmprego[1]) > 120) {
                            impeditivoEmprego = xpathCoulaFormatadoPrevidenciarias.trim();
                            return {
                                haveEmprego: true,
                                emprego: impeditivoEmprego   
                            } 
                        }

                    }
                }


            }

        }
        return {
            haveEmprego: false,
            emprego: impeditivoEmprego
         }
    }

}

