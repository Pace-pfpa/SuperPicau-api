import { getXPathText } from "../../../../../helps/GetTextoPorXPATH";
import { verificarDataNoPeriodoDeDezesseisAnos } from "../../../../../helps/VerificarDataNoPeriodoDosdezeseisAnos";
import { converterDatasParaDate } from "../../../../../helps/TransformarStringParaFormatoDate";
import { ordenarDatas } from "../../../../../helps/BuscarDatasEmString";
import { subtrairDates } from "../../../../../helps/SubstrairDates";
import { calcularDiasEmprego } from "../../../helps/calcularDiasEmprego";

//Estrutura para identificar data de emprego
export class DataPrevidenciarias {
    async Previdenciarias(dataAtual: Date, dataMenosdezesseis: Date, parginaDosPrevFormatada: any): Promise<boolean> {
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
                console.log(tamanhoColunaPrevidenciarias)
                const xpathColunaPrevidenciarias = `/html/body/div/div[4]/table/tbody/tr[${p}]`;
                console.log('ERRO1')
                const xpathCoulaFormatadoPrevidenciarias: string = getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias);
                if (xpathCoulaFormatadoPrevidenciarias.indexOf("Empregado") !== -1 || xpathCoulaFormatadoPrevidenciarias.indexOf("Contribuinte Individual") !== -1) {
                    console.log('ERRO2 ' + getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias))
                    const datasOrdenadas = ordenarDatas(getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias))
                    if (!datasOrdenadas) continue

                    const datasEmprego = converterDatasParaDate(datasOrdenadas);
                    console.log('ERRO3')
                    console.log(datasEmprego)
                    //console.log(dataAtual, dataMenosdezesseis, datasEmprego[0], datasEmprego[1])            
                    const impeditivoBoolean = verificarDataNoPeriodoDeDezesseisAnos(dataAtual, dataMenosdezesseis, datasEmprego[0], datasEmprego[1]);
                    console.log('ERRO4')
                    //console.log(impeditivoBoolean)
                    if (impeditivoBoolean) {
                        console.log(calcularDiasEmprego(datasEmprego[0], datasEmprego[1]))

                        if (calcularDiasEmprego(datasEmprego[0], datasEmprego[1]) > 120) {
                            return true;
                        }

                    }
                }


            }

        }
        return false;
    }

}

