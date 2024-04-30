import { getXPathText } from "../../../helps/GetTextoPorXPATH";
import { calcularIdade } from "./DosprevBusiness/GetInformationIdade";
import { litispedenciaRural, litispendenciaMaternidade } from "./DosprevBusiness/GetInformationLitispendencia";
import { seguradoEspecial } from "./DosprevBusiness/GetInformationSeguradoEspecial";
import {
  requerimentos,
  requerimentosAtivos,
} from "./DosprevBusiness/InformatioRequerimento";
import { dataPrevidencias } from "./DosprevBusiness/InformationPrevidenciarias";

export class GetInformationDossieForPicaPau {
  async impedimentos(
    paginaDosprevFormatada: any,
    parginaDosPrev: any,
    AgeDossie: boolean,
    loas: any
  ): Promise<string> {
    let ArrayImpedimentos: string = '';

    try {
      const DatasAtualEMenosDezesseis: Array<Date> =
        await requerimentos.dataRequerimento(paginaDosprevFormatada); 
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
    


    if (!AgeDossie && !loas) {
      const verificarIdade: Array<boolean> = await calcularIdade.calcIdade(
        paginaDosprevFormatada
      );
     
      if (verificarIdade.length == 0) {
        ArrayImpedimentos = ArrayImpedimentos + " IDADE INDEFINIDA -";
      } else if (!verificarIdade[0] && verificarIdade.length != 0) {
        ArrayImpedimentos = ArrayImpedimentos + " IDADE -";
      }


      //so vau fazer a litispendencia caso a string "Não há relação dos processos movidos pelo autor contra o INSS." nao exista

      const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[2]/table/tbody/tr[2]/td"

      const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);

      if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){

        const verificarLitispedencia = await litispedenciaRural.funcLitis(
          paginaDosprevFormatada
        );
        
        if (verificarLitispedencia) {
          ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA R-";
        }
      }



    }else if(AgeDossie && !loas){


      const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[2]/table/tbody/tr[2]/td"

      const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);

      if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){

        const verificarLitispedencia = await litispendenciaMaternidade.funcLitis(
          paginaDosprevFormatada
        );
        
        if (verificarLitispedencia) {
          ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA M -";
        }
      }


      
      //caso precise tirar o idade do loas, basta tirar esse (else if) aqui de baixo
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
    const requerimentoAtivo: boolean = await requerimentosAtivos.handle(
      paginaDosprevFormatada
    );

    if (segurado !== -1 || requerimentoAtivo == true) {
      ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
    }

    return ArrayImpedimentos;
  }
}
