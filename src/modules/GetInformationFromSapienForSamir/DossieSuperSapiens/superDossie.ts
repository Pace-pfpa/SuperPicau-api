import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { calcularIdade } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/GetInformationIdade";
import { seguradoEspecial } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/GetInformationSeguradoEspecial";
import { requerimentos, requerimentosAtivos } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/InformatioRequerimento";
import { dataPrevidencias } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/InformationPrevidenciarias";
import { loasEmpregoSuperDossie, loasLitispendenciaSuperDossie, restabelecimentoRequerimentosSuperDossie } from "../loas/Business";
import { calcularIdadeNewDossie } from "./SuperDossieBusiness/CalcularIdade";
import { litispedenciaNewDossieMaternidade, litispedenciaNewDossieRural } from "./SuperDossieBusiness/GetInformationLitispedencia";
import { dataPrevidenciariasNewDossie } from "./SuperDossieBusiness/GetInformationPrevidenciariasNewDossie";
import { datasRequerimentoAtivoNewDossie, datasRequerimentoNewDossie } from "./SuperDossieBusiness/GetInformationRequerimento";


export class SuperDossie {
    async impedimentosMaternidade(
        paginaDosprevFormatada: any,
        parginaDosPrev: any
      ): Promise<string> {
        let ArrayImpedimentos: string = '';

        
    

          


    

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


      
    
        
    
    
  
    
        return ArrayImpedimentos + " *MATERNIDADE* ";
      }







      async impeditivosRural(paginaDosprevFormatada: any,
        parginaDosPrev: any
      ){
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




        const segurado = await seguradoEspecial.handle(parginaDosPrev);
        const requerimentoAtivo: boolean = await datasRequerimentoAtivoNewDossie.handle(
          paginaDosprevFormatada
        );
    
        if (segurado !== -1 || requerimentoAtivo == true) {
          ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
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





          return ArrayImpedimentos + " *RURAL* "

      }





      




      async impeditivosLoas(paginaDosprevFormatada: any,
        parginaDosPrev: any){
          let ArrayImpedimentos: string = ''; 


          
          try{
            const restabelecimentoRequerimentos = await restabelecimentoRequerimentosSuperDossie.handle(paginaDosprevFormatada)
  
  
            if(restabelecimentoRequerimentos instanceof Error){
              ArrayImpedimentos = ArrayImpedimentos + " erro estabelecimento -"
            }else if(restabelecimentoRequerimentos){
              ArrayImpedimentos = ArrayImpedimentos + " RESTABELECIMENTO -"
            }
  
  
  
  
            const loasLitispendencia = await loasLitispendenciaSuperDossie.handle(paginaDosprevFormatada);
  
  
            if(loasLitispendencia instanceof Error){
              ArrayImpedimentos = ArrayImpedimentos + " erro estabelecimento -"
              }else if(loasLitispendencia){
                ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA l-"
              }
  
  
  
  
            const loasEmprego = await loasEmpregoSuperDossie.execute(paginaDosprevFormatada)
  
  
            if(typeof(loasEmprego) == "boolean"){
              if(loasEmprego){
                ArrayImpedimentos = ArrayImpedimentos + " LOAS EMPREGO -"
              }
            }else if(typeof(loasEmprego) == "object"){
              if(loasEmprego.valorBooleano){
                ArrayImpedimentos = ArrayImpedimentos + loasEmprego.message
              }else{
                ArrayImpedimentos = ArrayImpedimentos + loasEmprego.message
              }
            }
  
  
  
  
            return ArrayImpedimentos + " *LOAS* ";

          }catch(e){
            console.log(e)
            return "erro ao le loas"
          }






      }

}