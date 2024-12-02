import { getXPathText } from "../../../shared/utils/GetTextoPorXPATH";
import { EmpregoDP, IImpeditivoLitispendencia, IImpeditivoRequerimentoAtivo, IObjInfoImpeditivosLoas, IObjInfoImpeditivosRM, IReturnImpedimentosLOAS, IReturnImpedimentosRM } from "../dto";
import { seguradoEspecial } from "../GetInformationFromDossieForPicaPau/DosprevBusiness/GetInformationSeguradoEspecial";
import { loasLitispendenciaSuperDossie, restabelecimentoRequerimentosSuperDossie, loasAtivoSuperDossie, loasIdadeSuperDossie } from "../loas/Business";
import { buscarTabelaRelacaoDeProcessos } from "./Help/BuscarTabelaRelacaoDeProcessos";
import { dataPrevidenciariasNewDossie } from "./SuperDossieBusiness/GetInformationPrevidenciariasNewDossie";
import { datasRequerimentoAtivoNewDossie, datasRequerimentoNewDossie } from "./SuperDossieBusiness/GetInformationRequerimento";


export class SuperDossie {
    async impedimentosMaternidade(
        paginaDosprevFormatada: any,
        parginaDosPrev: any
      ): Promise<IReturnImpedimentosRM> {
        let ArrayImpedimentos: string = '';

        const objInfoImpeditivos: IObjInfoImpeditivosRM = {} as IObjInfoImpeditivosRM;

        try {

          const dataSubtrair = 5;
          const DatasAtualEMenosDezesseis: Array<Date> =
            await datasRequerimentoNewDossie.dataRequerimento(paginaDosprevFormatada, dataSubtrair)
          if (DatasAtualEMenosDezesseis[0] == null) {
            objInfoImpeditivos.requerimento = "AUSÊNCIA DE REQUERIMENTO NO DOSSIÊ"
            ArrayImpedimentos = ArrayImpedimentos + " AUSÊNCIA DE REQUERIMENTO AUTOR -";
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
        } catch {
          ArrayImpedimentos = ArrayImpedimentos + " VÍNCULO ABERTO -";
        }














        const segurado = await seguradoEspecial.handle(parginaDosPrev);
        const requerimentoAtivo: IImpeditivoRequerimentoAtivo = await datasRequerimentoAtivoNewDossie.handle(
          paginaDosprevFormatada
        );
    
        if (segurado !== -1) {
          objInfoImpeditivos.concessaoAnterior = 'SEGURADO ESPECIAL ENCONTRADO';
          ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
        } else if (requerimentoAtivo.haveRequerimentoAtivo === true) {
          objInfoImpeditivos.concessaoAnterior = requerimentoAtivo.requerimentoAtivo;
          ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
        }

          


    

          const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[5]/table/tbody/tr/td"

          const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);

          if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){


            const xpathNumeroUnicoCnj = "/html/body/div/div[4]/table/tbody/tr[1]/td";
            const numeroUnicoCnj = getXPathText(paginaDosprevFormatada, xpathNumeroUnicoCnj);

            const processoJudicial: IImpeditivoLitispendencia = await buscarTabelaRelacaoDeProcessos(paginaDosprevFormatada, numeroUnicoCnj.trim().replace(/\D/g, ''));

            if(processoJudicial.haveLitispendencia){
              objInfoImpeditivos.litispendencia = processoJudicial.litispendencia;
              ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA m-";
            }


          }

          console.log('---OBJETO DE IMPEDIMENTOS MATERNIDADE SUPER')
          console.log(objInfoImpeditivos);

          ArrayImpedimentos = ArrayImpedimentos + " *MATERNIDADE* ";

    
        return {
          arrayDeImpedimentos: ArrayImpedimentos,
          objImpedimentosRM: objInfoImpeditivos
        }

      }







      async impeditivosRural(paginaDosprevFormatada: any,
        parginaDosPrev: any
      ): Promise<IReturnImpedimentosRM> {
        let ArrayImpedimentos: string = '';

        const objInfoImpeditivos: IObjInfoImpeditivosRM = {} as IObjInfoImpeditivosRM;

        try {

          const dataSubtrair = 16;
          const DatasAtualEMenosDezesseis: Array<Date> =
            await datasRequerimentoNewDossie.dataRequerimento(paginaDosprevFormatada, dataSubtrair)
          if (DatasAtualEMenosDezesseis[0] == null) {
            ArrayImpedimentos = ArrayImpedimentos + " AUSÊNCIA DE REQUERIMENTO AUTOR -";
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
        } catch {
          ArrayImpedimentos = ArrayImpedimentos + " VÍNCULO ABERTO -";
        }




        const segurado = await seguradoEspecial.handle(parginaDosPrev);
        const requerimentoAtivo: IImpeditivoRequerimentoAtivo = await datasRequerimentoAtivoNewDossie.handle(
          paginaDosprevFormatada
        );
    
        if (segurado !== -1) {
          objInfoImpeditivos.concessaoAnterior = 'SEGURADO ESPECIAL ENCONTRADO';
          ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
        } else if (requerimentoAtivo.haveRequerimentoAtivo === true) {
          objInfoImpeditivos.concessaoAnterior = requerimentoAtivo.requerimentoAtivo;
          ArrayImpedimentos = ArrayImpedimentos + " CONCESSÃO ANTERIOR -";
        }




        const xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss = "/html/body/div/div[5]/table/tbody/tr/td"

          const NaoRelacaoDosProcessosMovidosPeloAutorContraOInss = getXPathText(paginaDosprevFormatada, xpathNaoRelacaoDosProcessosMovidosPeloAutorContraOInss);


          if(NaoRelacaoDosProcessosMovidosPeloAutorContraOInss !== null &&  NaoRelacaoDosProcessosMovidosPeloAutorContraOInss.trim() !== "Não há relação dos processos movidos pelo autor contra o INSS."){


            const xpathNumeroUnicoCnj = "/html/body/div/div[4]/table/tbody/tr[1]/td";
            const numeroUnicoCnj = getXPathText(paginaDosprevFormatada, xpathNumeroUnicoCnj);
          
            const processoJudicial: IImpeditivoLitispendencia = await buscarTabelaRelacaoDeProcessos(paginaDosprevFormatada, numeroUnicoCnj.trim().replace(/\D/g, ''));
           
            if(processoJudicial.haveLitispendencia){
              objInfoImpeditivos.litispendencia = processoJudicial.litispendencia;
              ArrayImpedimentos = ArrayImpedimentos + " POSSÍVEL LITISPENDÊNCIA/COISA JULGADA r-";
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





      




      async impeditivosLoas(paginaDosprevFormatada: any,
        parginaDosPrev: any): Promise<IReturnImpedimentosLOAS> {
          let ArrayImpedimentos: string = ''; 
          const objInfoImpeditivos: IObjInfoImpeditivosLoas = {} as IObjInfoImpeditivosLoas;

          
          try{
            
            const restabelecimentoRequerimentos = await restabelecimentoRequerimentosSuperDossie.handle(paginaDosprevFormatada)
            console.log('RESTAB SUPER: ' + restabelecimentoRequerimentos)
  
            if (restabelecimentoRequerimentos instanceof Error) {
              ArrayImpedimentos = ArrayImpedimentos + " erro estabelecimento -"
            } else if (restabelecimentoRequerimentos.valorBooleano) {
              objInfoImpeditivos.requerimento = "IMPEDITIVO SOBRE REQUERIMENTO ENCONTRADO";
              ArrayImpedimentos = ArrayImpedimentos + restabelecimentoRequerimentos.impeditivo
            }

  
  
  
            const loasLitispendencia = await loasLitispendenciaSuperDossie.handle(paginaDosprevFormatada);
  
  
            if(loasLitispendencia instanceof Error){
              ArrayImpedimentos = ArrayImpedimentos + " erro estabelecimento -"
              }else if(loasLitispendencia){
                objInfoImpeditivos.litispendencia = "LITISPENDÊNCIA ENCONTRADA";
                ArrayImpedimentos = ArrayImpedimentos + " LITISPENDÊNCIA -"
              }


            const loasAtivo = await loasAtivoSuperDossie.handle(paginaDosprevFormatada)
            console.log('----TA ATIVO: ')
            console.log(loasAtivo)

            if (typeof(loasAtivo) == "object") {
              if (loasAtivo.valorBooleano) {
                objInfoImpeditivos.bpc = "BENEFÍCIO ATIVO ENCONTRADO";
                ArrayImpedimentos = ArrayImpedimentos + loasAtivo.impeditivo
              }
            }



            const loasIdade = await loasIdadeSuperDossie.handle(paginaDosprevFormatada)

            if (!loasIdade) {
              objInfoImpeditivos.idade = "IDADE INFERIOR"
              ArrayImpedimentos += " IDADE -"
            }


            ArrayImpedimentos += " *LOAS* ";

            return {
              arrayDeImpedimentos: ArrayImpedimentos,
              objImpedimentosLoas: objInfoImpeditivos
            }

          }catch(e){
            console.error(e)
          }






      }

}