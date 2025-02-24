import { ResponseArvoreDeDocumentoDTO } from "../../../GetArvoreDocumento";
import { IPicaPauCalculeDTO } from "../../dto";
import { verificarDossieMaisAtual } from "../../helps/verificarDossieMaisAtual";
import { montarObjetosEnvolvidos } from "../calculoLoas/montarObjetosEnvolvidos";

export async function getArrayObjetosEnvolvidos(
    grupoFamiliar: string[], 
    infoRequerente: IPicaPauCalculeDTO, 
    cookie: string,
    arrayDeDossiesNormais: ResponseArvoreDeDocumentoDTO[],
    arrayDeDossiesSuper: ResponseArvoreDeDocumentoDTO[],
): Promise<IPicaPauCalculeDTO[]> {
  let arrayDossieEnvolvidosNormal = [];
  let arrayDossieEnvolvidosSuper = [];

  for (let cpf of grupoFamiliar) {
    try {
      const dossie = await verificarDossieMaisAtual(
        cpf,
        cookie,
        arrayDeDossiesNormais,
        arrayDeDossiesSuper
      );
      if (dossie instanceof Error || !dossie) {
        console.error(`ERRO DOSPREV ENVOLVIDO CPF: ${cpf}`);
        continue;
      }

      const [dossieId, tipoDossie] = dossie;

      if (tipoDossie === 0) {
        arrayDossieEnvolvidosNormal.push(dossieId);
      } else if (tipoDossie === 1) {
        arrayDossieEnvolvidosSuper.push(dossieId);
      }
    } catch (error) {
      console.error(`Erro inesperado ao processar CPF ${cpf}:`, error);
    }
  }

  let arrayObjetosEnvolvidos = await montarObjetosEnvolvidos(
    arrayDossieEnvolvidosNormal,
    arrayDossieEnvolvidosSuper,
    infoRequerente,
    cookie
  );

  return arrayObjetosEnvolvidos;
}
