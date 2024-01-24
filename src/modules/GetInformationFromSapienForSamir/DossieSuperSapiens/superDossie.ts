import { calcularIdade } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/GetInformationIdade";
import { litispendencia } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/GetInformationLitispendencia";
import { seguradoEspecial } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/GetInformationSeguradoEspecial";
import { requerimentos, requerimentosAtivos } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/InformatioRequerimento";
import { dataPrevidencias } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/InformationPrevidenciarias";
import { calcularIdadeNewDossie } from "./SuperDossieBusiness/CalcularIdade";
import { litispedenciaNewDossie } from "./SuperDossieBusiness/GetInformationLitispedencia";
import { dataPrevidenciariasNewDossie } from "./SuperDossieBusiness/GetInformationPrevidenciariasNewDossie";
import { datasRequerimentoAtivoNewDossie, datasRequerimentoNewDossie } from "./SuperDossieBusiness/GetInformationRequerimento";


export class SuperDossie {
    async impedimentos(
        paginaDosprevFormatada: any,
        parginaDosPrev: any,
        AgeDossie: boolean
      ): Promise<Array<string>> {
        const ArrayImpedimentos: Array<string> = [];
    
        try {
          const DatasAtualEMenosDezesseis: Array<Date> =
            await datasRequerimentoNewDossie.dataRequerimento(paginaDosprevFormatada)
          //console.log("Data Requerimento: " + DatasAtualEMenosDezesseis.length);
          if (DatasAtualEMenosDezesseis[0] == null) {
            ArrayImpedimentos.push("AUSÊNCIA DE REQUERIMENTO AUTOR");
          } else {
            const verificarDataFinal: boolean =
              await dataPrevidenciariasNewDossie.Previdenciarias(
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
        
        if (!AgeDossie) {
          const verificarIdade: Array<boolean> = await calcularIdadeNewDossie.calcIdade(
            paginaDosprevFormatada
          );
          if (verificarIdade.length == 0) {
            ArrayImpedimentos.push("IDADE INDEFINIDA");
          } else if (!verificarIdade[0] && verificarIdade.length != 0) {
            ArrayImpedimentos.push("IDADE");
          }
        }
    
        const verificarLitispedencia = await litispedenciaNewDossie.funcLitis(
          paginaDosprevFormatada
        );
        if (!verificarLitispedencia) {
          ArrayImpedimentos.push("LITISPENDÊNCIA");
        }
    
        const segurado = await seguradoEspecial.handle(parginaDosPrev);
        const requerimentoAtivo: boolean = await datasRequerimentoAtivoNewDossie.handle(
          paginaDosprevFormatada
        );
    
        if (segurado !== -1 || requerimentoAtivo == true) {
          ArrayImpedimentos.push("CONCESSÃO ANTERIOR -");
        }
    
        return ArrayImpedimentos;
      }

}