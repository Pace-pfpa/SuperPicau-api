import { response } from "express";
import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { calcularIdade } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/GetInformationIdade";
import { seguradoEspecial } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/GetInformationSeguradoEspecial";
import { requerimentos, requerimentosAtivos } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/InformatioRequerimento";
import { dataPrevidencias } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/InformationPrevidenciarias";
import { loasEmpregoSuperDossie, loasLitispendenciaSuperDossie, restabelecimentoRequerimentosSuperDossie, loasAtivoSuperDossie, loasIdadeSuperDossie } from "../loas/Business";
import { buscarTabelaRelacaoDeProcessos } from "./Help/BuscarTabelaRelacaoDeProcessos";
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

        
    



        try {

          const dataSubtrair = 5;
          const DatasAtualEMenosDezesseis: Array<Date> =
            await datasRequerimentoNewDossie.dataRequerimento(paginaDosprevFormatada, dataSubtrair)
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

            const processoJudicial = await buscarTabelaRelacaoDeProcessos(paginaDosprevFormatada, numeroUnicoCnj.trim().replace(/\D/g, ''));

            if(processoJudicial){
              ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA m-";
              /* const verificarLitispedencia = await litispedenciaNewDossieMaternidade.funcLitis(
                paginaDosprevFormatada
              );
              if (verificarLitispedencia) {
                ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA r-";
              } */

            }


          }


      
    
        
    
    
  
    
        return ArrayImpedimentos + " *MATERNIDADE* ";
      }







      async impeditivosRural(paginaDosprevFormatada: any,
        parginaDosPrev: any
      ){
        let ArrayImpedimentos: string = '';



        try {

          const dataSubtrair = 16;
          const DatasAtualEMenosDezesseis: Array<Date> =
            await datasRequerimentoNewDossie.dataRequerimento(paginaDosprevFormatada, dataSubtrair)
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
          
            const processoJudicial = await buscarTabelaRelacaoDeProcessos(paginaDosprevFormatada, numeroUnicoCnj.trim().replace(/\D/g, ''));
           
            if(processoJudicial){
              
              ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA r-"
            }
            
          }





          return ArrayImpedimentos + " *RURAL* "

      }





      




      async impeditivosLoas(paginaDosprevFormatada: any,
        parginaDosPrev: any){
          let ArrayImpedimentos: string = ''; 


          
          try{
            
            const restabelecimentoRequerimentos = await restabelecimentoRequerimentosSuperDossie.handle(paginaDosprevFormatada)
            console.log('RESTAB SUPER: ' + restabelecimentoRequerimentos)
  
            if (restabelecimentoRequerimentos instanceof Error) {
              ArrayImpedimentos = ArrayImpedimentos + " erro estabelecimento -"
            } else if (restabelecimentoRequerimentos.valorBooleano) {
              console.log("IMPEDITIVO: " + restabelecimentoRequerimentos.impeditivo)
              ArrayImpedimentos = ArrayImpedimentos + restabelecimentoRequerimentos.impeditivo
            }

  
  
  
            const loasLitispendencia = await loasLitispendenciaSuperDossie.handle(paginaDosprevFormatada);
  
  
            if(loasLitispendencia instanceof Error){
              ArrayImpedimentos = ArrayImpedimentos + " erro estabelecimento -"
              }else if(loasLitispendencia){
                ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA l-"
              }
  
  
  
  
            /*  
            const loasEmprego = await loasEmpregoSuperDossie.execute(paginaDosprevFormatada)
            console.log('----LOAS EMPREGO: ')
            console.log(loasEmprego)
  
  
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
            */  




            const loasAtivo = await loasAtivoSuperDossie.handle(paginaDosprevFormatada)
            console.log('----TA ATIVO: ')
            console.log(loasAtivo)

            if (typeof(loasAtivo) == "object") {
              if (loasAtivo.valorBooleano) {
                ArrayImpedimentos = ArrayImpedimentos + loasAtivo.impeditivo
              }
            }



            const loasIdade = await loasIdadeSuperDossie.handle(paginaDosprevFormatada)
            console.log("MAIOR QUE 65 ANOS? " + loasIdade)

            if (!loasIdade) {
              ArrayImpedimentos += " IDADE -"
            }


  
  
  
  
            return ArrayImpedimentos + " *LOAS* ";

          }catch(e){
            console.log(e)
            return "Erro ao ler LOAS"
          }






      }

}