import { calcularIdade } from "./DosprevBusiness/GetInformationIdade";
import { litispendencia } from "./DosprevBusiness/GetInformationLitispendencia";
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
    AgeDossie: boolean
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
    
    if (!AgeDossie) {
      const verificarIdade: Array<boolean> = await calcularIdade.calcIdade(
        paginaDosprevFormatada
      );
      console.log("verificarIdade.length: ",verificarIdade.length)
      if (verificarIdade.length == 0) {
        ArrayImpedimentos = ArrayImpedimentos + " IDADE INDEFINIDA -";
      } else if (!verificarIdade[0] && verificarIdade.length != 0) {
        ArrayImpedimentos = ArrayImpedimentos + " IDADE -";
      }
    }

    const verificarLitispedencia = await litispendencia.funcLitis(
      paginaDosprevFormatada
    );
    //console.log("litispendencia se false: ", verificarLitispedencia)
    if (!verificarLitispedencia) {
      ArrayImpedimentos = ArrayImpedimentos + " LITISPENDÊNCIA -";
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
