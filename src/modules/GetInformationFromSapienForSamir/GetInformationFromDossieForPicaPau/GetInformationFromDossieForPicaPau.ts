import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { loasEmpregoDossie, loasLitispendencia, restabelecimentoRequerimentosDossie, loasAtivoDossie, loasIdadeDossie } from "../loas/Business";
import { LoasIdadeDossie } from "../loas/Business/Dossie/LoasIdadeDossie";
import { calcularIdade } from "./DosprevBusiness/GetInformationIdade";
import { litispedenciaRural, litispendenciaMaternidade } from "./DosprevBusiness/GetInformationLitispendencia";
import { seguradoEspecial } from "./DosprevBusiness/GetInformationSeguradoEspecial";
import {
  requerimentos,
  requerimentosAtivos,
} from "./DosprevBusiness/InformatioRequerimento";
import { dataPrevidencias } from "./DosprevBusiness/InformationPrevidenciarias";
import { buscarTabelaRelacaoDeProcessosNormalDossie } from "./Help/BuscarTabelaRelacaoDeProcessosNormalDossie";

export class GetInformationDossieForPicaPau {
  async impedimentosMaternidade(
    paginaDosprevFormatada: any,
    parginaDosPrev: any
    ): Promise<string> {
    let ArrayImpedimentos: string = '';

    
      console.log('-> CAPDEVILA MATERNIDADE')
 

    try {

      const dataSubtrair = 5;
      const DatasAtualEMenocinco: Array<Date> =
        await requerimentos.dataRequerimento(paginaDosprevFormatada, dataSubtrair); 
      //console.log("data atual menos dezesseis: ", DatasAtualEMenosDezesseis)
      //console.log("Data Requerimento: " + DatasAtualEMenosDezesseis.length);
      if (DatasAtualEMenocinco[0] == null) {
        ArrayImpedimentos = ArrayImpedimentos + " AUSÊNCIA DE REQUERIMENTO AUTOR -";
      } else {
        const verificarDataFinal: boolean =
          await dataPrevidencias.Previdenciarias(
            DatasAtualEMenocinco[0],
            DatasAtualEMenocinco[1],
            paginaDosprevFormatada
          );
          
        if (verificarDataFinal) {
          //console.log('emprego?')
          ArrayImpedimentos = ArrayImpedimentos + " EMPREGO -";
        }
      }
    } catch {
      ArrayImpedimentos = ArrayImpedimentos + " VÍNCULO ABERTO -";
    }













    const segurado = await seguradoEspecial.handle(parginaDosPrev);
    const requerimentoAtivo: boolean = await requerimentosAtivos.handle(
      paginaDosprevFormatada
    );

    if (segurado !== -1 || requerimentoAtivo == true) {
      ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
    }





      const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[2]/table/tbody/tr[2]/td"

      const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);

      if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){



        const xpathNumeroUnicoCnj = "/html/body/div/div[1]/table/tbody/tr[1]/td[1]";

        const numeroUnicoCnj = getXPathText(paginaDosprevFormatada, xpathNumeroUnicoCnj);

        const processoJudicial = await buscarTabelaRelacaoDeProcessosNormalDossie(paginaDosprevFormatada, numeroUnicoCnj.trim().replace(/\D/g, ''));

        if(processoJudicial){
          ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA M -"
        }
       /*  const verificarLitispedencia = await litispendenciaMaternidade.funcLitis(
          paginaDosprevFormatada
        );
        
        if (verificarLitispedencia) {
          ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA M -";
        } */
      }


      
    



    return ArrayImpedimentos + " *MATERNIDADE* ";
  }









  async impeditivosRural(
    paginaDosprevFormatada: any,
    parginaDosPrev: any):Promise<string> {

    let ArrayImpedimentos: string = '';

    console.log('-> CAPDEVILA RURAL')

    try {

      const dataSubtrair = 16;
      const DatasAtualEMenosDezesseis: Array<Date> =
        await requerimentos.dataRequerimento(paginaDosprevFormatada, dataSubtrair); 
      //console.log("data atual menos dezesseis: ", DatasAtualEMenosDezesseis)
      //console.log("Data Requerimento: " + DatasAtualEMenosDezesseis.length);
      if (DatasAtualEMenosDezesseis[0] == null) {
        ArrayImpedimentos = ArrayImpedimentos + " AUSÊNCIA DE REQUERIMENTO AUTOR -";
      } else {
        const verificarDataFinal: boolean =
          await dataPrevidencias.Previdenciarias(
            DatasAtualEMenosDezesseis[0],
            DatasAtualEMenosDezesseis[1],
            paginaDosprevFormatada
          );
          
        if (verificarDataFinal) {
          //console.log('emprego?')
          ArrayImpedimentos = ArrayImpedimentos + " EMPREGO -";
        }
      }
    } catch {
      ArrayImpedimentos = ArrayImpedimentos + " VÍNCULO ABERTO -";
    }




    const segurado = await seguradoEspecial.handle(parginaDosPrev);
    const requerimentoAtivo: boolean = await requerimentosAtivos.handle(
      paginaDosprevFormatada
    );

    if (segurado !== -1 || requerimentoAtivo == true) {
      ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
    }




    const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[2]/table/tbody/tr[2]/td"

      const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);

      if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){


        const xpathNumeroUnicoCnj = "/html/body/div/div[1]/table/tbody/tr[1]/td[1]";

        const numeroUnicoCnj = getXPathText(paginaDosprevFormatada, xpathNumeroUnicoCnj);



        const processoJudicial = await buscarTabelaRelacaoDeProcessosNormalDossie(paginaDosprevFormatada, numeroUnicoCnj.trim().replace(/\D/g, ''));
        
        if (processoJudicial) {
          ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA R-";
        }
      }










    return ArrayImpedimentos + " *RURAL* "
  }





  async impeditivoLoas(paginaDosprevFormatada: any){
    let impeditivos = "";

    console.log('-> CAPDEVILA LOAS')

    try{


      const restabelecimentoRequerimento = await restabelecimentoRequerimentosDossie.handle(paginaDosprevFormatada)



      if(restabelecimentoRequerimento instanceof Error){
        impeditivos = impeditivos + " erro estabelecimento -"
      }else if(restabelecimentoRequerimento.valorBooleano){
        impeditivos = impeditivos + restabelecimentoRequerimento.impeditivo
      }


      const litispendenciaLoas =  await loasLitispendencia.handle(paginaDosprevFormatada);


      if(litispendenciaLoas instanceof Error){
        impeditivos = impeditivos + " erro estabelecimento -"
      }else if(litispendenciaLoas){
        impeditivos = impeditivos + " LITISPENDÊNCIA -"
      }



      /*
      const loasEmprego: any = await loasEmpregoDossie.execute(paginaDosprevFormatada)
        if(typeof(loasEmprego) == "boolean"){
          if(loasEmprego){
              impeditivos = impeditivos + " LOAS EMPREGO -"
          }
        }else if(typeof(loasEmprego) == "object"){
          if(loasEmprego.valorBooleano){
              impeditivos = impeditivos + loasEmprego.message
          }else{
              impeditivos = impeditivos + loasEmprego.message
          }
      }
      */




      const loasAtivo = await loasAtivoDossie.handle(paginaDosprevFormatada)

      if (typeof (loasAtivo) == "object") {
        if (loasAtivo.valorBooleano) {
          impeditivos = impeditivos + loasAtivo.impeditivo
        }
      }


      const loasIdade = await loasIdadeDossie.handle(paginaDosprevFormatada)

      if (!loasIdade) {
        impeditivos += " IDADE -"
      }


      return impeditivos + " *LOAS* "
      
    } catch(e) {

      console.log(e)
      return "Erro ao ler LOAS"
    }
    
  }
}




