import { JSDOMType } from "../../../shared/dtos/JSDOM";
import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { IDossieExtracted } from "../BuscarImpedimentos/dtos/interfaces/IDossieExtracted";
import { IDossieExtractedPartial } from "../BuscarImpedimentos/dtos/interfaces/IDossieExtractedPartial";
import { EmpregoDP, IImpeditivoLitispendencia, IObjInfoImpeditivosLoas, IObjInfoImpeditivosMaternidade, IReturnImpedimentosLOAS, IReturnImpedimentosMaternidade } from "../dto";
import { IObjInfoImpeditivosRural } from "../dto/RuralMaternidade/interfaces/IObjInfoImpeditivosRural";
import { IReturnImpedimentosRural } from "../dto/RuralMaternidade/interfaces/IReturnImpedimentosRural";
import { buscarTabelaRelacaoDeProcessos } from "./Help/BuscarTabelaRelacaoDeProcessos";
import { calcularIdadeNewDossie } from "./SuperDossieBusiness/CalcularIdade";
import { dataPrevidenciariasNewDossie } from "./SuperDossieBusiness/GetInformationPrevidenciariasNewDossie";
import { datasRequerimentoNewDossie } from "./SuperDossieBusiness/GetInformationRequerimento";
import { hasEmprego } from "./SuperDossieBusiness/utils/hasEmprego";
import { hasIdadeLoas } from "./SuperDossieBusiness/utils/hasIdadeLoas";
import { hasImpeditivoDossie } from "./SuperDossieBusiness/utils/hasImpeditivoDossie";
import { hasImpeditivoDossieLoas } from "./SuperDossieBusiness/utils/hasImpeditivoDossieLoas";
import { hasLitispendencia } from "./SuperDossieBusiness/utils/hasLitispendencia";
import { hasLitispendenciaLoas } from "./SuperDossieBusiness/utils/hasLitispendenciaLoas";

export class GetInformationDossieSuperForPicapau {
  async maternidade(
    dossie: IDossieExtracted
  ): Promise<IReturnImpedimentosMaternidade> {
    let arrayImpedimentos: string = '';
    const objInfoImpeditivos: IObjInfoImpeditivosMaternidade = {} as IObjInfoImpeditivosMaternidade;

    const impeditivosLitispendencia = hasLitispendencia(
      dossie.fichaSintetica.numeroUnico, 
      dossie.processosMovidos
    );
    if (impeditivosLitispendencia.haveLitispendencia) {
      objInfoImpeditivos.litispendencia = impeditivosLitispendencia.litispendencia;
      arrayImpedimentos += " LITISPENDÊNCIA -";
    }

    const impeditivoDossie = hasImpeditivoDossie(
      dossie.fichaSintetica.dataAjuizamento,
      dossie.requerimentos,
      dossie.competenciasDetalhadas
    );
    if (impeditivoDossie.haveImpeditivo) {
      switch (impeditivoDossie.tipoImpeditivo) {
        case 3:
          arrayImpedimentos += impeditivoDossie.nomeImpeditivo;
          objInfoImpeditivos.requerimento = "AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO";
          break;
        case 4:
          arrayImpedimentos += impeditivoDossie.nomeImpeditivo;
          objInfoImpeditivos.beneficioAtivo = impeditivoDossie.informacaoExtra;
          break;
        case 5:
          arrayImpedimentos += impeditivoDossie.nomeImpeditivo;
          objInfoImpeditivos.concessaoAnterior = impeditivoDossie.informacaoExtra;
          break;
        case 6:
          arrayImpedimentos += impeditivoDossie.nomeImpeditivo;
          objInfoImpeditivos.beneficioIncompativel = impeditivoDossie.informacaoExtra;
          break;
        default:
          break;
      }
    }

    const impeditivoEmprego = hasEmprego(
      dossie.fichaSintetica.dataAjuizamento, 
      dossie.relacoesPrevidenciarias
    );
    if (impeditivoEmprego.haveImpeditivo) {
      if (impeditivoEmprego.isVinculoAberto) {
        arrayImpedimentos += " VÍNCULO ABERTO -";
      } else {
        arrayImpedimentos += " EMPREGO -";
        objInfoImpeditivos.emprego = impeditivoEmprego.empregos;
      }
    }

    console.log('---OBJETO DE IMPEDIMENTOS MATERNIDADE');
    console.log(objInfoImpeditivos);

    arrayImpedimentos += " *MATERNIDADE* ";
    
    return {
      arrayDeImpedimentos: arrayImpedimentos,
      objImpedimentosRM: objInfoImpeditivos
    }
  }

  async impeditivosRural(paginaDosprevFormatada: JSDOMType): Promise<IReturnImpedimentosRural> {
        let ArrayImpedimentos: string = '';

        const objInfoImpeditivos: IObjInfoImpeditivosRural = {} as IObjInfoImpeditivosRural;

        const idade = await calcularIdadeNewDossie.calcIdade(paginaDosprevFormatada);
        if (idade.idadeImpeditivo) {
          ArrayImpedimentos += " IDADE -";
          objInfoImpeditivos.idade = idade.idadeAutor;
        }

        try {

          const dataSubtrair = 16;
          const DatasAtualEMenosDezesseis: Array<Date> =
            await datasRequerimentoNewDossie.dataRequerimento(paginaDosprevFormatada, dataSubtrair)
          if (!DatasAtualEMenosDezesseis[0]) {
            ArrayImpedimentos = ArrayImpedimentos + " AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO -";
            objInfoImpeditivos.requerimento = "AUSÊNCIA DE REQUERIMENTO NO DOSSIÊ"
          } else {

            const verificarDataFinal: EmpregoDP[] =
              await dataPrevidenciariasNewDossie.Previdenciarias(
                DatasAtualEMenosDezesseis[0],
                DatasAtualEMenosDezesseis[1],
                paginaDosprevFormatada
              );
            if (verificarDataFinal.length !== 0) {
              objInfoImpeditivos.emprego = verificarDataFinal;
              ArrayImpedimentos = ArrayImpedimentos + " EMPREGO -";
            }
          }
        } catch (error) {
          console.error(error.message)
          ArrayImpedimentos = ArrayImpedimentos + " VÍNCULO ABERTO -";
        }


        const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[5]/table/tbody/tr/td"

        const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);


          if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){


            const xpathNumeroUnicoCnj = "/html/body/div/div[4]/table/tbody/tr[1]/td";
            const numeroUnicoCnj = getXPathText(paginaDosprevFormatada, xpathNumeroUnicoCnj);
          
            const processoJudicial: IImpeditivoLitispendencia = await buscarTabelaRelacaoDeProcessos(paginaDosprevFormatada, numeroUnicoCnj.trim().replace(/\D/g, ''));
           
            if(processoJudicial.haveLitispendencia){
              objInfoImpeditivos.litispendencia = processoJudicial.litispendencia;
              ArrayImpedimentos = ArrayImpedimentos + " LITISPENDÊNCIA -";
            }
            
          }


          console.log('---OBJETO DE IMPEDIMENTOS RURAL SUPER')
          console.log(objInfoImpeditivos);

          ArrayImpedimentos = ArrayImpedimentos + " *RURAL* ";

          return {
            arrayDeImpedimentos: ArrayImpedimentos,
            objImpedimentosRM: objInfoImpeditivos
          }

  }

  async loas(
    dossie: IDossieExtractedPartial
  ): Promise<IReturnImpedimentosLOAS> {
    let arrayImpedimentos: string = ''; 
    const objInfoImpeditivos: IObjInfoImpeditivosLoas = {} as IObjInfoImpeditivosLoas;

    console.log(dossie);

    const impeditivosLitispendencia = hasLitispendenciaLoas(
      dossie.fichaSintetica.numeroUnico,
      dossie.processosMovidos,
      dossie.requerimentos
    );
    if (impeditivosLitispendencia.haveLitispendencia) {
      objInfoImpeditivos.litispendencia = impeditivosLitispendencia.litispendencia;
      arrayImpedimentos += " LITISPENDÊNCIA -";
    }

    const impeditivoDossie = hasImpeditivoDossieLoas(
      dossie.fichaSintetica.dataAjuizamento,
      dossie.requerimentos
    );
    if (impeditivoDossie.haveImpeditivo) {
      switch (impeditivoDossie.tipoImpeditivo) {
        case 3:
          arrayImpedimentos += impeditivoDossie.nomeImpeditivo;
          objInfoImpeditivos.requerimento = "AUSÊNCIA DE REQUERIMENTO ADMINISTRATIVO";
          break;
        case 4:
          arrayImpedimentos += impeditivoDossie.nomeImpeditivo;
          objInfoImpeditivos.bpc = impeditivoDossie.informacaoExtra[0];
          break;
        case 5:
          arrayImpedimentos += impeditivoDossie.nomeImpeditivo;
          objInfoImpeditivos.beneficio = impeditivoDossie.informacaoExtra[0];
          break;
        default:
          break;
      }

      if (impeditivoDossie.tipoImpeditivo !== 3 && 
          impeditivoDossie.tipoImpeditivo !== 4 && 
          impeditivoDossie.tipoImpeditivo !== 5
      ) {
        const impeditivoIdadeLoas = hasIdadeLoas(
          dossie.fichaSintetica.dataNascimento,
          dossie.requerimentos
        );
        if (impeditivoIdadeLoas.idadeImpeditivo) {
          objInfoImpeditivos.idade = impeditivoIdadeLoas.idadeAutor;
          arrayImpedimentos += " IDADE -"
        }
      }
    }
    
    console.log("---OBJETO IMPEDITIVOS LOAS");
    console.log(objInfoImpeditivos);
    
    arrayImpedimentos += " *LOAS* ";

    return {
      arrayDeImpedimentos: arrayImpedimentos,
      objImpedimentosLoas: objInfoImpeditivos
    }
  }
}
