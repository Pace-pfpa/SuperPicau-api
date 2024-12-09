import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { EmpregoDP, 
         IImpeditivoLitispendencia,
         IImpeditivoRequerimentoAtivo,
         IObjInfoImpeditivosLoas, 
         IObjInfoImpeditivosRM, 
         IReturnImpedimentosLOAS, 
         IReturnImpedimentosRM } from "../dto";
import { loasLitispendencia, restabelecimentoRequerimentosDossie, loasAtivoDossie, loasIdadeDossie } from "../loas/Business";
import { seguradoEspecial } from "./DosprevBusiness/GetInformationSeguradoEspecial";
import {
  requerimentos,
  requerimentosAtivos,
} from "./DosprevBusiness/InformatioRequerimento";
import { dataPrevidencias } from "./DosprevBusiness/InformationPrevidenciarias";
import { buscarTabelaRelacaoDeProcessosNormalDossie } from "./Help/BuscarTabelaRelacaoDeProcessosNormalDossie";

export class GetInformationDossieForPicaPau {
  async impedimentosMaternidade(
    paginaDosprevFormatada: JSDOMType,
    parginaDosPrev: string
    ): Promise<IReturnImpedimentosRM> {
    let ArrayImpedimentos: string = '';

    
    const objInfoImpeditivos: IObjInfoImpeditivosRM = {} as IObjInfoImpeditivosRM;
 

    try {

      const dataSubtrair = 5;
      const DatasAtualEMenocinco: Array<Date> =
        await requerimentos.dataRequerimento(paginaDosprevFormatada, dataSubtrair); 
      if (DatasAtualEMenocinco[0] == null) {
        objInfoImpeditivos.requerimento = "AUSÊNCIA DE REQUERIMENTO NO DOSSIÊ";
        ArrayImpedimentos = ArrayImpedimentos + " AUSÊNCIA DE REQUERIMENTO AUTOR -";
      } else {
        const verificarDataFinal: EmpregoDP[] =
          await dataPrevidencias.Previdenciarias(
            DatasAtualEMenocinco[0],
            DatasAtualEMenocinco[1],
            paginaDosprevFormatada
          );
          
        if (verificarDataFinal.length !== 0) {
          objInfoImpeditivos.emprego = verificarDataFinal;
          ArrayImpedimentos = ArrayImpedimentos + " EMPREGO -";
        }
      }
    } catch {
      ArrayImpedimentos = ArrayImpedimentos + " VÍNCULO ABERTO -";
    }













    const segurado = await seguradoEspecial.handle(parginaDosPrev);
    const requerimentoAtivo: IImpeditivoRequerimentoAtivo = await requerimentosAtivos.handle(
      paginaDosprevFormatada
    );

    if (segurado !== -1) {
      objInfoImpeditivos.concessaoAnterior = 'SEGURADO ESPECIAL ENCONTRADO';
      ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
    } else if (requerimentoAtivo.haveRequerimentoAtivo === true) {
      objInfoImpeditivos.concessaoAnterior = requerimentoAtivo.requerimentoAtivo;
      ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
    }





      const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[2]/table/tbody/tr[2]/td"

      const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);

      if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){



        const xpathNumeroUnicoCnj = "/html/body/div/div[1]/table/tbody/tr[1]/td[1]";

        const numeroUnicoCnj = getXPathText(paginaDosprevFormatada, xpathNumeroUnicoCnj);

        const processoJudicial: IImpeditivoLitispendencia = await buscarTabelaRelacaoDeProcessosNormalDossie(paginaDosprevFormatada, numeroUnicoCnj.trim().replace(/\D/g, ''));

        if(processoJudicial.haveLitispendencia) {
          objInfoImpeditivos.litispendencia = processoJudicial.litispendencia;
          ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA M -"
        }
      }


      console.log('---OBJETO IMPEDITIVOS MATERNIDADE NORMAL')
      console.log(objInfoImpeditivos)
    



      ArrayImpedimentos = ArrayImpedimentos + " *MATERNIDADE* ";
      return {
        arrayDeImpedimentos: ArrayImpedimentos,
        objImpedimentosRM: objInfoImpeditivos
      }

  }









  async impeditivosRural(
    paginaDosprevFormatada: JSDOMType,
    parginaDosPrev: string):Promise<IReturnImpedimentosRM> {

    let ArrayImpedimentos: string = '';

    const objInfoImpeditivos: IObjInfoImpeditivosRM = {} as IObjInfoImpeditivosRM;

    try {

      const dataSubtrair = 16;
      const DatasAtualEMenosDezesseis: Array<Date> =
        await requerimentos.dataRequerimento(paginaDosprevFormatada, dataSubtrair); 
      if (DatasAtualEMenosDezesseis[0] == null) {
        objInfoImpeditivos.requerimento = "AUSÊNCIA DE REQUERIMENTO NO DOSSIÊ"
        ArrayImpedimentos = ArrayImpedimentos + " AUSÊNCIA DE REQUERIMENTO AUTOR -";
      } else {
        const verificarDataFinal: EmpregoDP[] =
          await dataPrevidencias.Previdenciarias(
            DatasAtualEMenosDezesseis[0],
            DatasAtualEMenosDezesseis[1],
            paginaDosprevFormatada
          );
          
        if (verificarDataFinal.length !== 0) {
          objInfoImpeditivos.emprego = verificarDataFinal;
          ArrayImpedimentos = ArrayImpedimentos + " EMPREGO -";
        }
      }
    } catch {
      ArrayImpedimentos = ArrayImpedimentos + " VÍNCULO ABERTO -";
    }




    const segurado = await seguradoEspecial.handle(parginaDosPrev);
    const requerimentoAtivo: IImpeditivoRequerimentoAtivo = await requerimentosAtivos.handle(
      paginaDosprevFormatada
    );

    if (segurado !== -1) {
      objInfoImpeditivos.concessaoAnterior = 'SEGURADO ESPECIAL ENCONTRADO';
      ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
    } else if (requerimentoAtivo.haveRequerimentoAtivo === true) {
      objInfoImpeditivos.concessaoAnterior = requerimentoAtivo.requerimentoAtivo;
      ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR (Requerimento Ativo) -";
    }




    const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[2]/table/tbody/tr[2]/td"

      const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);

      if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){


        const xpathNumeroUnicoCnj = "/html/body/div/div[1]/table/tbody/tr[1]/td[1]";

        const numeroUnicoCnj = getXPathText(paginaDosprevFormatada, xpathNumeroUnicoCnj);



        const processoJudicial: IImpeditivoLitispendencia = await buscarTabelaRelacaoDeProcessosNormalDossie(paginaDosprevFormatada, numeroUnicoCnj.trim().replace(/\D/g, ''));
        
        if (processoJudicial.haveLitispendencia) {
          objInfoImpeditivos.litispendencia = processoJudicial.litispendencia;
          ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA R-";
        }
      }





      console.log('---OBJETO IMPEDITIVOS RURAL NORMAL')
      console.log(objInfoImpeditivos)


      ArrayImpedimentos = ArrayImpedimentos + " *RURAL* ";

      return {
        arrayDeImpedimentos: ArrayImpedimentos,
        objImpedimentosRM: objInfoImpeditivos
      }
  }





  async impeditivoLoas(paginaDosprevFormatada: any): Promise<IReturnImpedimentosLOAS>{
    let impeditivos = "";
    const objInfoImpeditivos: IObjInfoImpeditivosLoas = {} as IObjInfoImpeditivosLoas;

    try{


      const restabelecimentoRequerimento = await restabelecimentoRequerimentosDossie.handle(paginaDosprevFormatada)



      if(restabelecimentoRequerimento instanceof Error){
        impeditivos = impeditivos + " erro estabelecimento -"
      }else if(restabelecimentoRequerimento.valorBooleano){
        objInfoImpeditivos.requerimento = "IMPEDITIVO SOBRE REQUERIMENTO ENCONTRADO"
        impeditivos = impeditivos + restabelecimentoRequerimento.impeditivo
      }


      const litispendenciaLoas =  await loasLitispendencia.handle(paginaDosprevFormatada);


      if(litispendenciaLoas instanceof Error){
        impeditivos = impeditivos + " erro estabelecimento -"
      }else if(litispendenciaLoas){
        objInfoImpeditivos.litispendencia = "LITISPENDÊNCIA ENCONTRADA"
        impeditivos = impeditivos + " LITISPENDÊNCIA -"
      }


      const loasAtivo = await loasAtivoDossie.handle(paginaDosprevFormatada)

      if (typeof (loasAtivo) == "object") {
        if (loasAtivo.valorBooleano) {
          objInfoImpeditivos.bpc = "BENEFÍCIO ATIVO ENCONTRADO";
          impeditivos = impeditivos + loasAtivo.impeditivo
        }
      }


      const loasIdade = await loasIdadeDossie.handle(paginaDosprevFormatada)

      if (!loasIdade) {
        objInfoImpeditivos.idade = "IDADE INFERIOR"
        impeditivos += " IDADE -"
      }

      impeditivos += " *LOAS* "

      return {
        arrayDeImpedimentos: impeditivos,
        objImpedimentosLoas: objInfoImpeditivos
      }
      
    } catch(e) {
      console.error(e)
    }
    
  }
}




