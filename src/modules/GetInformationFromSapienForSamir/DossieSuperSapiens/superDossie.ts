import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { calcularIdade } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/GetInformationIdade";
import { seguradoEspecial } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/GetInformationSeguradoEspecial";
import { requerimentos, requerimentosAtivos } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/InformatioRequerimento";
import { dataPrevidencias } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/InformationPrevidenciarias";
import { calcularIdadeNewDossie } from "./SuperDossieBusiness/CalcularIdade";
import { litispedenciaNewDossieMaternidade, litispedenciaNewDossieRural } from "./SuperDossieBusiness/GetInformationLitispedencia";
import { dataPrevidenciariasNewDossie } from "./SuperDossieBusiness/GetInformationPrevidenciariasNewDossie";
import { datasRequerimentoAtivoNewDossie, datasRequerimentoNewDossie } from "./SuperDossieBusiness/GetInformationRequerimento";


export class SuperDossie {
    async impedimentos(
        paginaDosprevFormatada: any,
        parginaDosPrev: any,
        AgeDossie: boolean,
        loas: any
      ): Promise<string> {
        let ArrayImpedimentos: string = '';
        try {
          const DatasAtualEMenosDezesseis: Array<Date> =
            await datasRequerimentoNewDossie.dataRequerimento(paginaDosprevFormatada)
          if (DatasAtualEMenosDezesseis[0] == null) {
            ArrayImpedimentos = ArrayImpedimentos + " AUSÊNCIA DE REQUERIMENTO AUTOR -";
          } else {
            const verificarDataFinal: boolean =
              await dataPrevidenciariasNewDossie.Previdenciarias(
                DatasAtualEMenosDezesseis[0],
                DatasAtualEMenosDezesseis[1],
                paginaDosprevFormatada
              );
            if (verificarDataFinal) {
              ArrayImpedimentos = ArrayImpedimentos + " EMPREGO -";
            }
          }
        } catch {
          ArrayImpedimentos = ArrayImpedimentos + " VÍNCULO ABERTO -";
        }
        
        if (!AgeDossie && !loas) {
          const verificarIdade: Array<boolean> = await calcularIdadeNewDossie.calcIdade(
            paginaDosprevFormatada
          );
          if (verificarIdade.length == 0) {
            ArrayImpedimentos = ArrayImpedimentos + " IDADE INDEFINIDA -";
          } else if (!verificarIdade[0] && verificarIdade.length != 0) {
            ArrayImpedimentos = ArrayImpedimentos + " IDADE -";
          }

          


          const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[5]/table/tbody/tr/td"

          const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);


          if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){


            const xpathNumeroUnicoCnj = "/html/body/div/div[4]/table/tbody/tr[1]/td";
            const numeroUnicoCnj = getXPathText(paginaDosprevFormatada, xpathNumeroUnicoCnj);

            const xpathProcessoJudicial = "/html/body/div/div[5]/table/tbody/tr/td[1]";
            const processoJudicial = getXPathText(paginaDosprevFormatada, xpathProcessoJudicial);

            if(processoJudicial && processoJudicial.trim() == numeroUnicoCnj.trim()){

              const verificarLitispedencia = await litispedenciaNewDossieRural.funcLitis(
                paginaDosprevFormatada
              );
        
              if (verificarLitispedencia) {
                ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA m -";
              }
            }
            
          }





        }else if(AgeDossie && !loas){


          const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[5]/table/tbody/tr/td"

          const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);

          if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){


            const xpathNumeroUnicoCnj = "/html/body/div/div[4]/table/tbody/tr[1]/td";
            const numeroUnicoCnj = getXPathText(paginaDosprevFormatada, xpathNumeroUnicoCnj);

            const xpathProcessoJudicial = "/html/body/div/div[5]/table/tbody/tr/td[1]";
            const processoJudicial = getXPathText(paginaDosprevFormatada, xpathProcessoJudicial);

            if(processoJudicial && processoJudicial.trim() == numeroUnicoCnj.trim()){

              const verificarLitispedencia = await litispedenciaNewDossieMaternidade.funcLitis(
                paginaDosprevFormatada
              );
              if (verificarLitispedencia) {
                ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA r-";
              }

            }


          }


        }else if(AgeDossie){

          const verificarIdade: Array<boolean> = await calcularIdade.calcIdade(
            paginaDosprevFormatada
          );
         
          if (verificarIdade.length == 0) {
            ArrayImpedimentos = ArrayImpedimentos + " IDADE INDEFINIDA -";
          } else if (!verificarIdade[0] && verificarIdade.length != 0) {
            ArrayImpedimentos = ArrayImpedimentos + " IDADE -";
          }
    
    
        }
    
    
        const segurado = await seguradoEspecial.handle(parginaDosPrev);
        const requerimentoAtivo: boolean = await datasRequerimentoAtivoNewDossie.handle(
          paginaDosprevFormatada
        );
    
        if (segurado !== -1 || requerimentoAtivo == true) {
          ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
        }
    
        return ArrayImpedimentos;
      }

}