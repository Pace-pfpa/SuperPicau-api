import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { EmpregoDP, 
         IImpeditivoLitispendencia,
         IObjInfoImpeditivosLoas, 
         IReturnImpedimentosLOAS, 
        } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { IReturnImpedimentosRural } from "../dto/RuralMaternidade/interfaces/IReturnImpedimentosRural";
import { loasLitispendencia, restabelecimentoRequerimentosDossie, loasAtivoDossie, loasIdadeDossie } from "../loas/Business";
import { calcularIdade } from "./DosprevBusiness/GetInformationIdade";
import { requerimentos } from "./DosprevBusiness/InformatioRequerimento";
import { dataPrevidencias } from "./DosprevBusiness/InformationPrevidenciarias";
import { buscarTabelaRelacaoDeProcessosNormalDossie } from "./Help/BuscarTabelaRelacaoDeProcessosNormalDossie";

export class GetInformationDossieForPicaPau {
  async impeditivosRural(paginaDosprevFormatada: JSDOMType):Promise<IReturnImpedimentosRural> {

    let ArrayImpedimentos: string = '';

    const objInfoImpeditivos: IObjInfoImpeditivosRural = {} as IObjInfoImpeditivosRural;

    const idade = await calcularIdade.calcIdade(paginaDosprevFormatada);
    if (idade.idadeImpeditivo) {
      ArrayImpedimentos += " IDADE -";
      objInfoImpeditivos.idade = idade.idadeAutor;
    }

    try {

      const dataSubtrair = 16;
      const DatasAtualEMenosDezesseis: Array<Date> =
        await requerimentos.dataRequerimento(paginaDosprevFormatada, dataSubtrair); 
      if (DatasAtualEMenosDezesseis[0] == null) {
        objInfoImpeditivos.requerimento = "AUSÊNCIA DE REQUERIMENTO NO DOSSIÊ"
        ArrayImpedimentos = ArrayImpedimentos + " AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO -";
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



    const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[2]/table/tbody/tr[2]/td"

      const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);

      if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){


        const xpathNumeroUnicoCnj = "/html/body/div/div[1]/table/tbody/tr[1]/td[1]";

        const numeroUnicoCnj = getXPathText(paginaDosprevFormatada, xpathNumeroUnicoCnj);



        const processoJudicial: IImpeditivoLitispendencia = await buscarTabelaRelacaoDeProcessosNormalDossie(paginaDosprevFormatada, numeroUnicoCnj.trim().replace(/\D/g, ''));
        
        if (processoJudicial.haveLitispendencia) {
          objInfoImpeditivos.litispendencia = processoJudicial.litispendencia;
          ArrayImpedimentos = ArrayImpedimentos + " LITISPENDÊNCIA -";
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

  async impeditivoLoas(paginaDosprevFormatada: JSDOMType): Promise<IReturnImpedimentosLOAS>{
    let impeditivos = "";
    const objInfoImpeditivos: IObjInfoImpeditivosLoas = {} as IObjInfoImpeditivosLoas;

    try{

      const restabelecimentoRequerimento = await restabelecimentoRequerimentosDossie.handle(paginaDosprevFormatada)

      if (restabelecimentoRequerimento instanceof Error) {
        impeditivos += " erro estabelecimento -"
      } else if(restabelecimentoRequerimento.valorBooleano) {
        objInfoImpeditivos.requerimento = restabelecimentoRequerimento.impeditivo;
        impeditivos += restabelecimentoRequerimento.impeditivo;
      } else if (!restabelecimentoRequerimento.valorBooleano && restabelecimentoRequerimento.impeditivo === " RESTABELECIENTO -") {
        impeditivos += restabelecimentoRequerimento.impeditivo;
      }

      const litispendenciaLoas =  await loasLitispendencia.handle(paginaDosprevFormatada);

      if (litispendenciaLoas instanceof Error) {
        impeditivos += " erro estabelecimento -"
      } else if(litispendenciaLoas.haveLitispendencia) {
        objInfoImpeditivos.litispendencia = litispendenciaLoas.litispendencia;
        impeditivos += " LITISPENDÊNCIA -"
      }

      const loasAtivo = await loasAtivoDossie.handle(paginaDosprevFormatada)

      if (loasAtivo.valorBooleano && loasAtivo.tipo === 1) {
        objInfoImpeditivos.bpc = loasAtivo.nomeImpeditivo;
        impeditivos += loasAtivo.impeditivo;
      } else if (loasAtivo.valorBooleano && loasAtivo.tipo === 2) {
        objInfoImpeditivos.beneficio = loasAtivo.nomeImpeditivo;
        impeditivos += loasAtivo.impeditivo;
      }

      const loasIdade = await loasIdadeDossie.handle(paginaDosprevFormatada)

      if (loasIdade.idadeImpeditivo) {
        objInfoImpeditivos.idade = loasIdade.idadeAutor;
        impeditivos += " IDADE -"
      }

      impeditivos += " *LOAS* "

      console.log("---OBJETO IMPEDITIVOS LOAS NORMAL");
      console.log(objInfoImpeditivos);

      return {
        arrayDeImpedimentos: impeditivos,
        objImpedimentosLoas: objInfoImpeditivos
      }
      
    } catch(e) {
      console.error(e)
    }
    
  }
}
