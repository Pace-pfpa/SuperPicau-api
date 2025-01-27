import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { verificarDataNoPeriodoDeDezesseisAnos } from "../../../../../shared/utils/VerificarDataNoPeriodoDosdezeseisAnos";
import { converterDatasParaDate } from "../../../../../shared/utils/TransformarStringParaFormatoDate";
import { ordenarDatas } from "../../../../../shared/utils/BuscarDatasEmString";
import { EmpregoDP } from "../../../dto";
import { JSDOMType } from "../../../../../shared/dtos/JSDOM";
import { getIntervaloDias } from "../../../BuscarImpedimentos/utils/getIntervaloDeDias";

//Estrutura para identificar data de empreg
export class DataPrevidenciarias {
    async Previdenciarias(dataAtual: Date, dataMenosdezesseis: Date, parginaDosPrevFormatada: JSDOMType): Promise<EmpregoDP[]> {
        const empregosEncontrados: EmpregoDP[] = [];

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
                const xpathColunaPrevidenciarias = `/html/body/div/div[4]/table/tbody/tr[${p}]`;
                const xpathCoulaFormatadoPrevidenciarias: string = getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias);
                if (xpathCoulaFormatadoPrevidenciarias.indexOf("Empregado") !== -1 || xpathCoulaFormatadoPrevidenciarias.indexOf("Contribuinte Individual") !== -1) {
                    const datasOrdenadas = ordenarDatas(getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias))
                    if (!datasOrdenadas) continue

                    const datasEmprego = converterDatasParaDate(datasOrdenadas);
   
                    const impeditivoBoolean = verificarDataNoPeriodoDeDezesseisAnos(dataAtual, dataMenosdezesseis, datasEmprego[0], datasEmprego[1]);
                    const intervaloDias = getIntervaloDias(datasEmprego[0], datasEmprego[1]);

                    if (impeditivoBoolean  && intervaloDias >= 120) {

                        const vinculoEmprego = getXPathText(parginaDosPrevFormatada, `html/body/div/div[4]/table/tbody/tr[${p}]/td[4]`).trim()
                        const dataInicioEmprego = getXPathText(parginaDosPrevFormatada, `html/body/div/div[4]/table/tbody/tr[${p}]/td[5]`).trim()
                        const dataFimEmprego = getXPathText(parginaDosPrevFormatada, `html/body/div/div[4]/table/tbody/tr[${p}]/td[6]`).trim()
                        const filiacaoEmprego = getXPathText(parginaDosPrevFormatada, `html/body/div/div[4]/table/tbody/tr[${p}]/td[7]`).trim()
                        const ocupacaoEmprego = getXPathText(parginaDosPrevFormatada, `html/body/div/div[4]/table/tbody/tr[${p}]/td[8]`).trim()

                        empregosEncontrados.push({
                            vinculo: vinculoEmprego ? `${vinculoEmprego}` : "ORIGEM DO VÍNCULO NÃO ENCONTRADA",
                            dataInicio: dataInicioEmprego ? `${dataInicioEmprego}` : "DATA DE INÍCIO NÃO ENCONTRADA",
                            dataFim: dataFimEmprego ? `${dataFimEmprego}` : "DATA DE FIM NÃO ENCONTRADA",
                            filiacao: filiacaoEmprego ? `${filiacaoEmprego}` : "TIPO DE FILIAÇÃO NÃO ENCONTRADA",
                            ocupacao: ocupacaoEmprego ? `${ocupacaoEmprego}` : "OCUPAÇÃO NÃO ENCONTRADA",
                        });
                    }
                }
            }
        }
        return empregosEncontrados;
    }

}

