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
        
        if (!AgeDossie) {
          const verificarIdade: Array<boolean> = await calcularIdadeNewDossie.calcIdade(
            paginaDosprevFormatada
          );
          if (verificarIdade.length == 0) {
            ArrayImpedimentos = ArrayImpedimentos + " IDADE INDEFINIDA -";
          } else if (!verificarIdade[0] && verificarIdade.length != 0) {
            ArrayImpedimentos = ArrayImpedimentos + " IDADE -";
          }


          const verificarLitispedencia = await litispedenciaNewDossieRural.funcLitis(
            paginaDosprevFormatada
          );

          if (verificarLitispedencia) {
            ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA m -";
          }


        }else if(AgeDossie && !loas){

          const verificarLitispedencia = await litispedenciaNewDossieMaternidade.funcLitis(
            paginaDosprevFormatada
          );
          if (verificarLitispedencia) {
            ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA r-";
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