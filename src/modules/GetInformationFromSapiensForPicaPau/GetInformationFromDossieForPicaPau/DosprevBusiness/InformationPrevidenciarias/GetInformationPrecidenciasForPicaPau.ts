import { getXPathText } from "../../../../../shared/utils/GetTextoPorXPATH";
import { verificarDataNoPeriodoDeDezesseisAnos } from "../../../../../shared/utils/VerificarDataNoPeriodoDosdezeseisAnos";
import { converterDatasParaDate } from "../../../../../shared/utils/TransformarStringParaFormatoDate";
import { ordenarDatas } from "../../../../../shared/utils/BuscarDatasEmString";
import { calcularDiasEmprego } from "../../../helps/calcularDiasEmprego";
import { JSDOM } from 'jsdom';
import { EmpregoDP } from "../../../dto";

//Estrutura para identificar data de empreg
export class DataPrevidenciarias {
    async Previdenciarias(dataAtual: Date, dataMenosdezesseis: Date, parginaDosPrevFormatada: string): Promise<EmpregoDP[]> {
        const empregosEncontrados: EmpregoDP[] = [];

        const dom = new JSDOM(parginaDosPrevFormatada);

        let tamanhoColunaPrevidenciarias = 2;
        let verificarWhilePrevidenciarias = true;
        while (verificarWhilePrevidenciarias) {
            if (typeof (getXPathText(dom, `/html/body/div/div[4]/table/tbody/tr[${tamanhoColunaPrevidenciarias}]`)) == 'object') {
                verificarWhilePrevidenciarias = false;
                break;
            }
            tamanhoColunaPrevidenciarias++;
        }


        for (let p = 2; p < tamanhoColunaPrevidenciarias; p++) {
            if (typeof (getXPathText(dom, `/html/body/div/div[4]/table/tbody/tr[${p}]`)) === 'string') {
                //console.log(tamanhoColunaPrevidenciarias)
                const xpathColunaPrevidenciarias = `/html/body/div/div[4]/table/tbody/tr[${p}]`;
                //console.log('ERRO1')
                const xpathCoulaFormatadoPrevidenciarias: string = getXPathText(dom, xpathColunaPrevidenciarias);
                if (xpathCoulaFormatadoPrevidenciarias.indexOf("Empregado") !== -1 || xpathCoulaFormatadoPrevidenciarias.indexOf("Contribuinte Individual") !== -1) {
                    //console.log('ERRO2 ' + getXPathText(parginaDosPrevFormatada, xpathColunaPrevidenciarias))
                    const datasOrdenadas = ordenarDatas(getXPathText(dom, xpathColunaPrevidenciarias))
                    if (!datasOrdenadas) continue

                    const datasEmprego = converterDatasParaDate(datasOrdenadas);
   
                    const impeditivoBoolean = verificarDataNoPeriodoDeDezesseisAnos(dataAtual, dataMenosdezesseis, datasEmprego[0], datasEmprego[1]);

                    if (impeditivoBoolean) {

                        if (calcularDiasEmprego(datasEmprego[0], datasEmprego[1]) > 120) {


                            const vinculoEmprego = getXPathText(dom, `html/body/div/div[4]/table/tbody/tr[${p}]/td[4]`).trim()
                            const dataInicioEmprego = getXPathText(dom, `html/body/div/div[4]/table/tbody/tr[${p}]/td[5]`).trim()
                            const dataFimEmprego = getXPathText(dom, `html/body/div/div[4]/table/tbody/tr[${p}]/td[6]`).trim()
                            const filiacaoEmprego = getXPathText(dom, `html/body/div/div[4]/table/tbody/tr[${p}]/td[7]`).trim()
                            const ocupacaoEmprego = getXPathText(dom, `html/body/div/div[4]/table/tbody/tr[${p}]/td[8]`).trim()


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

        }

        return empregosEncontrados;
    }

}

