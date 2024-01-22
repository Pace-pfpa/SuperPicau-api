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
  ): Promise<Array<string>> {
    const ArrayImpedimentos: Array<string> = [];

    try {
      const DatasAtualEMenosDezesseis: Array<Date> =
        await requerimentos.dataRequerimento(paginaDosprevFormatada);
      //console.log("Data Requerimento: " + DatasAtualEMenosDezesseis.length);
      if (DatasAtualEMenosDezesseis[0] == null) {
        ArrayImpedimentos.push("AUSÊNCIA DE REQUERIMENTO AUTOR");
      } else {
        const verificarDataFinal: boolean =
          await dataPrevidencias.Previdenciarias(
            DatasAtualEMenosDezesseis[0],
            DatasAtualEMenosDezesseis[1],
            paginaDosprevFormatada
          );
        if (verificarDataFinal) {
          ArrayImpedimentos.push("EMPREGO");
        }
      }
    } catch {
      ArrayImpedimentos.push("VÍNCULO ABERTO");
    }
    console.log(AgeDossie)
    console.log(typeof(AgeDossie))
    if (AgeDossie) {
      const verificarIdade: Array<boolean> = await calcularIdade.calcIdade(
        paginaDosprevFormatada
      );
      if (verificarIdade.length == 0) {
        ArrayImpedimentos.push("IDADE INDEFINIDA");
      } else if (!verificarIdade[0] && verificarIdade.length != 0) {
        ArrayImpedimentos.push("IDADE");
      }
    }

    const verificarLitispedencia = await litispendencia.funcLitis(
      paginaDosprevFormatada
    );
    if (!verificarLitispedencia) {
      ArrayImpedimentos.push("LITISPENDÊNCIA");
    }

    const segurado = await seguradoEspecial.handle(parginaDosPrev);
    const requerimentoAtivo: boolean = await requerimentosAtivos.handle(
      paginaDosprevFormatada
    );

    if (segurado !== -1 || requerimentoAtivo == true) {
      ArrayImpedimentos.push("CONCESSÃO ANTERIOR -");
    }

    return ArrayImpedimentos;
  }
}
